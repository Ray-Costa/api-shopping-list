import { NextFunction, Request, Response } from "express";
import listas from "../database";

export function getListaById(
  request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  const { id } = request.params;

  const itemList = listas.find((element) => element.id === Number(id));

  if (itemList) {
    request.itemList = itemList;
    return next();
  } else {
    return response
      .status(404)
      .json({ message: `Item with id ${id} does not exist` });
  }
}
