const Hapi = require("@hapi/hapi");
require("dotenv").config();
const AlbumsValidator = require("./validator/albums");
const SongsValidator = require("./validator/songs");
const SongsService = require("./services/postgres/SongsService");
const AlbumsService = require("./services/postgres/AlbumsService");
const songs = require("./api/songs");
const albums = require("./api/albums");
const ClientError = require("./exceptions/ClientError");
const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);
  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    if (!response.isServer) {
      return h.continue;
    }
    
    
    return h.continue;
  });
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

// process.on("unhandledRejection", (err) => {
//   console.log(err);
//   process.exit(1);
// });

init();
