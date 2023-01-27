import { request, Request, Response } from "express";
import listas from "./database";
import { Item, Lista } from "./interface";

let idCount = 0;

const createList = (request: Request, response: Response): Response => {
  const newList: Lista = request.body;
  newList.id = idCount + 1;
  idCount += 1;
  listas.push(newList);

  return response.status(201).json(newList);
};

const readList = (request: Request, response: Response): Response => {
  return response.status(200).json(listas);
};

const readListId = (request: Request, response: Response): Response => {
  return response.status(200).json(request.itemList);
};

const deleteSpecificItem = (request: Request, response: Response): Response => {
  const itemName = request.params.name;
  const listObject = request.itemList;

  const indexEncontrado = listObject?.data.findIndex(
    (element) => element.name === itemName
  );

  if (indexEncontrado === -1 || !indexEncontrado) {
    return response
      .status(404)
      .json({ message: `Item with name ${itemName} does not exist` });
  }

  listObject?.data.splice(indexEncontrado, 1);

  return response.status(204).json();
};

const deleteList = (request: Request, response: Response): Response => {
  const id = request.params.id;

  const indexEncontrado = listas.findIndex(
    (element) => element.id === Number(id)
  );

  if (indexEncontrado === -1) {
    return response
      .status(404)
      .json({ message: `List with id ${id} does not exist` });
  }

  listas.splice(indexEncontrado, 1);

  return response.status(204).json();
};

const updateList = (request: Request, response: Response): Response => {
  const itemName = request.params.name;
  const listObject = request.itemList;

  const listItemIndex = listObject.data.findIndex(
    (element) => element.name === itemName
  );

  if (listItemIndex === -1) {
    return response.status(404).json({
      message: `Item with name ${itemName} does not exist`,
    });
  }

  listObject.data[listItemIndex] = {
    ...listObject.data[listItemIndex],
    ...request.body.data[listItemIndex],
  };

  return response.status(204).json();
};

function badRequest(
  response: Response<any, Record<string, any>>,
  requiredAttributes: string[]
): Response<any, Record<string, any>> {
  return response.status(400).json({
    message: `Updatable fields are ${requiredAttributes.join(" and ")}`,
  });
}

export {
  createList,
  readList,
  readListId,
  deleteSpecificItem,
  deleteList,
  updateList,
};
