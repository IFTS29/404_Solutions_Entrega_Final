/**
 * Script para agregar más facturas, notas de crédito y débito
 * a los clientes y proveedores EXISTENTES en la base de datos.
 * 
 * Ejecutar: node seed-mas-documentos.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Cliente = require('./models/Cliente');
const Proveedor = require('./models/Proveedor');
const FacturaCliente = require('./models/FacturaCliente');
const FacturaProveedor = require('./models/FacturaProveedor');
const NotaDeCredito = require('./models/NotaDeCredito');
const NotaDeDebito = require('./models/NotaDeDebito');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Buscar clientes existentes
    const clientes = await Cliente.find();
    if (clientes.length < 2) {
      console.error('❌ No se encontraron suficientes clientes. Ejecutá primero seed-datos-completos.js');
      process.exit(1);
    }
    const cliente1 = clientes[0];
    const cliente2 = clientes[1];
    console.log('👤 Cliente 1:', cliente1.razonSocial || cliente1.nombre);
    console.log('👤 Cliente 2:', cliente2.razonSocial || cliente2.nombre);

    // Buscar proveedores existentes
    const proveedores = await Proveedor.find();
    if (proveedores.length < 2) {
      console.error('❌ No se encontraron suficientes proveedores. Ejecutá primero seed-datos-completos.js');
      process.exit(1);
    }
    const proveedor1 = proveedores[0];
    const proveedor2 = proveedores[1];
    console.log('🏭 Proveedor 1:', proveedor1.razonSocial);
    console.log('🏭 Proveedor 2:', proveedor2.razonSocial);

    console.log('\n════════════════════════════════════════');
    console.log('    CREANDO DOCUMENTOS ADICIONALES');
    console.log('════════════════════════════════════════\n');

    // ===================== FACTURAS CLIENTES ADICIONALES =====================
    const facturasCliente = [];

    // Factura 3 - Cliente 1
    const factCli3 = new FacturaCliente({
      numero: '0001-00000203',
      puntoVenta: 1,
      clienteId: cliente1._id,
      clienteInfo: { cuit: cliente1.nroDoc, razonSocial: cliente1.razonSocial || cliente1.nombre },
      fechaEmision: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      detalles: [
        { codigo: 'SRV-012', descripcion: 'Mantenimiento mensual servidor', cantidad: 1, precioUnitario: 35000, alicIva: '21%', importe: 35000 },
        { codigo: 'SRV-013', descripcion: 'Soporte técnico remoto - 20hs', cantidad: 20, precioUnitario: 2500, alicIva: '21%', importe: 50000 }
      ],
      otrosTributos: 0
    });
    await factCli3.save();
    facturasCliente.push(factCli3);
    console.log('🧾 Factura Cliente 3:', factCli3.numero, '- $' + factCli3.total.toFixed(2));

    // Factura 4 - Cliente 1
    const factCli4 = new FacturaCliente({
      numero: '0001-00000204',
      puntoVenta: 1,
      clienteId: cliente1._id,
      clienteInfo: { cuit: cliente1.nroDoc, razonSocial: cliente1.razonSocial || cliente1.nombre },
      fechaEmision: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      detalles: [
        { codigo: 'SRV-014', descripcion: 'Consultoría en seguridad informática', cantidad: 1, precioUnitario: 120000, alicIva: '21%', importe: 120000 },
        { codigo: 'SRV-015', descripcion: 'Auditoría de código', cantidad: 1, precioUnitario: 45000, alicIva: '21%', importe: 45000 }
      ],
      otrosTributos: 0
    });
    await factCli4.save();
    facturasCliente.push(factCli4);
    console.log('🧾 Factura Cliente 4:', factCli4.numero, '- $' + factCli4.total.toFixed(2));

    // Factura 5 - Cliente 2
    const factCli5 = new FacturaCliente({
      numero: '0001-00000205',
      puntoVenta: 1,
      clienteId: cliente2._id,
      clienteInfo: { cuit: cliente2.nroDoc, razonSocial: cliente2.razonSocial || cliente2.nombre },
      fechaEmision: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      detalles: [
        { codigo: 'PROD-021', descripcion: 'Licencia antivirus corporativo x10', cantidad: 10, precioUnitario: 8500, alicIva: '21%', importe: 85000 },
        { codigo: 'PROD-022', descripcion: 'Instalación y configuración', cantidad: 1, precioUnitario: 15000, alicIva: '21%', importe: 15000 }
      ],
      otrosTributos: 0
    });
    await factCli5.save();
    facturasCliente.push(factCli5);
    console.log('🧾 Factura Cliente 5:', factCli5.numero, '- $' + factCli5.total.toFixed(2));

    // Factura 6 - Cliente 2
    const factCli6 = new FacturaCliente({
      numero: '0001-00000206',
      puntoVenta: 1,
      clienteId: cliente2._id,
      clienteInfo: { cuit: cliente2.nroDoc, razonSocial: cliente2.razonSocial || cliente2.nombre },
      fechaEmision: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      detalles: [
        { codigo: 'SRV-020', descripcion: 'Capacitación equipo TI - 8hs', cantidad: 8, precioUnitario: 12000, alicIva: '21%', importe: 96000 }
      ],
      otrosTributos: 0
    });
    await factCli6.save();
    facturasCliente.push(factCli6);
    console.log('🧾 Factura Cliente 6:', factCli6.numero, '- $' + factCli6.total.toFixed(2));

    // Factura 7 - Cliente 1 (pagada)
    const factCli7 = new FacturaCliente({
      numero: '0001-00000207',
      puntoVenta: 1,
      clienteId: cliente1._id,
      clienteInfo: { cuit: cliente1.nroDoc, razonSocial: cliente1.razonSocial || cliente1.nombre },
      fechaEmision: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      estatus: 'Pagada',
      detalles: [
        { codigo: 'SRV-016', descripcion: 'Migración de base de datos', cantidad: 1, precioUnitario: 75000, alicIva: '21%', importe: 75000 }
      ],
      otrosTributos: 0
    });
    await factCli7.save();
    facturasCliente.push(factCli7);
    console.log('🧾 Factura Cliente 7 (Pagada):', factCli7.numero, '- $' + factCli7.total.toFixed(2));

    // Factura 8 - Cliente 2 (pagada)
    const factCli8 = new FacturaCliente({
      numero: '0001-00000208',
      puntoVenta: 1,
      clienteId: cliente2._id,
      clienteInfo: { cuit: cliente2.nroDoc, razonSocial: cliente2.razonSocial || cliente2.nombre },
      fechaEmision: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      estatus: 'Pagada',
      detalles: [
        { codigo: 'PROD-023', descripcion: 'Pack Office 365 anual x5 usuarios', cantidad: 5, precioUnitario: 18000, alicIva: '21%', importe: 90000 }
      ],
      otrosTributos: 0
    });
    await factCli8.save();
    facturasCliente.push(factCli8);
    console.log('🧾 Factura Cliente 8 (Pagada):', factCli8.numero, '- $' + factCli8.total.toFixed(2));

    // ===================== NOTAS DE CRÉDITO ADICIONALES =====================
    console.log('');
    const notasCredito = [];

    // NC 3 - Cliente 1 (descuento por pronto pago)
    const nc3 = new NotaDeCredito({
      numero: '0001-00000062',
      puntoVenta: 1,
      clienteId: cliente1._id,
      clienteInfo: { cuit: cliente1.nroDoc, razonSocial: cliente1.razonSocial || cliente1.nombre },
      fechaEmision: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      conceptos: [
        { codigo: 'DESC-012', descripcion: 'Descuento pronto pago 5%', cantidad: 1, precioUnitario: 8500, alicIva: '21%', importe: 8500 }
      ],
      otrosTributos: 0,
      facturaOrigenId: factCli3._id,
      facturaOrigenNumero: factCli3.numero
    });
    await nc3.save();
    notasCredito.push(nc3);
    console.log('➖ Nota de Crédito 3:', nc3.numero, '- $' + nc3.total.toFixed(2));

    // NC 4 - Cliente 1 (devolución parcial)
    const nc4 = new NotaDeCredito({
      numero: '0001-00000063',
      puntoVenta: 1,
      clienteId: cliente1._id,
      clienteInfo: { cuit: cliente1.nroDoc, razonSocial: cliente1.razonSocial || cliente1.nombre },
      fechaEmision: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      conceptos: [
        { codigo: 'DEV-001', descripcion: 'Devolución horas no utilizadas soporte', cantidad: 5, precioUnitario: 2500, alicIva: '21%', importe: 12500 }
      ],
      otrosTributos: 0,
      facturaOrigenId: factCli3._id,
      facturaOrigenNumero: factCli3.numero
    });
    await nc4.save();
    notasCredito.push(nc4);
    console.log('➖ Nota de Crédito 4:', nc4.numero, '- $' + nc4.total.toFixed(2));

    // NC 5 - Cliente 2 (error facturación)
    const nc5 = new NotaDeCredito({
      numero: '0001-00000064',
      puntoVenta: 1,
      clienteId: cliente2._id,
      clienteInfo: { cuit: cliente2.nroDoc, razonSocial: cliente2.razonSocial || cliente2.nombre },
      fechaEmision: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      conceptos: [
        { codigo: 'ERR-001', descripcion: 'Corrección error de facturación - licencia duplicada', cantidad: 1, precioUnitario: 8500, alicIva: '21%', importe: 8500 }
      ],
      otrosTributos: 0,
      facturaOrigenId: factCli5._id,
      facturaOrigenNumero: factCli5.numero
    });
    await nc5.save();
    notasCredito.push(nc5);
    console.log('➖ Nota de Crédito 5:', nc5.numero, '- $' + nc5.total.toFixed(2));

    // NC 6 - Cliente 2 (bonificación especial)
    const nc6 = new NotaDeCredito({
      numero: '0001-00000065',
      puntoVenta: 1,
      clienteId: cliente2._id,
      clienteInfo: { cuit: cliente2.nroDoc, razonSocial: cliente2.razonSocial || cliente2.nombre },
      fechaEmision: new Date(),
      estatus: 'Pendiente',
      conceptos: [
        { codigo: 'BON-002', descripcion: 'Bonificación por contrato anual', cantidad: 1, precioUnitario: 20000, alicIva: '21%', importe: 20000 }
      ],
      otrosTributos: 0,
      facturaOrigenId: factCli6._id,
      facturaOrigenNumero: factCli6.numero
    });
    await nc6.save();
    notasCredito.push(nc6);
    console.log('➖ Nota de Crédito 6:', nc6.numero, '- $' + nc6.total.toFixed(2));

    // NC 7 - Cliente 1 (aplicada)
    const nc7 = new NotaDeCredito({
      numero: '0001-00000066',
      puntoVenta: 1,
      clienteId: cliente1._id,
      clienteInfo: { cuit: cliente1.nroDoc, razonSocial: cliente1.razonSocial || cliente1.nombre },
      fechaEmision: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      estatus: 'Aplicada',
      conceptos: [
        { codigo: 'DESC-013', descripcion: 'Descuento por falla en servicio', cantidad: 1, precioUnitario: 10000, alicIva: '21%', importe: 10000 }
      ],
      otrosTributos: 0,
      facturaOrigenId: factCli4._id,
      facturaOrigenNumero: factCli4.numero
    });
    await nc7.save();
    notasCredito.push(nc7);
    console.log('➖ Nota de Crédito 7 (Aplicada):', nc7.numero, '- $' + nc7.total.toFixed(2));

    // ===================== NOTAS DE DÉBITO ADICIONALES =====================
    console.log('');
    const notasDebito = [];

    // ND 3 - Cliente 1 (intereses por mora)
    const nd3 = new NotaDeDebito({
      numero: '0001-00000032',
      puntoVenta: 1,
      clienteId: cliente1._id,
      clienteInfo: { cuit: cliente1.nroDoc, razonSocial: cliente1.razonSocial || cliente1.nombre },
      fechaEmision: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      concepto: {
        descripcion: 'Intereses por mora - Factura 0001-00000204 (45 días)',
        precioUnitario: 8250,
        alicIva: '21%',
        importe: 8250
      },
      otrosTributos: 0,
      facturaOrigenId: factCli4._id,
      facturaOrigenNumero: factCli4.numero
    });
    await nd3.save();
    notasDebito.push(nd3);
    console.log('➕ Nota de Débito 3:', nd3.numero, '- $' + nd3.total.toFixed(2));

    // ND 4 - Cliente 1 (gastos bancarios)
    const nd4 = new NotaDeDebito({
      numero: '0001-00000033',
      puntoVenta: 1,
      clienteId: cliente1._id,
      clienteInfo: { cuit: cliente1.nroDoc, razonSocial: cliente1.razonSocial || cliente1.nombre },
      fechaEmision: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      concepto: {
        descripcion: 'Gastos bancarios por cheque rechazado',
        precioUnitario: 5500,
        alicIva: '21%',
        importe: 5500
      },
      otrosTributos: 0,
      facturaOrigenId: factCli3._id,
      facturaOrigenNumero: factCli3.numero
    });
    await nd4.save();
    notasDebito.push(nd4);
    console.log('➕ Nota de Débito 4:', nd4.numero, '- $' + nd4.total.toFixed(2));

    // ND 5 - Cliente 2 (recargo por pago fuera de término)
    const nd5 = new NotaDeDebito({
      numero: '0001-00000034',
      puntoVenta: 1,
      clienteId: cliente2._id,
      clienteInfo: { cuit: cliente2.nroDoc, razonSocial: cliente2.razonSocial || cliente2.nombre },
      fechaEmision: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      concepto: {
        descripcion: 'Recargo por pago fuera de término - 15 días',
        precioUnitario: 4800,
        alicIva: '21%',
        importe: 4800
      },
      otrosTributos: 0,
      facturaOrigenId: factCli5._id,
      facturaOrigenNumero: factCli5.numero
    });
    await nd5.save();
    notasDebito.push(nd5);
    console.log('➕ Nota de Débito 5:', nd5.numero, '- $' + nd5.total.toFixed(2));

    // ND 6 - Cliente 2 (diferencia de precio)
    const nd6 = new NotaDeDebito({
      numero: '0001-00000035',
      puntoVenta: 1,
      clienteId: cliente2._id,
      clienteInfo: { cuit: cliente2.nroDoc, razonSocial: cliente2.razonSocial || cliente2.nombre },
      fechaEmision: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      concepto: {
        descripcion: 'Ajuste por diferencia de precio - actualización tarifaria',
        precioUnitario: 7200,
        alicIva: '21%',
        importe: 7200
      },
      otrosTributos: 0,
      facturaOrigenId: factCli6._id,
      facturaOrigenNumero: factCli6.numero
    });
    await nd6.save();
    notasDebito.push(nd6);
    console.log('➕ Nota de Débito 6:', nd6.numero, '- $' + nd6.total.toFixed(2));

    // ND 7 - Cliente 1 (aplicada)
    const nd7 = new NotaDeDebito({
      numero: '0001-00000036',
      puntoVenta: 1,
      clienteId: cliente1._id,
      clienteInfo: { cuit: cliente1.nroDoc, razonSocial: cliente1.razonSocial || cliente1.nombre },
      fechaEmision: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      estatus: 'Aplicada',
      concepto: {
        descripcion: 'Sellado e impuestos provinciales',
        precioUnitario: 6000,
        alicIva: '21%',
        importe: 6000
      },
      otrosTributos: 0,
      facturaOrigenId: factCli4._id,
      facturaOrigenNumero: factCli4.numero
    });
    await nd7.save();
    notasDebito.push(nd7);
    console.log('➕ Nota de Débito 7 (Aplicada):', nd7.numero, '- $' + nd7.total.toFixed(2));

    // ===================== FACTURAS PROVEEDORES ADICIONALES =====================
    console.log('');
    const facturasProveedor = [];

    // Factura Proveedor 3
    const factProv3 = new FacturaProveedor({
      numero: '0003-00000151',
      puntoVenta: 3,
      proveedorId: proveedor1._id,
      proveedorInfo: { cuit: proveedor1.nroDoc, razonSocial: proveedor1.razonSocial },
      fechaEmision: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      detalles: [
        { codigo: 'INS-003', descripcion: 'Cables de red Cat6 x100m', cantidad: 10, precioUnitario: 3500, alicIva: '21%', importe: 35000 },
        { codigo: 'INS-004', descripcion: 'Switch 24 puertos TP-Link', cantidad: 2, precioUnitario: 45000, alicIva: '21%', importe: 90000 },
        { codigo: 'INS-005', descripcion: 'Rack de piso 42U', cantidad: 1, precioUnitario: 180000, alicIva: '21%', importe: 180000 }
      ],
      otrosTributos: 0
    });
    await factProv3.save();
    facturasProveedor.push(factProv3);
    console.log('📑 Factura Proveedor 3:', factProv3.numero, '- $' + factProv3.total.toFixed(2));

    // Factura Proveedor 4
    const factProv4 = new FacturaProveedor({
      numero: '0003-00000152',
      puntoVenta: 3,
      proveedorId: proveedor1._id,
      proveedorInfo: { cuit: proveedor1.nroDoc, razonSocial: proveedor1.razonSocial },
      fechaEmision: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      detalles: [
        { codigo: 'INS-006', descripcion: 'Monitor LED 27" Samsung', cantidad: 5, precioUnitario: 95000, alicIva: '21%', importe: 475000 },
        { codigo: 'INS-007', descripcion: 'Teclado mecánico Logitech', cantidad: 5, precioUnitario: 35000, alicIva: '21%', importe: 175000 }
      ],
      otrosTributos: 0
    });
    await factProv4.save();
    facturasProveedor.push(factProv4);
    console.log('📑 Factura Proveedor 4:', factProv4.numero, '- $' + factProv4.total.toFixed(2));

    // Factura Proveedor 5
    const factProv5 = new FacturaProveedor({
      numero: '0002-00000089',
      puntoVenta: 2,
      proveedorId: proveedor2._id,
      proveedorInfo: { cuit: proveedor2.nroDoc, razonSocial: proveedor2.razonSocial },
      fechaEmision: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      detalles: [
        { codigo: 'LOG-002', descripcion: 'Servicio de mensajería urgente x20', cantidad: 20, precioUnitario: 3500, alicIva: '21%', importe: 70000 },
        { codigo: 'LOG-003', descripcion: 'Almacenamiento temporal - depósito', cantidad: 1, precioUnitario: 25000, alicIva: '21%', importe: 25000 }
      ],
      otrosTributos: 0
    });
    await factProv5.save();
    facturasProveedor.push(factProv5);
    console.log('📑 Factura Proveedor 5:', factProv5.numero, '- $' + factProv5.total.toFixed(2));

    // Factura Proveedor 6
    const factProv6 = new FacturaProveedor({
      numero: '0002-00000090',
      puntoVenta: 2,
      proveedorId: proveedor2._id,
      proveedorInfo: { cuit: proveedor2.nroDoc, razonSocial: proveedor2.razonSocial },
      fechaEmision: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      estatus: 'Pendiente',
      detalles: [
        { codigo: 'LOG-004', descripcion: 'Mudanza de oficina completa', cantidad: 1, precioUnitario: 150000, alicIva: '21%', importe: 150000 },
        { codigo: 'LOG-005', descripcion: 'Seguro de transporte', cantidad: 1, precioUnitario: 12000, alicIva: '21%', importe: 12000 }
      ],
      otrosTributos: 0
    });
    await factProv6.save();
    facturasProveedor.push(factProv6);
    console.log('📑 Factura Proveedor 6:', factProv6.numero, '- $' + factProv6.total.toFixed(2));

    // Factura Proveedor 7 (pagada)
    const factProv7 = new FacturaProveedor({
      numero: '0003-00000153',
      puntoVenta: 3,
      proveedorId: proveedor1._id,
      proveedorInfo: { cuit: proveedor1.nroDoc, razonSocial: proveedor1.razonSocial },
      fechaEmision: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      fechaVencimiento: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      estatus: 'Pagada',
      detalles: [
        { codigo: 'INS-008', descripcion: 'Resmas papel oficio x20', cantidad: 20, precioUnitario: 4500, alicIva: '21%', importe: 90000 }
      ],
      otrosTributos: 0
    });
    await factProv7.save();
    facturasProveedor.push(factProv7);
    console.log('📑 Factura Proveedor 7 (Pagada):', factProv7.numero, '- $' + factProv7.total.toFixed(2));

    // ===================== RESUMEN =====================
    console.log('\n════════════════════════════════════════');
    console.log('    RESUMEN - DOCUMENTOS ADICIONALES');
    console.log('════════════════════════════════════════');

    const totalFactCli = facturasCliente.reduce((sum, f) => sum + f.total, 0);
    const totalNC = notasCredito.reduce((sum, n) => sum + n.total, 0);
    const totalND = notasDebito.reduce((sum, n) => sum + n.total, 0);
    const totalFactProv = facturasProveedor.reduce((sum, f) => sum + f.total, 0);

    console.log('\n📊 Facturas Clientes creadas: ' + facturasCliente.length + ' - Total: $' + totalFactCli.toFixed(2));
    console.log('➖ Notas de Crédito creadas: ' + notasCredito.length + ' - Total: $' + totalNC.toFixed(2));
    console.log('➕ Notas de Débito creadas: ' + notasDebito.length + ' - Total: $' + totalND.toFixed(2));
    console.log('📑 Facturas Proveedores creadas: ' + facturasProveedor.length + ' - Total: $' + totalFactProv.toFixed(2));

    console.log('\n  Cuentas por Cobrar: $' + (totalFactCli - totalNC + totalND).toFixed(2));
    console.log('  Cuentas por Pagar: $' + totalFactProv.toFixed(2));
    console.log('════════════════════════════════════════\n');

    await mongoose.disconnect();
    console.log('✅ Seed completado. Desconectado de MongoDB.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
