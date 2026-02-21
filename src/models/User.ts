export class User {
  public readonly id: number;
  public name: string;
  public email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  public getUserInfo(): string {
    return `User ID: ${this.id}, Name: ${this.name}, Email: ${this.email}`;
  }
}
