import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { UserEntity } from "src/model/auth/entities/auth.entity";

@Table({
    tableName: 'tutorials'
})
export class TutorialEntity extends Model<TutorialEntity> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

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

  @ForeignKey(() => UserEntity)
  @Column
  user_id: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;
}
