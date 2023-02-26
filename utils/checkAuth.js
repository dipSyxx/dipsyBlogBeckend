import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      // розшивровка токена
      const decoded = jwt.verify(token, "secretToken");

      // якщо все успішно передаєм в userId те що ми розшифрували
      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "Немає доступу",
      });
    }
  } else {
    return res.status(403).json({
      message: "Немає доступу",
    });
  }
};
