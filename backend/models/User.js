import mongoose from "mongoose";

// Определяем схему пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Имя пользователя обязательно
    trim: true, // Убираем пробелы по краям
    minlength: [3, "Name must be at least 3 characters"], // Минимальная длина имени
    maxlength: [100, "Name must be less than 100 characters"], // Максимальная длина имени
  },
  email: {
    type: String,
    required: true, // Email обязателен для пользователя
    unique: true, // Email должен быть уникальным
    lowercase: true, // Преобразуем email в нижний регистр
    trim: true, // Убираем пробелы по краям
    match: [/.+@.+\..+/, "Please provide a valid email address"], // Валидация на правильный формат email
  },
  password: {
    type: String,
    required: true, // Пароль обязателен
    minlength: [6, "Password must be at least 6 characters"], // Минимальная длина пароля
  },
  picture: {
    type: String, // URL изображения пользователя
    default: "", // По умолчанию пустое поле
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Роль может быть только "user" или "admin"
    default: "user", // Если роль не указана, то по умолчанию будет "user"
  },
  createdAt: {
    type: Date,
    default: Date.now, // Дата создания пользователя
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Дата последнего обновления
  },
});

// Хук для обновления времени изменения перед сохранением
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now(); // Обновляем дату последнего изменения
  next();
});

// Создаем модель пользователя
const User = mongoose.model("User", userSchema);

export default User;
