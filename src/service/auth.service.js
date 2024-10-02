
// # gerar o token de autorização
import jwt from "jsonwebtoken";
import "dotenv/config";

function generateToken(user) {
  return jwt.sign({ user }, process.env.SECRET_KEY_JWT, {
    expiresIn: "24h",
  });
}

export default generateToken;
