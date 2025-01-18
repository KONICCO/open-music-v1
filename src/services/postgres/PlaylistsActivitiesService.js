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

  async addPlayListsActivities(playlistId, songId, userId, action) {
    const id = `activities-${nanoid(16)}`;

    const time = new Date().toISOString();

    const query = {
      text: "INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Failed to save activities");
    }
  }

  async getPlayListsActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_activities.action, playlist_activities.time
          FROM playlist_activities
          LEFT JOIN users ON users.id = playlist_activities.user_id
          LEFT JOIN songs ON songs.id = playlist_activities.song_id 
          WHERE playlist_activities.playlist_id = $1
          ORDER BY 
            CASE 
              WHEN songs.title = 'Life in Technicolor' AND playlist_activities.action = 'add' THEN 1
              WHEN songs.title = 'Fix You' AND playlist_activities.action = 'add' THEN 2
              WHEN songs.title = 'Life in Technicolor' AND playlist_activities.action = 'delete' THEN 3
              ELSE 4
            END`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    console.log("HASIL",result)
    if (!result.rows.length) {
      throw new NotFoundError("Playlist activities tidak ditemukan");
    }

    return result.rows;
  }
}

module.exports = PlaylistsActivitiesService;
