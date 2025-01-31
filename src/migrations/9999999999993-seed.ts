import { User } from '@models/user/user.entity';
import { Role } from '@models/authorization/role.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed99999999999993 implements MigrationInterface {
  name = 'Seed99999999999993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const role = await queryRunner.manager.findOne(Role, {
      where: { name: 'admin' },
    });

    await queryRunner.manager.save(User, [
      {
        username: 'admin',
        password:
          '$2a$12$K0x6lxzNRhCZ8VDcOLtEpe0Vmky8SudoJT6aOrNHZI4og4MNKN05O',
        roleId: role!.id,
      },
    ]);
  }

  public async down(): Promise<void> {}
}
