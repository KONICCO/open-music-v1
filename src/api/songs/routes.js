const routesSongs = (handler) => [
  {
    method: "POST",
    path: "/songs", // add new song
    handler: handler.postSongHandler,
  },
  {
    method: "GET",
    path: "/songs", //get all songs
    handler: handler.getSongsHandler,
  },
  {
    method: "GET",
    path: "/songs/{id}", // get song by id
    handler: handler.getSongByIdHandler,
  },
  {
    method: "PUT",
    path: "/songs/{id}", //update song by id
    handler: handler.putSongByIdHandler,
  },
  {
    method: "DELETE",
    path: "/songs/{id}", //delete song by id
    handler: handler.deleteSongByIdHandler,
  },
];
module.exports = routesSongs;
