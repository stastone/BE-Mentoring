import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column()
  public role: "user" | "admin" = "user";

  @Column({ nullable: true })
  public refreshToken?: string;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    role: "user" | "admin" = "user",
    refreshToken?: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    if (refreshToken) this.refreshToken = refreshToken;
  }

  public getUserInfo(): string {
    return `User ID: ${this.id}, Name: ${this.name}, Email: ${this.email}, Role: ${this.role}`;
  }
}
