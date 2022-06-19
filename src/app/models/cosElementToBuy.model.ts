import { Store } from "./store.model";

export interface CosElementToBuy {
    id: string;
    name: string;
    image: string;
    cost: number;
    stores: Store;
    notes: string;
    important: boolean;
    completed: boolean;
  }