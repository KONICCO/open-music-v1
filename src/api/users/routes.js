const routesUsers = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
  },
];
module.exports = routesUsers;
