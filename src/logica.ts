import { request, Request, Response } from "express";
import listas from "./database";
import { Lista } from "./interface";

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

const readListId = (
  { foundListIndex }: Request,
  response: Response
): Response => {
  return response.status(200).json(listas[foundListIndex]);
};

const deleteSpecificItem = (request: Request, response: Response): Response => {
  const listObject = request.itemList;
  listObject?.data.splice(request.foundDataIndex, 1);
  return response.status(204).json();
};

const deleteList = (
  { foundListIndex }: Request,
  response: Response
): Response => {
  listas.splice(foundListIndex, 1);

  return response.status(204).json();
};

const updateList = (request: Request, response: Response): Response => {
  const listObject = request.itemList;
  const listItemIndex = request.foundDataIndex;

  listObject.data[listItemIndex] = {
    ...listObject.data[listItemIndex],
    ...request.body.data[listItemIndex],
  };

  listObject.listName = request.body.listName;

  return response.status(204).json();
};

export {
  createList,
  readList,
  readListId,
  deleteSpecificItem,
  deleteList,
  updateList,
};
