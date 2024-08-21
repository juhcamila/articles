import { Column, CreatedAt, DataType, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import { TutorialEntity } from "src/model/tutorial/entities/tutorial.entity";

@Table({
    tableName: 'users',
    timestamps: true
})
export class UserEntity extends Model<UserEntity> {
  @Column
  username: string;

  @Column
  password: string;

  @Column
  name: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt!: Date;

  @HasMany(() => TutorialEntity)
  tutorials: TutorialEntity
}
