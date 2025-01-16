const ClientError = require("../../exceptions/ClientError");

class PlaylistsHandler {
  constructor(
    playlistsService,
    songsService,
    playlistsActivitiesService,
    collaborationsService,
    validator
  ) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._playlistsActivitiesService = playlistsActivitiesService;
    this._collaborationsService = collaborationsService;
    this._validator = validator;

    // Bind methods
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  /**
   * POST /playlists
   * Menambahkan playlist baru.
   */
  async postPlaylistHandler(req, h) {
    try {
      this._validator.validatePostPlaylistPayload(req.payload);

      const { name } = req.payload;
      const { id: credentialId } = req.auth.credentials;

      const playlistId = await this._playlistsService.addPlaylist(
        name,
        credentialId
      );

      return h
        .response({
          status: "success",
          data: {
            playlistId,
          },
        })
        .code(201);
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  /**
   * GET /playlists
   * Mendapatkan daftar playlist milik pengguna.
   */
  async getPlaylistsHandler(req) {
    const { id: credentialId } = req.auth.credentials;

    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: "success",
      data: {
        playlists,
      },
    };
  }

  /**
   * DELETE /playlists/{id}
   * Menghapus playlist berdasarkan ID.
   */
  async deletePlaylistByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialId);
      await this._playlistsService.deletePlaylistById(id);

      return {
        status: "success",
        message: "Playlist berhasil dihapus",
      };
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  /**
   * POST /playlists/{id}/songs
   * Menambahkan lagu ke dalam playlist.
   */
  async postPlaylistSongHandler(req, h) {
    try {
      this._validator.validatePostPlaylistSongPayload(req.payload);

      const { id } = req.params;
      const { songId } = req.payload;
      const { id: credentialId } = req.auth.credentials;

      await this._songsService.getSongById(songId);
      await this._playlistsService.verifyPlaylistAccess(id, credentialId);

      const resultPlaylistId = await this._playlistsService.addPlaylistSongs(
        id,
        songId
      );

      await this._playlistsActivitiesService.addPlayListsActivities(
        id,
        songId,
        credentialId,
        "add"
      );

      return h
        .response({
          status: "success",
          message: "Lagu berhasil ditambahkan ke playlist",
          data: {
            resultPlaylistId,
          },
        })
        .code(201);
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  /**
   * GET /playlists/{id}/songs
   * Mendapatkan lagu-lagu dalam playlist.
   */
  async getPlaylistSongsHandler(req, h) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);

      const playlist = await this._playlistsService.getPlaylistById(id);
      const songs = await this._playlistsService.getPlaylistSongs(id);

      return {
        status: "success",
        data: {
          playlist: { ...playlist, songs },
        },
      };
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  /**
   * DELETE /playlists/{id}/songs
   * Menghapus lagu dari playlist.
   */
  async deletePlaylistSongHandler(req, h) {
    try {
      this._validator.validateDeletePlaylistSongPayload(req.payload);

      const { id } = req.params;
      const { songId } = req.payload;
      const { id: credentialId } = req.auth.credentials;

      await this._songsService.getSongById(songId);
      await this._playlistsService.verifyPlaylistAccess(id, credentialId);

      await this._playlistsService.deletePlaylistSongs(id, songId);
      await this._playlistsActivitiesService.addPlayListsActivities(
        id,
        songId,
        credentialId,
        "delete"
      );

      return {
        status: "success",
        message: "Lagu berhasil dihapus dari playlist",
      };
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  /**
   * Utilitas untuk menangani error.
   */
  _handleError(error, h) {
    if (error instanceof ClientError) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }

    const response = h.response({
      status: "error",
      message: "Maaf, terjadi kegagalan pada server kami.",
    });
    response.code(500);
    console.error(error);
    return response;
  }
}

module.exports = PlaylistsHandler;
