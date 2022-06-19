export  interface PlanningInterface {
    id?: string;
    creationDate?: Date;
    title: string;
    description: string;
    imageUrl: string;
    location: any;
    places: any;
    startsAt: Date,
    endsAt: Date,
    userId: string;
  }