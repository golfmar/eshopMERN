import axios from "axios";
import { fileURLToPath } from "url"; // Правильный импорт
import { dirname, join, extname } from "path";
import fs from "fs";
import sharp from "sharp";

// Получаем путь к текущей директории через import.meta.url и преобразуем его в обычный путь
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Путь для хранения кэшированных изображений (папка уже существует в корне)
const imageCachePath = join(__dirname, "../imageCache"); // Указываем относительный путь к папке imageCache

// Функция для получения расширения из MIME-типов
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

export const getImageFromCache = async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required." });
  }

  const decodedImageUrl = decodeURIComponent(imageUrl); // Декодируем URL
  const imageName = decodedImageUrl.split("/").pop(); // Получаем имя изображения из URL

  let imagePath = join(imageCachePath, imageName); // Формируем путь к изображению в кэше

  console.log("Проверка существования изображения:", imagePath);

  try {
    // Проверяем, существует ли изображение в кэше
    await fs.promises.access(imagePath, fs.constants.F_OK); // Асинхронная проверка
    return res.sendFile(imagePath); // Отдаем файл с кэша
  } catch (error) {
    console.log("Изображение не найдено в кэше, скачиваем...");
  }

  try {
    // Пытаемся скачать изображение
    const response = await axios.get(decodedImageUrl, {
      responseType: "arraybuffer",
    });

    // Проверяем MIME-тип изображения
    const contentType = response.headers["content-type"];
    if (!contentType || !contentType.startsWith("image/")) {
      return res.status(400).json({
        message: "The provided URL does not point to a valid image.",
      });
    }

    // Получаем расширение файла
    const ext = getExtensionFromMimeType(contentType);

    const imageNameWithExt = `${imageName}.jpeg`;
    // Путь для сохранения изображения в кэш
    const imagePath = join(imageCachePath, imageNameWithExt);

    // Сохраняем изображение с помощью sharp
    await sharp(Buffer.from(response.data)).toFile(imagePath);
    console.log("Изображение успешно сохранено.");

    // Отдаем файл из кэша
    return res.sendFile(imagePath);
  } catch (error) {
    console.error("Ошибка при скачивании или сохранении изображения:", error);
    return res
      .status(500)
      .json({ message: "Error downloading or saving image." });
  }
};
