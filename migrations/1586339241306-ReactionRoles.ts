import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReactionRoles1586339241306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE Role_Reaction (id character varying PRIMARY KEY NOT NULL, roles json[])',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE Role_Reaction');
  }
}
