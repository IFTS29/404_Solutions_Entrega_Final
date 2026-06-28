const Cobranza = require("../models/Cobranza");
const Cliente = require("../models/Cliente");
const FacturaCliente = require("../models/FacturaCliente");
const mongoose = require("mongoose");

const cobranzaController = {
  // Listar todas las cobranzas
  index: async (req, res) => {
    try {
      const cobranzas = await Cobranza.find()
        .populate("clienteId", "nombre razonSocial nroDoc")
        .sort({ numero: -1 });

      res.render("cobranzas/index", {
        titulo: "Cobranzas - TodoStock S.A.",
        cobranzas,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al listar cobranzas");
    }
  },

  // Formulario de creación
  formCrear: async (req, res) => {
    try {
      const clientes = await Cliente.find().sort({ nombre: 1 });
      res.render("cobranzas/crear", {
        titulo: "Nueva Cobranza",
        clientes,
        facturas: [],
        selectedCliente: null,
        error: null,
        datos: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar formulario");
    }
  },

  // API: facturas pendientes de un cliente
  getFacturasPendientes: async (req, res) => {
    try {
      const { clienteId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(clienteId)) {
        return res.json({ success: false, error: "ID de cliente inválido" });
      }

      const facturas = await FacturaCliente.find({
        clienteId,
        estatus: "Pendiente",
        cobranzaId: null,
      }).sort({ fechaEmision: 1 });

      const facturasFormateadas = facturas.map((f) => ({
        id: f._id,
        numero: f.numero,
        fechaEmision: f.fechaEmision,
        total: f.total,
        estatus: f.estatus,
      }));

      res.json({ success: true, facturas: facturasFormateadas });
    } catch (error) {
      console.error(error);
      res.json({ success: false, error: error.message });
    }
  },

  // Guardar nueva cobranza
  almacenar: async (req, res) => {
    try {
      const {
        clienteId,
        formaPago,
        referencia,
        bancoCuenta,
        fechaCobro,
        facturasSeleccionadas,
        observaciones,
        elaboradoPor,
        aprobadoPor,
        recibiConforme,
        cedula,
        montoACobrar,
      } = req.body;

      if (!mongoose.Types.ObjectId.isValid(clienteId)) {
        throw new Error("ID de cliente inválido");
      }

      const cliente = await Cliente.findById(clienteId);
      if (!cliente) throw new Error("Cliente no encontrado");

      // Parsear facturas seleccionadas
      let facturasIds = [];
      let facturasDetalles = [];
      let totalCobro = 0;

      if (facturasSeleccionadas) {
        facturasIds = Array.isArray(facturasSeleccionadas)
          ? facturasSeleccionadas
          : [facturasSeleccionadas];

        for (const facturaId of facturasIds) {
          const factura = await FacturaCliente.findById(facturaId);
          if (factura && factura.estatus === "Pendiente") {
            totalCobro += factura.total;
            facturasDetalles.push({
              facturaId: factura._id,
              numero: factura.numero,
              fecha: factura.fechaEmision,
              total: factura.total,
            });
          }
        }
      }

      const montoFinal = parseFloat(montoACobrar) || totalCobro;

      const cobranza = new Cobranza({
        clienteId,
        clienteInfo: {
          nroDoc: cliente.nroDoc,
          nombre: cliente.nombre || cliente.razonSocial,
          direccion: cliente.direccion,
          telefono: cliente.telefono,
        },
        fechaEmision: new Date(),
        estatus: "Pendiente",
        formasPago: [
          {
            formaPago,
            referencia,
            bancoCuenta,
            fecha: new Date(fechaCobro),
            montoNeto: montoFinal,
          },
        ],
        montoACobrar: montoFinal,
        observaciones,
        elaboradoPor,
        aprobadoPor,
        recibiConforme,
        cedula,
        facturasCobradas: facturasDetalles,
      });

      await cobranza.save();

      // Marcar facturas como cobradas
      for (const facturaId of facturasIds) {
        await FacturaCliente.findByIdAndUpdate(facturaId, {
          estatus: "Pagada",
          cobranzaId: cobranza.numero,
          fechaPago: new Date(fechaCobro),
        });
      }

      res.redirect("/cobranzas");
    } catch (error) {
      console.error(error);
      try {
        const clientes = await Cliente.find().sort({ nombre: 1 });
        res.render("cobranzas/crear", {
          titulo: "Nueva Cobranza",
          clientes,
          facturas: [],
          selectedCliente: null,
          error: error.message,
          datos: req.body,
        });
      } catch (err) {
        res.status(500).send("Error al cargar formulario con error");
      }
    }
  },

  // Ver detalle
  ver: async (req, res) => {
    try {
      const cobranza = await Cobranza.findOne({
        numero: parseInt(req.params.numero),
      }).populate("clienteId", "nombre razonSocial nroDoc telefono direccion");

      if (!cobranza) {
        return res.status(404).send("Cobranza no encontrada");
      }

      let facturasRelacionadas = cobranza.facturasCobradas?.length
        ? cobranza.facturasCobradas
        : (await FacturaCliente.find({ cobranzaId: cobranza.numero })).map(
            (f) => ({
              facturaId: f._id,
              numero: f.numero,
              fecha: f.fechaEmision,
              total: f.total,
            })
          );

      res.render("cobranzas/ver", {
        titulo: `Cobranza N° ${cobranza.numero}`,
        cobranza,
        facturasRelacionadas,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al mostrar cobranza");
    }
  },

  // Cambiar estatus
  cambiarEstatus: async (req, res) => {
    try {
      const { estatus } = req.body;
      await Cobranza.findOneAndUpdate(
        { numero: parseInt(req.params.numero) },
        { estatus },
        { new: true }
      );
      res.redirect("/cobranzas");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cambiar estatus");
    }
  },

  // Anular cobranza y revertir facturas
  anular: async (req, res) => {
    try {
      const cobranza = await Cobranza.findOne({
        numero: parseInt(req.params.numero),
      });

      if (cobranza && cobranza.estatus !== "Anulado") {
        for (const factura of cobranza.facturasCobradas || []) {
          await FacturaCliente.findByIdAndUpdate(factura.facturaId, {
            estatus: "Pendiente",
            cobranzaId: null,
            fechaPago: null,
          });
        }
        cobranza.estatus = "Anulado";
        await cobranza.save();
      }

      res.redirect("/cobranzas");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al anular cobranza");
    }
  },

  // Eliminar cobranza
  eliminar: async (req, res) => {
    try {
      await Cobranza.findOneAndDelete({ numero: parseInt(req.params.numero) });
      res.redirect("/cobranzas");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al eliminar cobranza");
    }
  },
};

module.exports = cobranzaController;
