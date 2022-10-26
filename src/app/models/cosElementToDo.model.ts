import { cosElementType } from "./cosElementType.model";

export interface CosElementToDo {
    id: string;
    name: string;
    type: cosElementType;
    image: string;
    notes: string;
    time: string; 
    percentComplete: number;
    important: boolean;
  }