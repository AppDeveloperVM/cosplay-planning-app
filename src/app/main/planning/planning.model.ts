import { PlaceLocation } from '../../models/location.model';

export class Planning {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public location: PlaceLocation,
    public places: any[],
    public startsAt: Date,
    public endsAt: Date,
    public userId: string
  ) {}
}
