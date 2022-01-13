import { Coordinates } from "../../models/location.model";

export class Place {
  constructor(
    public id: string,
    public planningId: string,
    public name: string,
    public description: string,
    public coords: Coordinates
  ) {}
}
