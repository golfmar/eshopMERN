import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import fs from "fs";
import path from "path";
import { basename, extname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Получаем путь к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//================================== Регистрация нового пользователя с валидацией
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Проверка на ошибки валидации
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Создаем нового пользователя
    const newUser = new User({
      name,
      email,
      password,
    });

    // Хешируем пароль перед сохранением
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Сохраняем пользователя
    await newUser.save();

    // Генерируем JWT-токен
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//===================================== Авторизация пользователя с валидацией
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Проверка на ошибки валидации
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Находим пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Генерируем JWT-токен
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//=================================== Логин через Google
// Путь для хранения кэшированных изображений
const imageCachePath = path.join(__dirname, "../imageCache");

const getExtensionFromMimeType = (mimeType) => {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    case "image/svg+xml":
      return ".svg";
    default:
      return ".jpg"; // Если тип не распознан, по умолчанию сохраняем как JPG
  }
};

export const cacheImage = async (imageUrl) => {
  // Убираем параметры из URL, чтобы получить чистый путь
  const cleanUrl = imageUrl.split("?")[0]; // Убираем параметры URL

  // Получаем имя изображения из URL и делаем его безопасным для файловой системы
  const imageName = basename(cleanUrl.replace(/[^\w\s.-]/g, "_"));

  // Проверяем MIME-тип изображения
  const response = await axios.get(cleanUrl, { responseType: "arraybuffer" });
  const contentType = response.headers["content-type"];

  // Проверяем, что файл действительно изображение
  if (!contentType || !contentType.startsWith("image/")) {
    throw new Error("Скачанный файл не является изображением");
  }

  // Получаем расширение файла
  const ext = getExtensionFromMimeType(contentType);

  const imageNameWithExt = `${imageName}.jpeg`;

  // Путь для сохранения изображения в кэш
  const imagePath = join(imageCachePath, imageNameWithExt);

  // Проверяем, существует ли уже кэшированное изображение
  if (fs.existsSync(imagePath)) {
    return `/images/${imageNameWithExt}`; // Если файл существует, возвращаем путь к нему
  }
  console.log("imagePath", imagePath);
  try {
    // Сохраняем изображение с помощью sharp
    await sharp(Buffer.from(response.data)).toFile(imagePath); // Сохраняем изображение в файл

    return `/images/${imageNameWithExt}`; // Возвращаем путь к изображению
  } catch (error) {
    console.error("Ошибка при скачивании изображения:", error);
    throw new Error("Ошибка при скачивании изображения");
  }
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Проверка и декодирование токена Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Проверка на существование пользователя
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        picture,
        googleId: payload.sub,
      });

      await user.save();
    }

    // Кэшируем изображение и получаем путь к файлу
    const cachedImagePath = await cacheImage(picture);
    console.log("Путь к кэшированному изображению:", cachedImagePath);

    // Генерация JWT токена
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const imageUrl = cachedImagePath; // Путь к локальному изображению

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: imageUrl, // Локальный путь
      },
    });
  } catch (error) {
    console.error("Ошибка при авторизации через Google:", error);
    res.status(400).json({ message: "Google login failed" });
  }
};
// Получение информации о текущем пользователе
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Не возвращаем пароль
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
