import jwt from "jsonwebtoken";

export const createToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
};

export const getToken = (req) => {
  const tokens = req.headers.cookie; // lấy tất cả cookie được gửi lên từ request

  if (!tokens) return null;

  const tokenArray = tokens.split("; ");

  const userConfirmation = tokenArray.find((token) =>
    token.startsWith("userConfirmation=")
  );
  if (!userConfirmation) return null;

  return userConfirmation.split("=")[1];
};
