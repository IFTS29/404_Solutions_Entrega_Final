const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Método para comparar password
usuarioSchema.methods.comparePassword = async function (candidatePassword) {
  return this.password === candidatePassword;
};

module.exports = mongoose.model("Usuario", usuarioSchema);