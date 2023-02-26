import { body } from "express-validator";

//! Валідація
export const registerValidation = [
  //? Перевірка.. якщо email коректний то пропускаєм. якщо email не являється email буде помилка
  body("email", "НЕПРАВИЛЬНИЙ ФОРМАТ EMAIL").isEmail(),
  //? Перевірка.. якщо в password буде більше 5 символів тоді ок якшо менше 5 буде помилка
  body("password", "ПАРОЛЬ ПОВИНЕН БУТИ НЕ МЕНШЕ 5 СИМВОЛІВ").isLength({
    min: 5,
  }),
  //? Перевірка.. якщо в fullName буде більше 3 символів тоді ок якшо менше 3 буде помилка
  body("fullName", "ВКАЖІТЬ ІМ'Я").isLength({
    min: 3,
  }),
  //? Перевірка.. аватар це не обов'язкове поле але якщо avatarUrl буде то перевірь чи це є силкою(isUrl)
  body("avatarUrl", "НЕПРАВИЛЬНА СИЛКА НА АВАТАРКУ").optional().isURL(),
];

export const loginValidation = [
  //? Перевірка.. якщо email коректний то пропускаєм. якщо email не являється email буде помилка
  body("email", "НЕПРАВИЛЬНИЙ ФОРМАТ EMAIL").isEmail(),
  //? Перевірка.. якщо в password буде більше 5 символів тоді ок якшо менше 5 буде помилка
  body("password", "ПАРОЛЬ ПОВИНЕН БУТИ НЕ МЕНШЕ 5 СИМВОЛІВ").isLength({
    min: 5,
  }),
];
