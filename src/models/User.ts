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
  public password!: string;

  @Column({ nullable: true })
  public refreshToken?: string;

  constructor(
    id: number,
    name: string,
    email: string,
    password?: string,
    refreshToken?: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    if (password) this.password = password;
    if (refreshToken) this.refreshToken = refreshToken;
  }

  public getUserInfo(): string {
    return `User ID: ${this.id}, Name: ${this.name}, Email: ${this.email}`;
  }
}
