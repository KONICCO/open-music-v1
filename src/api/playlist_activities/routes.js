const routesActivities = ( handler ) => [
    {
      method: 'GET',
      path: '/playlists/{id}/activities',
      handler: handler.getActivitiesHandler,
      options: {
        auth: 'musicsapp_jwt',
      },
    },
  ]
  
  module.exports = routesActivities