import { PlaceLocation } from "./location.model";

export interface CosGroup {
    id?: string,
    title: string,
    series: string,
    imageUrl: string,
    place: string,
    availableFrom: Date,
    availableTo: Date,
    userId: string,
    location: PlaceLocation
}