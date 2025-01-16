/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Membuat tabel collaborations dengan semua constraint langsung di definisi createTable
  pgm.createTable(
    "collaborations",
    {
      id: {
        type: "VARCHAR(50)",
        primaryKey: true,
      },
      playlist_id: {
        type: "VARCHAR(50)",
        notNull: true,
        references: '"playlists"(id)', // Foreign key langsung pada definisi kolom
        onDelete: "CASCADE", // Cascade delete
      },
      user_id: {
        type: "VARCHAR(50)",
        notNull: true,
        references: '"users"(id)', // Foreign key langsung pada definisi kolom
        onDelete: "CASCADE", // Cascade delete
      },
    },
    {
      constraints: {
        unique: ["playlist_id", "user_id"], // Constraint UNIQUE
      },
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("collaborations");
};
