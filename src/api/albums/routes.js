const routesAlbums = (handler) => [
  {
    method: "POST",
    path: "/albums", // add new song
    handler: handler.postAlbumHandler,
    
  },

  {
    method: "GET",
    path: "/albums/{id}", // get Album by id
    handler: handler.getAlbumByIdHandler,
    
  },
  {
    method: "PUT",
    path: "/albums/{id}", //update Album by id
    handler: handler.putAlbumByIdHandler,
    
  },
  {
    method: "DELETE",
    path: "/albums/{id}", //delete Album by id
    handler: handler.deleteAlbumByIdHandler,
    
  },
];
module.exports = routesAlbums;
