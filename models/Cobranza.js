const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
  formaPago: {
    type: String,
    required: true,
    enum: ["Transferencia", "Efectivo", "Cheque", "Tarjeta"],
  },
  referencia: { type: String },
  bancoCuenta: { type: String },
  fecha: { type: Date, required: true },
  montoNeto: { type: Number, required: true },
});

const cobranzaSchema = new mongoose.Schema(
  {
    numero: {
      type: Number,
      unique: true,
    },
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    clienteInfo: {
      nroDoc: String,
      nombre: String,
      direccion: String,
      telefono: String,
    },
    fechaEmision: {
      type: Date,
      required: true,
      default: Date.now,
    },
    estatus: {
      type: String,
      enum: ["Pendiente", "Cobrado", "Anulado", "Parcial"],
      default: "Pendiente",
    },
    formasPago: [pagoSchema],
    montoACobrar: { type: Number, required: true },
    observaciones: { type: String },
    elaboradoPor: { type: String },
    aprobadoPor: { type: String },
    recibiConforme: { type: String },
    cedula: { type: String },
    facturasCobradas: [
      {
        facturaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FacturaCliente",
        },
        numero: String,
        fecha: Date,
        total: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Número automático antes de guardar
cobranzaSchema.pre("save", async function () {
  try {
    if (!this.numero) {
      const last = await mongoose
        .model("Cobranza")
        .findOne()
        .sort({ numero: -1 });
      this.numero = last ? last.numero + 1 : 1;
      console.log(`✅ Número de cobranza generado: ${this.numero}`);
    }
  } catch (error) {
    console.error("Error generando número de cobranza:", error);
    throw error;
  }
});

module.exports = mongoose.model("Cobranza", cobranzaSchema);
