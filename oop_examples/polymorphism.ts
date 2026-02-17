class BasicCar {
  constructor(
    public make: string,
    public model: string,
  ) {}

  public drive(): void {
    console.log(`Driving a ${this.make} ${this.model}`);
  }
}

class FrontWheelDriveCar extends BasicCar {
  constructor(make: string, model: string) {
    super(make, model);
  }

  public drive(): void {
    console.log(`Driving a front-wheel drive ${this.make} ${this.model}`);
  }
}

class RearWheelDriveCar extends BasicCar {
  constructor(make: string, model: string) {
    super(make, model);
  }

  public drive(): void {
    console.log(`Driving a rear-wheel drive ${this.make} ${this.model}`);
  }
}

class AllWheelDriveCar extends BasicCar {
  constructor(make: string, model: string) {
    super(make, model);
  }

  public drive(): void {
    console.log(`Driving an all-wheel drive ${this.make} ${this.model}`);
  }
}
