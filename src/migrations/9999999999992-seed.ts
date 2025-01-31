import { Actions } from '@models/authorization/actions.enum';
import { Permission } from '@models/authorization/permission.entity';
import { Role } from '@models/authorization/role.entity';
import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed99999999999992 implements MigrationInterface {
  name = 'Seed99999999999992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const permission = await queryRunner.manager.findOne(Permission, {
      where: { action: Actions.MANAGE, subject: 'all' },
    });

    const roles = [
      {
        id: randomUUID(),
        name: 'admin',
        permissions: [permission!],
      },
    ];
    await queryRunner.manager.save(Role, roles);
  }

  public async down(): Promise<void> {}
}
