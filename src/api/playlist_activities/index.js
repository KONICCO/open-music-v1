const ActivitiesHandler = require('./handler')
const activitiesRoutes = require('./routes')

module.exports = {
  name: 'playlistActivities',
  version: '1.0.0',
  register: (server, { playlistsActivitiesService, playlistsService }) => {
    const activitiesHandler = new ActivitiesHandler(
      playlistsActivitiesService,
      playlistsService
    )

    server.route(activitiesRoutes(activitiesHandler))
  },
}