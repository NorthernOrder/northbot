import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class RoleReaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  msgID!: string;

  @Column()
  emoji!: string;

  @Column()
  roleID!: string;
}
