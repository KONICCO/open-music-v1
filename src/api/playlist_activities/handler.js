const ClientError = require("../../exceptions/ClientError");

class ActivitiesHandler {
  constructor(playlistsActivitiesService, playlistsService) {
    this._playlistsActivitiesService = playlistsActivitiesService;
    this._playlistsService = playlistsService;

    this.getActivitiesHandler = this.getActivitiesHandler.bind(this);
  }

  async getActivitiesHandler(req, h) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      const activities =
        await this._playlistsActivitiesService.getPlayListsActivities(id);

      return {
        status: "success",
        data: {
          playlistId: id,
          activities,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        response.header("Content-Type", "application/json");
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = ActivitiesHandler;
