import express, { Application } from "express";
import {
  createList,
  readList,
  readListId,
  deleteSpecificItem,
  deleteList,
  updateList,
} from "./logica";
import {
  ensureListExists,
  ensureNameEspecifcExists,
  validateBodyMiddleware,
} from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/purchaseList", validateBodyMiddleware, createList);

app.get("/purchaseList", readList);

app.get("/purchaseList/:id", ensureListExists, readListId);

app.delete(
  "/purchaseList/:id/:name",
  ensureListExists,
  ensureNameEspecifcExists,
  deleteSpecificItem
);

app.delete("/purchaseList/:id", ensureListExists, deleteList);

app.patch(
  "/purchaseList/:id/:name",
  validateBodyMiddleware,
  ensureListExists,
  ensureNameEspecifcExists,
  updateList
);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;

app.listen(PORT, () => console.log(runningMsg));
