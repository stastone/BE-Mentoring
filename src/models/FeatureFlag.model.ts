import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity("feature_flags")
export class FeatureFlag {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ unique: true })
  name!: string;

  @Column()
  enabled!: boolean;

  @Column({ nullable: true })
  description?: string;
}
