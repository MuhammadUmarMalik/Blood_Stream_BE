import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("name", 255);
      table.string("gender", 255);
      table.string("blood_group", 255);
      table.string("phone_number", 255).notNullable().unique();
      table.string("address", 255);
      table.string("city", 255);
      table.boolean("enable_request");
      table.string('password',255);
      table.string("profile_picture");

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
