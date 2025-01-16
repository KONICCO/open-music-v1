const PlaylistsHandler = require("./handler");
const playlistsRoutes = require("./routes");

module.exports = {
  name: "playlists",
  version: "1.0.0",
  register: (
    server,
    { playlistsService, songsService, playlistsActivitiesService, collaborationsService, validator }  
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      songsService,
      playlistsActivitiesService,
      collaborationsService,
      validator
    );

    server.route(playlistsRoutes(playlistsHandler));
  },
};
