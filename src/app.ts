import express, { Application } from "express";
import {
  createList,
  readList,
  readListId,
  deleteSpecificItem,
  deleteList,
  updateList,
} from "./logica";

import { validateRequiredAttributes } from "./middlewares/validate";
import { getListaById } from "./middlewares/getListaById";

const app: Application = express();
app.use(express.json());

app.post("/purchaseList", validateRequiredAttributes, createList);
app.get("/purchaseList", readList);
app.get("/purchaseList/:id", getListaById, readListId);
app.delete("/purchaseList/:id/:name", getListaById, deleteSpecificItem);
app.delete("/purchaseList/:id", deleteList);
app.patch(
  "/purchaseList/:id/:name",
  validateRequiredAttributes,
  getListaById,
  updateList
);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;

app.listen(PORT, () => console.log(runningMsg));
