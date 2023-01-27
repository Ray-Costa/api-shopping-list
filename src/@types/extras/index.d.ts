import * as express from "express";
import { Lista } from "../../interface";

declare global {
  namespace Express {
    interface Request {
      itemList: Lista;
    }
  }
}
