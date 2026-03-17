import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { UserType } from "../schemas/User.schema.js";

@Entity()
export class User implements UserType {
  @PrimaryGeneratedColumn("uuid")
  public readonly id!: string;

  @Column()
  public name!: string;

  @Column()
  public email!: string;

  @Column()
  public password!: string;

  @Column()
  public role: "user" | "admin" = "user";

  @Column({ type: "text", nullable: true })
  public refreshToken: string | null = null;
}
