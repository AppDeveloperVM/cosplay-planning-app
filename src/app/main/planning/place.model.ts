import { Coordinates } from "./location.model";

export class Place {
  constructor(
    public id: string,
    public planningId: string,
    public name: string,
    public description: string,
    public coords: Coordinates
  ) {}
}
