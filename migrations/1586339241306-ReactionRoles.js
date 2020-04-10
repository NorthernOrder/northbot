"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReactionRoles1586339241306 {
    async up(queryRunner) {
        await queryRunner.query('CREATE TABLE Role_Reaction (id character varying PRIMARY KEY NOT NULL, roles json[])');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE Role_Reaction');
    }
}
exports.ReactionRoles1586339241306 = ReactionRoles1586339241306;
