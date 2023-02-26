import { body } from "express-validator";

//! Валідація
export const postCreateValidation = [
  body("title", "Впишіть заголовок статі").isLength({ min: 3 }).isString(),
  body("text", "Впишіть текст статі")
    .isLength({
      min: 3,
    })
    .isString(),
  //? Перевірка.. якщо в fullName буде більше 3 символів тоді ок якшо менше 3 буде помилка
  body("tags", "Неправильний формат тегів (вкажіть маси)")
    .optional()
    .isString(),
  //? Перевірка.. аватар це не обов'язкове поле але якщо avatarUrl буде то перевірь чи це є силкою(isUrl)
  body("imageUrl", "Неправильна силка на зображення").optional().isString(),
];
