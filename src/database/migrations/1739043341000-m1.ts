import { MigrationInterface, QueryRunner } from 'typeorm';

export class M11739043341000 implements MigrationInterface {
  name = 'M11739043341000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`transaction\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`type\` enum ('deposit', 'withdrawal', 'transfer') NOT NULL, \`label\` text NULL, \`fromId\` varchar(36) NULL, \`toId\` varchar(36) NULL, \`byId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`cashbox\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`balance\` decimal(10,2) NOT NULL DEFAULT '0.00', \`managerId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`role\` enum ('admin', 'manager', 'cashier', 'user', 'guest') NOT NULL, \`profile\` varchar(255) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_ac3d6711c8adf322a76c0d1a227\` FOREIGN KEY (\`fromId\`) REFERENCES \`cashbox\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_a02bf62a801914225fc2cad7ff7\` FOREIGN KEY (\`toId\`) REFERENCES \`cashbox\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_4a1dee9fb9349edbe3411984750\` FOREIGN KEY (\`byId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`cashbox\` ADD CONSTRAINT \`FK_ebfdbaaf19ea0a1a28f0f970709\` FOREIGN KEY (\`managerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`cashbox\` DROP FOREIGN KEY \`FK_ebfdbaaf19ea0a1a28f0f970709\``);
    await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_4a1dee9fb9349edbe3411984750\``);
    await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_a02bf62a801914225fc2cad7ff7\``);
    await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_ac3d6711c8adf322a76c0d1a227\``);
    await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`cashbox\``);
    await queryRunner.query(`DROP TABLE \`transaction\``);
  }
}
