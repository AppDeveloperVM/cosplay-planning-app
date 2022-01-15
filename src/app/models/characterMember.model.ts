import { User } from "./user.model";

export class CharacterMember {
    constructor(
        public name: string,
        public alternativeVersion: boolean,
        public versionName: string,
        public cosplayerId: string,
        public asistanceConfirmed: boolean,
        public requestConfirmed: boolean
    ) {}
}