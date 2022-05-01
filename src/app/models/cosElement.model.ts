export interface CosElement {
    id: string;
    name: string;
    image: string;
    type: string; // por comprar / por hacer 
    time: string; 
    percentComplete: number;
    cost: number;
    important: boolean;
    ready: boolean;
  }