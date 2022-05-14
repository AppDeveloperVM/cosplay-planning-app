import { CosElementToBuy } from "./cosElementToBuy.model";
import { CosElementToDo } from "./cosElementToDo.model";
import { CosTask } from "./cosTask.model";
import { imagesData } from "./imagesData.model";

export class Cosplay {
    constructor(
        public id: string,
        public creationDate: Date,
        public characterName: string,
        public description: string,
        public imageUrl: string,
        public series: string,
        public funds: number,
        public percentComplete: string,
        public status: boolean,
        public userId: string,
        public elementsToBuy?: CosElementToBuy,
        public elementsToMake?: CosElementToDo,
        public tasks?: CosTask
    ) {}
}
