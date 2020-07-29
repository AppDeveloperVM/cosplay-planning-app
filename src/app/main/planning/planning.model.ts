export class Planning {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public places: any[],
    public userId: string
  ) {}
}
