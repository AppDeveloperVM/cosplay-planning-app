export class CosplayGroup {
    constructor(
        public id: string,
        public title: string,
        public series: string,
        public imageUrl: string,
        public availableFrom: Date,
        public availableTo: Date,
        public userId: string
    ) { }
}
