// #validar se o token e valido

import jwt from "jsonwebtoken";
import "dotenv/config";
import usuarioModel from "../module/usuario/usuario.model.js";

export function authMiddleware(res, req, next) {
  const tokenHeaders = req.headers.authorization;

  if (!tokenHeaders) {
    return res.status(401).send({ message: "token não informado" });
  }

  const separarToken = tokenHeaders.split(" ");
  if (separarToken.length !== 2) {
    return res.status(401).send({ message: "Token invalido" });
  }

  const [schema, token] = separarToken;

  if (!/^Bearer$/i.test(schema)) {
    return res.status(401).send({ message: "Token fora do formato Bearer" });
  }

  jwt.verify(token, process.env.SECRET_KEY_JWT, async (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ message: "Token invalido", error: err.message });
    }

    const user = await usuarioModel.findById(decoded._id);

    if (!user || !user._id) {
      res.status(401).send({ message: "token invalido" });
    }

    req.id = user._id;
    return next();
  });
}
