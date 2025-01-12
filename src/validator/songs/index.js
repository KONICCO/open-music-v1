const { SongsPayloadSchema } = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");
const SongsValidator = {
  //digunakan pada handler
  validateSongsPayload: (payload) => {
    const validationResult = SongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
