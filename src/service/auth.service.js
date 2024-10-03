
// # gerar o token de autorização
import jwt from "jsonwebtoken";
import "dotenv/config";

function generateToken(user) {
  const id = user
  return jwt.sign({ id }, process.env.SECRET_KEY_JWT, {
    expiresIn: "24h",
  });
}

export default generateToken;
