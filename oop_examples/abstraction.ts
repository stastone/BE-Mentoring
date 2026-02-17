class AbstractedCar {
  constructor(
    public make: string,
    public model: string,
  ) {}

  private startEngine(): void {
    console.log("Engine started");
  }

  public drive(): void {
    this.startEngine();
    console.log(`Driving a ${this.make} ${this.model}`);
  }
}
