const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
  constructor() {
    this._pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    });
  
  }

  async addPlaylist(name, ownerId) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Gagal membuat playlist.");
    }

    return result.rows[0].id;
  }

  async getPlaylists(ownerId) {
    const query = {
      text: `SELECT playlists.id AS id, playlists.name, users.username
      FROM playlists
      LEFT JOIN users ON playlists.owner = users.id
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [ownerId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistById(playlist_id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [playlist_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Gagal menghapus playlist, playlist tidak ditemukan.");
    }
  }

  async addPlaylistSongs(playlist_id, song_id) {
    const id = `playlistSongs-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlist_id, song_id],
    };

    const result = await this._pool.query(query);
    console.log("result", result);
    if (!result.rowCount) {
      throw new InvariantError("Gagal menambahkan lagu ke playlist.");
    }

    return result.rows[0].id;
  }

  async getPlaylistById(playlist_id) {
    const query = {
      text: `SELECT playlists.id AS id, playlists.name, users.username
      FROM playlists
      LEFT JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $1`,
      values: [playlist_id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    return result.rows[0];
  }

  async getPlaylistSongs(playlist_id) {
    const query = {
      text: `SELECT songs.id AS id, songs.title, songs.performer
      FROM songs
      FULL JOIN playlist_songs ON playlist_songs.song_id = songs.id
      FULL JOIN playlists ON playlists.id = playlist_songs.playlist_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlist_id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("PlaylistSongs tidak ditemukan");
    }
    return result.rows;
  }

  async deletePlaylistSongs(playlist_id, song_id) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlist_id, song_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        "Failed to delete song from playlist, song not found"
      );
    }
  }

  async verifyPlaylistOwner(id, ownerId) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    // console.log("result", result.rows);
    if (!result.rowCount) {
      throw new NotFoundError("Playlist not found");
    }

    const playlist = result.rows[0];
    if (playlist.owner !== ownerId) {
      throw new AuthorizationError(
        "You are not authorized to access this resource"
      );
    }
  }

  async verifyPlaylistAccess(id, owner) {
    // console.log("verifyPlaylistOwner", id, owner);
    try {
      await this.verifyPlaylistOwner(id, owner);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        // console.log("verifyColabolator", id, owner);
        await this.verifyCollaborator(id, owner);
      } catch {
        throw error;
      }
    }
  }
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Kolaborasi gagal diverifikasi");
    }
  }
}

module.exports = PlaylistsService;
