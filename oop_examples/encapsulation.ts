// Not encapsulated
class Car {
  constructor(
    public make: string,
    public model: string,
  ) {}
}

const car = new Car("Toyota", "Camry");
console.log(car.make); // Output: Toyota

// Encapsulated
class EncapsulatedCar {
  private _make: string;
  private _model: string;

  constructor(make: string, model: string) {
    this._make = make;
    this._model = model;
  }

  public getMake(): string {
    return this._make;
  }

  public getModel(): string {
    return this._model;
  }
}

const encapsulatedCar = new EncapsulatedCar("BMW", "X5");
console.log(encapsulatedCar.getMake()); // Output: BMW
console.log(encapsulatedCar.getModel()); // Output: X5
