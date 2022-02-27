export  interface PlanningInterface {
    id?: string;
    creationDate?: Date;
    title: string;
    description: string;
    imageUrl: string;
    places: any;
    location: any;
    startsAt: Date,
    endsAt: Date,
    userId: string;
  }