import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import multer from "multer";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { getImageFromCache } from "./controllers/imageController.js";
import { sendContactEmail } from "./controllers/contactController.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
// --------------------------------------------------
const upload = multer();
dotenv.config();
connectDB();
const app = express();

// ========================================
// Получаем путь к текущей директории с помощью import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Папка, где будут храниться кэшированные изображения
const imageCachePath = path.join(__dirname, "imageCache");

// Создаем директорию для кэшированных изображений, если она не существует
fs.mkdirSync(imageCachePath, { recursive: true });

// Настройка статического сервера для изображений
// Это будет отдавать файлы из папки imageCache
app.use("/images", express.static(imageCachePath));
// ========================================

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log(process.env.PORT);
console.log(process.env.MONGO_URI);
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(
  cors({
    // origin: "http://localhost:3000",
    // origin: "https://e-shop-react-tau.vercel.app",
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(
    `Incoming request:  method=${req.method} url=${req.url}   body=${
      req.body
    }    body=${JSON.stringify(req.body, null, 2)}`
  );
  next();
});

// ====================================
app.use(
  "/products",
  upload.none(),
  (req, res, next) => {
    console.log("Body content:", req.body);
    next();
  },
  productRoutes
);
// ====================================
app.use("/categories", upload.none(), categoryRoutes);
// ====================================
app.use("/auth", upload.none(), authRoutes);
// ====================================
app.use("/orders", upload.none(), orderRoutes);
// ====================================
app.get("/api/getImage", getImageFromCache);
// ====================================
app.post("/contact", upload.none(), sendContactEmail);
// ====================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Server running on ${PORT}`);
});
