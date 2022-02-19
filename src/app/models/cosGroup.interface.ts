import { CosGroupMember } from "./cosGroupMember.interface";
import { PlaceLocation } from "./location.model";

export interface CosGroup {
    id?: string,
    title: string,
    series: string,
    imageUrl: string,
    place: string,
    dateFrom: Date,
    dateTo: Date,
    userId: string,
    location: PlaceLocation
    cosMembers: CosGroupMember
}