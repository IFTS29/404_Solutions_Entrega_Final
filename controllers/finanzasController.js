const FacturaCliente = require("../models/FacturaCliente");
const FacturaProveedor = require("../models/FacturaProveedor");
const OrdenPago = require("../models/OrdenPago");
const Presupuesto = require("../models/Presupuesto");
const NotaDeCredito = require("../models/NotaDeCredito");
const NotaDeDebito = require("../models/NotaDeDebito");

const finanzasController = {
  // Dashboard principal con estadísticas
  resumen: async (req, res) => {
    try {
      // Estadísticas de documentos
      const facturasClientesPendientes = await FacturaCliente.countDocuments({ estatus: "Pendiente" });
      const facturasProveedoresPendientes = await FacturaProveedor.countDocuments({ estatus: "Pendiente" });
      const ordenesPagoPendientes = await OrdenPago.countDocuments({ estatus: "Pendiente" });
      const presupuestosVigentes = await Presupuesto.countDocuments({ 
        estatus: "Pendiente",
        fechaValidez: { $gte: new Date() }
      });

      // Montos pendientes
      const facturasClientesPendientesData = await FacturaCliente.find({ estatus: "Pendiente" });
      const totalPorCobrar = facturasClientesPendientesData.reduce((sum, f) => sum + (f.total || 0), 0);

      const facturasProveedoresPendientesData = await FacturaProveedor.find({ estatus: "Pendiente" });
      const totalPorPagar = facturasProveedoresPendientesData.reduce((sum, f) => sum + (f.total || 0), 0);

      // Últimos movimientos (5 más recientes)
      const ultimosMovimientos = [];

      // Facturas clientes
      const ultFactClientes = await FacturaCliente.find()
        .populate('clienteId', 'nombre razonSocial tipoDoc')
        .sort({ createdAt: -1 })
        .limit(3);
      
      ultFactClientes.forEach(f => {
        const clienteNombre = f.clienteId 
          ? (f.clienteId.tipoDoc === 'DNI' ? f.clienteId.nombre : f.clienteId.razonSocial)
          : f.clienteInfo?.razonSocial || 'Cliente desconocido';
        
        ultimosMovimientos.push({
          tipo: 'Factura Cliente',
          numero: f.numero,
          entidad: clienteNombre,
          fecha: f.fechaEmision,
          monto: f.total,
          estatus: f.estatus,
          link: `/facturas-cliente/ver/${f._id}`
        });
      });

      // Facturas proveedores
      const ultFactProveedores = await FacturaProveedor.find()
        .populate('proveedorId', 'nombre razonSocial tipoDoc')
        .sort({ createdAt: -1 })
        .limit(2);
      
      ultFactProveedores.forEach(f => {
        const proveedorNombre = f.proveedorId 
          ? (f.proveedorId.tipoDoc === 'DNI' ? f.proveedorId.nombre : f.proveedorId.razonSocial)
          : f.proveedorInfo?.razonSocial || 'Proveedor desconocido';
        
        ultimosMovimientos.push({
          tipo: 'Factura Proveedor',
          numero: f.numero,
          entidad: proveedorNombre,
          fecha: f.fechaEmision,
          monto: f.total,
          estatus: f.estatus,
          link: `/facturas-proveedor/ver/${f._id}`
        });
      });

      // Ordenar por fecha
      ultimosMovimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      const balanceNeto = totalPorCobrar - totalPorPagar;

      res.render("finanzas/index", {
        titulo: "Resumen Financiero - TodoStock S.A.",
        estadisticas: {
          facturasClientesPendientes,
          facturasProveedoresPendientes,
          ordenesPagoPendientes,
          presupuestosVigentes,
          totalPorCobrar: Math.round(totalPorCobrar * 100) / 100,
          totalPorPagar: Math.round(totalPorPagar * 100) / 100,
          balanceNeto: Math.round(balanceNeto * 100) / 100
        },
        ultimosMovimientos: ultimosMovimientos.slice(0, 5)
      });
    } catch (error) {
      console.error('Error en resumen financiero:', error);
      res.render("finanzas/index", {
        titulo: "Resumen Financiero - TodoStock S.A.",
        error: "Error al generar el resumen financiero: " + error.message,
        estadisticas: {
          facturasClientesPendientes: 0,
          facturasProveedoresPendientes: 0,
          ordenesPagoPendientes: 0,
          presupuestosVigentes: 0,
          totalPorCobrar: 0,
          totalPorPagar: 0,
          balanceNeto: 0
        },
        ultimosMovimientos: []
      });
    }
  },

  // Cuentas por cobrar (facturas de clientes pendientes)
  cuentasPorCobrar: async (req, res) => {
    try {
      const { fechaDesde, fechaHasta } = req.query;
      
      // Mostrar únicamente facturas pendientes
      let filtro = {
        estatus: "Pendiente"
      };

      if (fechaDesde || fechaHasta) {
        filtro.fechaEmision = {};
        if (fechaDesde) {
          const desde = new Date(fechaDesde);
          desde.setHours(0, 0, 0, 0);
          filtro.fechaEmision.$gte = desde;
        }
        if (fechaHasta) {
          const hasta = new Date(fechaHasta);
          hasta.setHours(23, 59, 59, 999);
          filtro.fechaEmision.$lte = hasta;
        }
      }

      const facturas = await FacturaCliente.find(filtro)
        .populate('clienteId', 'nombre razonSocial tipoDoc nroDoc')
        .sort({ fechaVencimiento: 1 });

      const total = facturas.reduce((sum, f) => sum + (f.total || 0), 0);

      res.render("finanzas/cuentas-cobrar", {
        titulo: "Cuentas por Cobrar - TodoStock S.A.",
        facturas,
        total: Math.round(total * 100) / 100,
        filtros: { fechaDesde, fechaHasta }
      });
    } catch (error) {
      console.error('Error en cuentas por cobrar:', error);
      res.render("finanzas/cuentas-cobrar", {
        titulo: "Cuentas por Cobrar - TodoStock S.A.",
        error: "Error al cargar cuentas por cobrar: " + error.message,
        facturas: [],
        total: 0,
        filtros: {}
      });
    }
  },

  // Cuentas por pagar (facturas de proveedores pendientes)
  cuentasPorPagar: async (req, res) => {
    try {
      const { fechaDesde, fechaHasta } = req.query;
      
      // Mostrar únicamente facturas pendientes
      let filtro = {
        estatus: "Pendiente"
      };

      if (fechaDesde || fechaHasta) {
        filtro.fechaEmision = {};
        if (fechaDesde) {
          const desde = new Date(fechaDesde);
          desde.setHours(0, 0, 0, 0);
          filtro.fechaEmision.$gte = desde;
        }
        if (fechaHasta) {
          const hasta = new Date(fechaHasta);
          hasta.setHours(23, 59, 59, 999);
          filtro.fechaEmision.$lte = hasta;
        }
      }

      const facturas = await FacturaProveedor.find(filtro)
        .populate('proveedorId', 'nombre razonSocial tipoDoc nroDoc')
        .sort({ fechaVencimiento: 1 });

      const total = facturas.reduce((sum, f) => sum + (f.total || 0), 0);

      res.render("finanzas/cuentas-pagar", {
        titulo: "Cuentas por Pagar - TodoStock S.A.",
        facturas,
        total: Math.round(total * 100) / 100,
        filtros: { fechaDesde, fechaHasta }
      });
    } catch (error) {
      console.error('Error en cuentas por pagar:', error);
      res.render("finanzas/cuentas-pagar", {
        titulo: "Cuentas por Pagar - TodoStock S.A.",
        error: "Error al cargar cuentas por pagar: " + error.message,
        facturas: [],
        total: 0,
        filtros: {}
      });
    }
  }
};

module.exports = finanzasController;