import express from "express";
import helmet from "helmet";
import router from "./api/router.js";

export default function setup_web() {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(router);

  const port = process.env.PORT ?? 3000;
  app.listen(port, () => {
    console.log(`REST server started on ${port}`);
    console.log(`Visit localhost:${port}/`);
  });
}
