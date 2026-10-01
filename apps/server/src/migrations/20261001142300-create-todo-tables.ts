import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTodoTables20261001142300 implements MigrationInterface {
  name = 'CreateTodoTables20261001142300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'todo_status',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('todo_status')
      .values([{ id: 'in_progress' }, { id: 'done' }])
      .execute();

    await queryRunner.createTable(
      new Table({
        name: 'todo',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'title',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'text',
            isNullable: false,
            default: `'in_progress'`,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['status'],
            referencedTableName: 'todo_status',
            referencedColumnNames: ['id'],
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('todo');
    await queryRunner.dropTable('todo_status');
  }
}
