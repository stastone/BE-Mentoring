import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public name: string;

  @Column()
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
