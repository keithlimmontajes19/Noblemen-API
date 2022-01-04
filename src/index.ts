import "reflect-metadata";
import { createConnection } from "typeorm";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./route/index";

createConnection()
  .then(async (connection) => {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    app.listen(8080, () => console.log("App is running at port 8080."));

    app.get("/user", (req, res) => {
      res.json("hel");
    });
  })
  .catch((error) => console.log(error));
