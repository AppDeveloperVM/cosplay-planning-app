import { PlaceLocation } from "../main/planning/location.model";

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