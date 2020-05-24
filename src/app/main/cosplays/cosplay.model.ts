export class Cosplay {
    constructor(
        public id: string,
        public characterName: string,
        public description: string,
        public imageUrl: string,
        public series: string,
        public funds: number,
        public percentComplete: string,
        public status: boolean,
        public userId: string
    ) {}
}