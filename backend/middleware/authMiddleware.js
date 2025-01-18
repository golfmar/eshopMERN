import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware для проверки токена
export const protect = async (req, res, next) => {
  let token;

  // Проверяем наличие токена в заголовках Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Проверяем и декодируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Получаем пользователя из базы данных
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Переходим к следующему middleware/маршруту
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
