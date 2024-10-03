import express from "express";

import userRouter from "./src/routes/usuarios.routes.js";
import noticiaRouter from "./src/routes/noticias.routes.js";

const app = express();
app.use(express.json());

app.use(userRouter);
app.use(noticiaRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
