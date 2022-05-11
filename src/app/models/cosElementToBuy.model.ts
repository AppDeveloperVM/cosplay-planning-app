import { Store } from "./store.model";

export interface CosElementToBuy {
    id: string;
    name: string;
    type: cosElementType;
    image: string;
    notes: string;
    stores: Store;
    cost: number;
    important: boolean;
    completed: boolean;
  }