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
  pgm.createTable(
    "playlist_songs",
    {
      id: {
        type: "VARCHAR(50)",
        primaryKey: true,
      },
      playlist_id: {
        type: "VARCHAR(50)",
        notNull: true,
        references: '"playlists"', // Referensi ke tabel playlists
        onDelete: "CASCADE",
      },
      song_id: {
        type: "VARCHAR(50)",
        notNull: true,
        references: '"songs"', // Referensi ke tabel songs
        onDelete: "CASCADE",
      },
    },
    {
      constraints: {
        unique: ["playlist_id", "song_id"], // Constraint UNIQUE
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
  pgm.dropTable("playlist_songs");
};
