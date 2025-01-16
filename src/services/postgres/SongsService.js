const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
class SongsService {
  constructor() {
    this._pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    });
  }
  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6,$7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Song gagal ditambahkan");
    }

    return result.rows[0].id;
  }
  async getSongs(req) {
    const { title, performer } = req;

    let baseQuery = "SELECT id, title, performer FROM songs";
    const queryParams = [];
    const conditions = [];

    
    if (title) {
      conditions.push(`title ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${title}%`);
    }

    
    if (performer) {
      conditions.push(`performer ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${performer}%`);
    }

    
    if (conditions.length > 0) {
      baseQuery += " WHERE " + conditions.join(" AND ");
    }

    try {
      console.log("Executing query:", baseQuery, queryParams); // Debug query
      const result = await this._pool.query(baseQuery, queryParams);
      return result.rows;
    } catch (error) {
      console.error("Database query failed:", error); // Log error database
      throw new Error("Gagal mengambil data dari database");
    }
  }
  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Song tidak ditemukan");
    }

    return result.rows[0];
  }
  async editSongById(id, { title, year, performer, genre, duration }) {
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id",
      values: [title, year, performer, genre, duration, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui song. Id tidak ditemukan");
    }
    return result.rows[0].id;
  }
  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Song gagal dihapus. Id tidak ditemukan");
    }
  }
}
module.exports = SongsService;
