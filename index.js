import express from "express";

import multer from "multer";

import mongoose from "mongoose";

import cors from "cors";

// validations
import { registerValidation, loginValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";

// utils
import checkAuth from "./utils/checkAuth.js";
import handleValidationsErrors from "./utils/handleValidationsErrors.js";

// controllers
import { UserControllers, PostControllers } from "./Controllers/index.js";

//! (1)
const app = express();

//! (8)
//! Підключення MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("DB OK"));
  } catch (error) {
    console.log("DB doesnt connected(error)", error);
  }
};

//! Створення сховища від MULTER (картинки)
const storage = multer.diskStorage({
  // шляха збереження картинок
  // ця функція каже який шлях потрібно використовувати для завантаження туди картинок
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  // перед тим як цей файл сохранити ця функція вкаже як називається цей файл (file.originalname)
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

//! використання сховища від MULTER
const upload = multer({
  storage,
});

//! (5)
//! дає можливість читати json файли який буде приходити у наші запроси
app.use(express.json());
app.use(cors());
//? якщо express тобі прийде запрос на "/uploads" то тоді із своєї бібліотеки візьми express.static
//? і перевіряй чи є в цьому файлі "uploads" те що передаю
app.use("/uploads", express.static("uploads"));

//! (2)
//! Якщо прийде get запрос на головну адресу ('/') то ти повинен виконати функцію
app.get("/", (req, res) => {
  res.send("Hello World");
});

//? Реєстрація ========
//! (4)
//! Відловлюєм post запрос по адресу і отримуєм відповідь
app.post(
  "/auth/register",
  registerValidation,
  handleValidationsErrors,
  UserControllers.register
);
//? Реєстрація ========

//? Авторизація =====================
app.post(
  "/auth/login",
  loginValidation,
  handleValidationsErrors,
  UserControllers.login
);
//? Авторизація =====================

//? Отримання інформації про себе ==================
app.get("/auth/me", checkAuth, UserControllers.getMe);
//? Отримання інформації про себе ==================

//! ROUTES MULTER (ЗАВАНТАЖЕННЯ КАРТИНОК) =====================
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  // Якщо завантеження пройшло успішно після перевірки цієї частини upload.single("image")
  // Тоді ми скажем клієнту ось твоя силка на картинку url: `/uploads/${req.file.originalname}`
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
//! ROUTES MULTER (ЗАВАНТАЖЕННЯ КАРТИНОК) =====================

//! ROUTES POSTS ======================
app.get("/tags", PostControllers.getLastTags);

app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationsErrors,
  PostControllers.create
);
app.get("/posts/tags", PostControllers.getLastTags);
app.get("/posts", PostControllers.getAll);
app.get("/posts/:id", PostControllers.getOne);
app.delete("/posts/:id", checkAuth, PostControllers.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationsErrors,
  PostControllers.update
);
//! ROUTES POSTS ======================

//! (3)
//! Localhost для запуску сайта
connectDB().then(() => {
  app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
      return console.log(err);
    }

    console.log("Server OK");
  });
});
