import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

//! Реєстрація ======================================================================================

export const register = async (req, res) => {
  //! отримуєм помилки
  try {
    //TODO шифрування пароля ==========

    //! Витягаєм пароль з request
    const password = req.body.password;
    //! Генеруєм шифрування
    const salt = await bcrypt.genSalt(10);
    //! Зберігання зашифрованого паролю
    const hashPassword = await bcrypt.hash(password, salt);

    //TODO шифрування пароля ==========

    //! Створення користувача за допомогою MongoDB
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hashPassword,
    });

    //! Створення самого користувача (Збереження)
    const user = await doc.save();

    //! Шифрування інформації(_id) в токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      //! secret token обово'язковий
      "secretToken",
      {
        //! Вказання часу строк придатності цього токена
        expiresIn: "30d",
      }
    );

    //! константа яка деструктує passwordHash щоб в user._doc цей passwordHash не відображався
    const { passwordHash, ...userData } = user._doc;

    //! Якщо помилок немає повертаєм інформацію про користувача
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося зареєструватись",
    });
  }
};

//! Реєстрація ======================================================================================

//? Авторизація ======================================================================================

export const login = async (req, res) => {
  try {
    //! пошук користувача
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    //! якщо користувач не знайшовся...
    if (!user) {
      return res.status(404).json({
        message: "Нічого в базі даних про користувача не знайдено",
      });
    }

    //! Перевірка..якщо користувач знайшовся в базі даних перевірити пароль
    //! який є в базі даних чи співпадає те що надіслав користувач
    //! пишем bcrypt порівняй ці два пароля в тілі запросу і який є в документі у користувача чи сходяться вони?
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    //! якщо не сходиться то попереджуєм про це
    if (!isValidPass) {
      return res.status(400).json({
        message: "Неправильний логін або пароль",
      });
    }

    //! Якщо все успішно створюєм токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      //! secret token обово'язковий
      "secretToken",
      {
        //! Вказання часу строк придатності цього токена
        expiresIn: "30d",
      }
    );

    //! константа яка деструктує passwordHash щоб в user._doc цей passwordHash не відображався
    const { passwordHash, ...userData } = user._doc;

    //! Якщо помилок немає повертаєм інформацію про користувача
    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося авторизуватись",
    });
  }
};

//? Авторизація ======================================================================================

//TODO Отримання інформації про себе ====================================================================

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Користувач не знайдений",
      });
    }
    //! константа яка деструктує passwordHash щоб в user._doc цей passwordHash не відображався
    const { passwordHash, ...userData } = user._doc;

    //! Якщо помилок немає повертаєм інформацію про користувача
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Немеє доступу",
    });
  }
};

//TODO Отримання інформації про себе ====================================================================
