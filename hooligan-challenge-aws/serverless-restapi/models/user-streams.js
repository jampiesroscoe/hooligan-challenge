const mongoose = require('mongoose');
const validator = require('validator');

const StreamSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      validator: {
        validator(userId) {
          return validator.isAlphanumeric(userId);
        },
      },
    },
    sessionIds: {
      type: [String],
      required: true,
    },
    noOfStreams: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Streams', StreamSchema);