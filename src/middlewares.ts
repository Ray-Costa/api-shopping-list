import { Item, ListaRequiredData, ListaRequiredKeys } from "./interface";
import { NextFunction, request, Request, Response } from "express";
import listas from "./database";

export const validateBodyMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(request.body);

  const requiredKeys: Array<ListaRequiredKeys> = ["listName", "data"];
  const requiredData: Array<ListaRequiredData> = ["name", "quantity"];

  const validatedKeys: boolean = requiredKeys.every(
    (key: string) => keys.includes(key) && keys.length === requiredKeys.length
  );

  if (!validatedKeys) {
    return response
      .status(400)
      .json({ message: `Invalid input - expected ${requiredKeys}` });
  }

  const validatedBodyKeys: boolean = requiredData.every((key: string) => {
    return request.body.data.every((dataObject: Item) => {
      const objectKeys = Object.keys(dataObject);
      return (
        objectKeys.includes(key) && objectKeys.length === requiredData.length
      );
    });
  });

  if (!validatedBodyKeys) {
    return response
      .status(400)
      .json({ message: `Invalid input data - expected ${requiredData}` });
  }

  const map: Map<string, string> = new Map([
    ["name", "string"],
    ["quantity", "string"],
    ["data", "object"],
    ["listName", "string"],
  ]);

  const bodyKeys = Object.keys(request.body);

  const hasInvalidTypes = bodyKeys.filter((key) => {
    return typeof request.body[key] !== map.get(key);
  });

  if (hasInvalidTypes.length) {
    return response.status(400).json({
      message: `Invalid type for ${hasInvalidTypes}`,
    });
  }

  for (const dataItem of request.body.data) {
    const dataItemKeys = Object.keys(dataItem);
    const hasInvalidType = dataItemKeys.filter((key) => {
      return typeof dataItem[key] !== map.get(key);
    });

    if (hasInvalidType.length) {
      return response.status(400).json({
        message: `Invalid type for ${hasInvalidType}`,
      });
    }
  }

  next();
};

export const ensureListExists = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const { id } = request.params;

  const foundListIndex: number = listas.findIndex(
    (element) => element.id === Number(id)
  );

  if (foundListIndex === -1) {
    return response
      .status(404)
      .json({ message: `List with id ${id} not found` });
  }

  request.itemList = listas[foundListIndex];
  request.foundListIndex = foundListIndex;

  next();
};

export const ensureNameEspecifcExists = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const itemName = request.params.name;
  const listObject = request.itemList;

  const indexEncontrado = listObject.data.findIndex(
    (element) => element.name === itemName
  );

  if (indexEncontrado === -1) {
    return response
      .status(404)
      .json({ message: `Item with name ${itemName} does not exist` });
  }

  request.foundDataIndex = indexEncontrado;
  request.itemList = listObject;

  next();
};
