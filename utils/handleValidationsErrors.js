import { validationResult } from "express-validator";

export default (req, res, next) => {
  // Parssing
  //? якщо валідація не пройшла верни список ошибок якщо немає ошибок то йди до іншої функції
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};
