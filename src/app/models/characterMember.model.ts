import { User } from "./user.model";

export class CharacterMember {
    constructor(
        public name: string,
        public cosplayerId: string,
        public asistanceConfirmed: boolean,
    ) {}
}