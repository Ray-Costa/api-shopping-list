export interface Lista {
  id: number;
  listName: string;
  data: Item[];
}

export interface Item {
  name: string;
  quantity: string;
}
