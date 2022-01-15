import { PlaceLocation } from "./location.model";

export interface CosGroupMember {
    id?: string,
    name: string,
    alternativeVersion: boolean,
    versionName: string,
    cosplayerId: string,
    asistanceConfirmed: boolean,
    requestConfirmed: boolean
}