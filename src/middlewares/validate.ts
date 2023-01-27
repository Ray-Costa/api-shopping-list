import { NextFunction, Request, Response } from "express";
import { Item, Lista } from "../interface";

function validate(obj: any, requiredAttributes: string[]) {
  const attributePaths = requiredAttributes.map((attr) => attr.split("."));
  for (const path of attributePaths) {
    let current = obj;
    for (const attr of path) {
      if (Array.isArray(current)) {
        if (current.some((item) => !item.hasOwnProperty(attr))) {
          return `${path.join(".")} is a required attribute.`;
        }
      } else if (!current.hasOwnProperty(attr)) {
        return `${path.join(".")} is a required attribute.`;
      }
      current = current[attr];
    }
  }
  return;
}

const validateAcceptableListAttributes = (payload: Lista) => {
  const acceptableAttributes = ["listName", "data"];
  const keys = Object.keys(payload);
  for (const key of keys) {
    if (!acceptableAttributes.includes(key)) {
      return acceptableAttributes;
    }
  }
};

const validateAcceptableDataAttributes = (payload: Item[]) => {
  const acceptableAttributes = ["name", "quantity"];

  for (const item of payload) {
    const objectKeys = Object.keys(item);
    for (const key of objectKeys) {
      if (!acceptableAttributes.includes(key)) {
        return acceptableAttributes;
      }
    }
  }
};

export const validateRequiredAttributes = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const missingAttrs = validate(request.body, [
    "listName",
    "data",
    "data.name",
    "data.quantity",
  ]);

  if (missingAttrs && missingAttrs.length) {
    return response
      .status(400)
      .send({ message: `missing attributes: ${missingAttrs}` });
  }

  const itemDataErrors = validateAcceptableDataAttributes(request.body.data);
  const listErrors = validateAcceptableListAttributes(request.body);

  if (itemDataErrors && itemDataErrors.length) {
    return response.status(400).send({
      message: `Updatable fields are: ${itemDataErrors.join(" and ")}`,
    });
  }

  if (listErrors && listErrors.length) {
    return response.status(400).send({
      message: `Updatable fields are: ${listErrors.join(" and ")}`,
    });
  }

  return next();
};
