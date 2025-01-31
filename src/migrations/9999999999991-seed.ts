import { Actions } from '@models/authorization/actions.enum';
import { Permission } from '@models/authorization/permission.entity';
import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed99999999999991 implements MigrationInterface {
  name = 'Seed99999999999991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminPermissionsUUID = randomUUID();
    const permissions = [
      { id: adminPermissionsUUID, action: Actions.MANAGE, subject: 'all' },
    ];

    await queryRunner.manager.save(Permission, permissions);
  }

  public async down(): Promise<void> {}
}
