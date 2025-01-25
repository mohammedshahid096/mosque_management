const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { userMosque, user, mosque } = require("../../Constants/model.constants");

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    rootUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
    mosqueId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: mosque,
    },
    mosqueUniqueId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
  },
  { timestamps: true }
);

ModelSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

const userMosqueModel = mongoose.model(userMosque, ModelSchema);

module.exports = userMosqueModel;
