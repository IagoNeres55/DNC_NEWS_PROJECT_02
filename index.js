import express from "express";
import bcrypt from "bcrypt";
import usuarioModel from "./src/module/usuario/usuario.model.js";
import generateToken from "./src/service/auth.service.js";
import { authMiddleware } from "./src/middlewares/auth.middlewares.js";
import { Router } from "express";
const router = Router();

const app = express();



app.use(express.json());

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email obrigatória" });
  }
  if (!senha) {
    return res.status(400).json({ message: "Senha obrigatória" });
  }

  const userLogin = await usuarioModel.findOne({ email });
  if (!userLogin) {
    return res.status(400).json({ message: "Email inexistente" });
  }

  // compara as duas senhas
  const validarSenha = bcrypt.compareSync(senha, userLogin.senha);
  if (!validarSenha) {
    return res.status(400).json({ message: "Senha inválida" });
  }

  return res.status(200).json({
    id: userLogin._id,
    nome: userLogin.nome,
    email: userLogin.email,
    token: generateToken(userLogin._id),
  });
});

app.get("/usuarios", async (req, res) => {
  const usuarios = await usuarioModel.find().select('-senha')
  return res.status(200).json(usuarios);
});

router.use(authMiddleware);
app.post("/usuarios", async (req, res) => {
  if (!req.body.nome) {
    return res.status(400).json({ message: "nome obrigatório" });
  }
  if (!req.body.email) {
    return res.status(400).json({ message: "email obrigatória" });
  }
  if (!req.body.senha) {
    return res.status(400).json({ message: "Senha obrigatória" });
  }
  // TODO verificar se o usuario existe na base
  const userExistente = await usuarioModel.findOne({ email: req.body.email });
  if (userExistente) {
    return res.status(400).json({ message: "Email já utilizado" });
  }
  // recebe a senha e ciptografa ela para poder salvar no banco
  const senhaCripitografada = bcrypt.hashSync(req.body.senha, 10);
  const novoUser = await usuarioModel.create({
    nome: req.body.nome,
    email: req.body.email,
    senha: senhaCripitografada
  });
  return res.status(201).json({
    id: novoUser._id,
    nome: novoUser.nome,
    mail: novoUser.email,
    message: "Usuário criado com sucesso",
  });
});

app.get("/noticias", (req, res) => {
  return res.status(200).json([]);
});

app.post("/noticias", (req, res) => {
  return res.status(201).json([]);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
