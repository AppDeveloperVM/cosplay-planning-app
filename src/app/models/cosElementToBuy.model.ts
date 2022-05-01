import { Store } from "./store.mode";

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