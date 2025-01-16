

const UsersHandler = require("./handler");
const routesUsers = require("./routes");
module.exports = {
  name: "users",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const usersHandler = new UsersHandler(service, validator);
    server.route(routesUsers(usersHandler));
  },
};
