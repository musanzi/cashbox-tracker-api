import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1739282274317 implements MigrationInterface {
  name = 'Init1739282274317';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`cashbox\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL, \`balance\` decimal(10,2) NOT NULL DEFAULT '0.00', \`managerId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`role\` enum ('admin', 'manager', 'cashier', 'user', 'guest') NOT NULL, \`profile\` varchar(255) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`transfer\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`label\` text NULL, \`fromCashboxId\` varchar(36) NULL, \`toCashboxId\` varchar(36) NULL, \`byId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`transaction\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`category\` enum ('Dépôt Externe', 'Revenus des Ventes', 'Emprunt Reçu', 'Investissement', 'Subvention', 'Achat', 'Paiement de Frais', 'Paiement des Salaires', 'Paiement du Loyer', 'Factures (Électricité, Eau, Internet)', 'Transport', 'Impôts', 'Entretien et Réparations', 'Remboursement de Dette', 'Don') NOT NULL, \`label\` text NULL, \`cashboxId\` varchar(36) NULL, \`byId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`cashbox\` ADD CONSTRAINT \`FK_ebfdbaaf19ea0a1a28f0f970709\` FOREIGN KEY (\`managerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`transfer\` ADD CONSTRAINT \`FK_0224533086630c1fa667d78d11b\` FOREIGN KEY (\`fromCashboxId\`) REFERENCES \`cashbox\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`transfer\` ADD CONSTRAINT \`FK_dc211714f5a777fd1fc33f9a342\` FOREIGN KEY (\`toCashboxId\`) REFERENCES \`cashbox\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`transfer\` ADD CONSTRAINT \`FK_c8f4e901c837a7ba0aee10fe033\` FOREIGN KEY (\`byId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_229b24a5a5730545b045f75bc1b\` FOREIGN KEY (\`cashboxId\`) REFERENCES \`cashbox\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_4a1dee9fb9349edbe3411984750\` FOREIGN KEY (\`byId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_4a1dee9fb9349edbe3411984750\``);
    await queryRunner.query(`ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_229b24a5a5730545b045f75bc1b\``);
    await queryRunner.query(`ALTER TABLE \`transfer\` DROP FOREIGN KEY \`FK_c8f4e901c837a7ba0aee10fe033\``);
    await queryRunner.query(`ALTER TABLE \`transfer\` DROP FOREIGN KEY \`FK_dc211714f5a777fd1fc33f9a342\``);
    await queryRunner.query(`ALTER TABLE \`transfer\` DROP FOREIGN KEY \`FK_0224533086630c1fa667d78d11b\``);
    await queryRunner.query(`ALTER TABLE \`cashbox\` DROP FOREIGN KEY \`FK_ebfdbaaf19ea0a1a28f0f970709\``);
    await queryRunner.query(`DROP TABLE \`transaction\``);
    await queryRunner.query(`DROP TABLE \`transfer\``);
    await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`cashbox\``);
  }
}
