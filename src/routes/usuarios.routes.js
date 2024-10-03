import { Router } from "express";
import usuarioModel from "../module/usuario/usuario.model.js";
import bcrypt from "bcrypt";
import generateToken from "../service/auth.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(400).send({ message: "email obrigatória" });
  }
  if (!senha) {
    return res.status(400).send({ message: "Senha obrigatória" });
  }

  const userLogin = await usuarioModel.findOne({ email });
  if (!userLogin) {
    return res.status(400).send({ message: "Email inexistente" });
  }

  // compara as duas senhas
  const validarSenha = bcrypt.compareSync(senha, userLogin.senha);
  if (!validarSenha) {
    return res.status(400).send({ message: "Senha inválida" });
  }

  return res.status(200).send({
    id: userLogin._id,
    nome: userLogin.nome,
    email: userLogin.email,
    token: generateToken(userLogin._id),
  });
});

router.post("/usuarios", async (req, res) => {
  if (!req.body.nome) {
    return res.status(400).send({ message: "nome obrigatório" });
  }
  if (!req.body.email) {
    return res.status(400).send({ message: "email obrigatória" });
  }
  if (!req.body.senha) {
    return res.status(400).send({ message: "Senha obrigatória" });
  }
  // TODO verificar se o usuario existe na base
  const userExistente = await usuarioModel.findOne({ email: req.body.email });
  if (userExistente) {
    return res.status(400).send({ message: "Email já utilizado" });
  }
  // recebe a senha e ciptografa ela para poder salvar no banco
  const senhaCripitografada = bcrypt.hashSync(req.body.senha, 10);
  const novoUser = await usuarioModel.create({
    nome: req.body.nome,
    email: req.body.email,
    senha: senhaCripitografada,
  });
  return res.status(201).send({
    id: novoUser._id,
    nome: novoUser.nome,
    mail: novoUser.email,
    message: "Usuário criado com sucesso",
  });
});

router.get("/usuarios", authMiddleware, async (req, res) => {
  const usuarios = await usuarioModel.find().select("-senha");
  return res.status(200).send(usuarios);
});

export default router;
