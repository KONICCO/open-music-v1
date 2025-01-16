const InvariantError = require("../../exceptions/InvariantError");
const {
  PostPlaylistPayloadValidationSchema,
  PostPlaylistSongPayloadValidationSchema,
  DeletePlaylistSongPayloadValidationSchema,
} = require("./schema");

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult =
      PostPlaylistPayloadValidationSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError();
    }
  },
  validatePostPlaylistSongPayload: (payload) => {
    const validationResult =
      PostPlaylistSongPayloadValidationSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError();
    }
  },
  validateDeletePlaylistSongPayload: (payload) => {
    const validationResult =
      DeletePlaylistSongPayloadValidationSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError();
    }
  },
};

module.exports = PlaylistsValidator;
