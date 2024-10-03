import { Router } from "express";
import noticiaModel from "../module/noticia/noticia.model.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/noticias", async (req, res) => {
  const noticias = await noticiaModel.find();

  return res.status(200).send(noticias);
});

router.post("/noticias", authMiddleware, async (req, res) => {
  if (!req.body.titulo) {
    return res.status(403).send({ message: "titulo obrigatório" });
  }
  if (!req.body.texto) {
    return res.status(403).send({ message: "texto obrigatório" });
  }
  const enviarNoticia = await noticiaModel.create({
    titulo: req.body.titulo,
    img: req.body.img,
    texto: req.body.texto,
    alt: req.body.alt,
  });

  if (!enviarNoticia) {
    return res.status(400).send({ message: "erro ao criar" });
  }
  console.log(enviarNoticia);
  return res.status(201).send(enviarNoticia);
});

router.put("/noticias/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;

  const { titulo, img, texto, alt } = req.body;

  if (!titulo || !texto) {
    return res
      .status(400)
      .send({ message: "Titulo e texto devem ser alterados" });
  }

  const noticia = await noticiaModel.findById(id);
  if (!noticia) {
    return res.status(404).send({ message: "noticia não encontrada" });
  }

  const payload = {
    titulo: titulo,
    img: img,
    texto: texto,
    alt: alt,
  };
  //  se caso o campo for undefined ele automaticamente nao manda
  try {
    // new: true: Retorna o documento atualizado em vez do original.
    // upsert: true: Se nenhum documento for encontrado, cria um novo documento com os dados fornecidos.
    // runValidators: true: Faz com que as validações do modelo sejam aplicadas durante a atualização (útil para garantir que os dados continuam válidos).
    // strict: true/false: Controla se campos que não estão no esquema devem ser permitidos na atualização.

    // ---------------
    //     filter: { email: 'usuario@example.com' } encontra o documento onde o campo email é igual a "usuario@example.com".
    // update: { $set: { nome: 'Novo Nome' } } define o campo nome para "Novo Nome".
    // options: { new: true } faz com que o documento retornado seja o atualizado, não o original.
    // O callback é chamado com o documento atualizado.
    const editarNoticia = await noticiaModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, strict: false }
    );

    if (!editarNoticia) {
      return res.status(404).send({ message: "Notícia não encontrada" });
    }
    return res.status(200).send(editarNoticia);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Erro ao atualizar notícia", error: err.message });
  }
});

router.delete("/noticias/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const noticia = await noticiaModel.findById(id);
  if (!noticia) {
    return res.status(404).send({ message: "noticia não encontrada" });
  }
  // collation: Permite definir a collation a ser usada para a operação. Isso é útil para operações que consideram a sensibilidade a maiúsculas/minúsculas ou ordenação de caracteres. Exemplo:
  // { collation: { locale: 'en', strength: 2 } }
  // session: Permite especificar uma sessão para a operação, útil em transações.
  // strict: Se definido como true, o Mongoose não permitirá que o documento seja excluído se o valor do conditions não corresponder a um documento. O padrão é false.
  try {
    const deletaNoticia = await noticiaModel.deleteOne({_id: id});

    return res.status(200).send(deletaNoticia);
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Erro ao deletar notícia", error: err.message });
  }
});

export default router;
