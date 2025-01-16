const { UserPayloadSchema } = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");
const UsersValidator = {
  //digunakan pada handler
  validateUsersPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
