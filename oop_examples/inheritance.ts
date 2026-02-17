class ParentCar {
  constructor(
    public make: string,
    public model: string,
  ) {}

  public drive(): void {
    console.log(`Driving a ${this.make} ${this.model}`);
  }
}

class WheelDriveCar extends ParentCar {
  constructor(
    make: string,
    model: string,
    public wheelDrive: "forward" | "rear" | "all",
  ) {
    super(make, model);
  }
}
