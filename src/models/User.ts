import fs from "fs";

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

  public updateEmail(newEmail: string): void {
    this.email = newEmail;
  }

  public static getUserById(userId: number): User | null {
    const usersData = fs.readFileSync("src/mocks/users.json", "utf-8");
    const users = JSON.parse(usersData) as User[];
    return users.find((user) => user.id === userId) || null;
  }

  public static getUsers(): User[] {
    const usersData = fs.readFileSync("src/mocks/users.json", "utf-8");
    return JSON.parse(usersData) as User[];
  }

  public static createUser(name: string, email: string): User {
    const id = Math.floor(Math.random() * 1000);
    fs.appendFileSync(
      "src/mocks/users.json",
      JSON.stringify({ id, name, email }) + "\n",
    );
    return new User(id, name, email);
  }
}
