import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddTodoUserId20261001143000 implements MigrationInterface {
  name = 'AddTodoUserId20261001143000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'todo',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'todo',
      new TableForeignKey({
        name: 'FK_todo_user_id',
        columnNames: ['user_id'],
        referencedTableName: 'auth',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'todo',
      new TableIndex({
        name: 'todo_user_id_idx',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('todo', 'todo_user_id_idx');
    await queryRunner.dropForeignKey('todo', 'FK_todo_user_id');
    await queryRunner.dropColumn('todo', 'user_id');
  }
}
