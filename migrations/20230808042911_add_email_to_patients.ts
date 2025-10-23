import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('patients', (table) => {
    table.string('email');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('patients', (table) => {
    table.dropColumn('email');
  });
}
