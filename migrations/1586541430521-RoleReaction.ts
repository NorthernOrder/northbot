import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleReaction1586541430521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE Role_Reaction (id SERIAL NOT NULL PRIMARY KEY, msgID character varying NOT NULL, emoji character varying NOT NULL, roleID character varying NOT NULL)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE Role_Reaction');
  }
}
