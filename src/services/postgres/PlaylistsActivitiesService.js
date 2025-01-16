const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistsActivitiesService {
  constructor() {
    this._pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    });
  }

  async addPlayListsActivities(playlist_id, song_id, user_id, action) {
    const id = `activities-${nanoid(16)}`;

    const time = new Date().toISOString();

    const query = {
      text: "INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlist_id, song_id, user_id, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Failed to save activities");
    }
  }

  async getPlayListsActivities(playlist_id) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_activities.action, playlist_activities.time
      FROM playlist_activities
      JOIN users ON users.id = playlist_activities.user_id
      JOIN songs ON songs.id = playlist_activities.song_id
      WHERE playlist_activities.playlist_id = $1 ORDER BY playlist_activities.time ASC`,
      values: [playlist_id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist activities tidak ditemukan");
    }

    return result.rows;
  }
}

module.exports = PlaylistsActivitiesService;
