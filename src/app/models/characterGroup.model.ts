import { CharacterMember } from "./characterMember.model";


export class characterGroup {
    constructor(
        public member: CharacterMember,
        public cosplayGroupId: string,
    ) {}
}