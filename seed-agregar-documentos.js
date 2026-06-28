/**
 * Script para agregar 2 facturas, 2 notas de crédito y 2 notas de débito
 * a CADA cliente y proveedor existente en la base de datos.
 * 
 * Ejecutar: node seed-agregar-documentos.js
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

    const clientes = await Cliente.find();
    const proveedores = await Proveedor.find();

    if (clientes.length === 0) {
      console.error('❌ No hay clientes. Ejecutá primero seed-datos-completos.js');
      process.exit(1);
    }
    if (proveedores.length === 0) {
      console.error('❌ No hay proveedores. Ejecutá primero seed-datos-completos.js');
      process.exit(1);
    }

    console.log(`Clientes encontrados: ${clientes.length}`);
    console.log(`Proveedores encontrados: ${proveedores.length}\n`);

    // Obtener último número de cada tipo para no repetir
    const ultimaFactCli = await FacturaCliente.findOne().sort({ numero: -1 });
    const ultimaFactProv = await FacturaProveedor.findOne().sort({ numero: -1 });
    const ultimaNC = await NotaDeCredito.findOne().sort({ numero: -1 });
    const ultimaND = await NotaDeDebito.findOne().sort({ numero: -1 });

    let numFactCli = ultimaFactCli ? parseInt(ultimaFactCli.numero.split('-')[1]) + 1 : 300;
    let numFactProv = ultimaFactProv ? parseInt(ultimaFactProv.numero.split('-')[1]) + 1 : 200;
    let numNC = ultimaNC ? parseInt(ultimaNC.numero.split('-')[1]) + 1 : 100;
    let numND = ultimaND ? parseInt(ultimaND.numero.split('-')[1]) + 1 : 50;

    const pad = (n) => String(n).padStart(8, '0');
    let totalCreados = { factCli: 0, factProv: 0, nc: 0, nd: 0 };

    // ===================== DATOS POR CLIENTE =====================
    const serviciosCliente = [
      { codigo: 'SRV-100', descripcion: 'Desarrollo módulo de reportes', precio: 65000 },
      { codigo: 'SRV-101', descripcion: 'Integración API de pagos', precio: 48000 },
      { codigo: 'SRV-102', descripcion: 'Soporte técnico mensual', precio: 22000 },
      { codigo: 'SRV-103', descripcion: 'Migración a la nube AWS', precio: 95000 },
      { codigo: 'SRV-104', descripcion: 'Capacitación usuarios - 4hs', precio: 32000 },
      { codigo: 'SRV-105', descripcion: 'Auditoría de seguridad', precio: 55000 },
      { codigo: 'SRV-106', descripcion: 'Diseño landing page', precio: 28000 },
      { codigo: 'SRV-107', descripcion: 'Mantenimiento base de datos', precio: 18000 },
      { codigo: 'SRV-108', descripcion: 'Implementación SSO', precio: 72000 },
      { codigo: 'SRV-109', descripcion: 'Testing automatizado', precio: 41000 },
    ];

    const motivosNC = [
      'Descuento por pronto pago 5%',
      'Bonificación comercial',
      'Devolución por servicio no realizado',
      'Corrección error de facturación',
      'Descuento por volumen',
      'Bonificación fidelidad cliente',
    ];

    const motivosND = [
      'Intereses por mora - 30 días',
      'Gastos administrativos cobranza',
      'Recargo pago fuera de término',
      'Diferencia de precio - ajuste tarifario',
      'Gastos bancarios cheque rechazado',
      'Sellado e impuestos provinciales',
    ];

    console.log('════════════════════════════════════════');
    console.log('  FACTURAS DE CLIENTES');
    console.log('════════════════════════════════════════\n');

    for (let i = 0; i < clientes.length; i++) {
      const cliente = clientes[i];
      const nombreCli = cliente.razonSocial || cliente.nombre;
      console.log(`\n── ${nombreCli} ──`);

      // 2 Facturas por cliente
      for (let j = 0; j < 2; j++) {
        const srv1 = serviciosCliente[(i * 2 + j) % serviciosCliente.length];
        const srv2 = serviciosCliente[(i * 2 + j + 1) % serviciosCliente.length];
        const diasAtras = (j + 1) * 7 + i * 3;

        const fact = new FacturaCliente({
          numero: `0001-${pad(numFactCli)}`,
          puntoVenta: 1,
          clienteId: cliente._id,
          clienteInfo: { cuit: cliente.nroDoc, razonSocial: nombreCli },
          fechaEmision: new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000),
          fechaVencimiento: new Date(Date.now() + (30 - diasAtras) * 24 * 60 * 60 * 1000),
          estatus: 'Pendiente',
          detalles: [
            { codigo: srv1.codigo, descripcion: srv1.descripcion, cantidad: 1, precioUnitario: srv1.precio, alicIva: '21%', importe: srv1.precio },
            { codigo: srv2.codigo, descripcion: srv2.descripcion, cantidad: 1, precioUnitario: srv2.precio, alicIva: '21%', importe: srv2.precio }
          ],
          otrosTributos: 0
        });
        await fact.save();
        numFactCli++;
        totalCreados.factCli++;
        console.log(`  🧾 ${fact.numero} - $${fact.total.toFixed(2)}`);

        // 1 Nota de Crédito por cada factura (2 NC por cliente)
        const motivoNC = motivosNC[(i * 2 + j) % motivosNC.length];
        const montoNC = Math.round(srv1.precio * 0.1);
        const nc = new NotaDeCredito({
          numero: `0001-${pad(numNC)}`,
          puntoVenta: 1,
          clienteId: cliente._id,
          clienteInfo: { cuit: cliente.nroDoc, razonSocial: nombreCli },
          fechaEmision: new Date(Date.now() - (diasAtras - 2) * 24 * 60 * 60 * 1000),
          estatus: 'Pendiente',
          conceptos: [
            { codigo: `NC-${numNC}`, descripcion: motivoNC, cantidad: 1, precioUnitario: montoNC, alicIva: '21%', importe: montoNC }
          ],
          otrosTributos: 0,
          facturaOrigenId: fact._id,
          facturaOrigenNumero: fact.numero
        });
        await nc.save();
        numNC++;
        totalCreados.nc++;
        console.log(`  ➖ NC ${nc.numero} - $${nc.total.toFixed(2)}`);

        // 1 Nota de Débito por cada factura (2 ND por cliente)
        const motivoND = motivosND[(i * 2 + j) % motivosND.length];
        const montoND = Math.round(srv1.precio * 0.05);
        const nd = new NotaDeDebito({
          numero: `0001-${pad(numND)}`,
          puntoVenta: 1,
          clienteId: cliente._id,
          clienteInfo: { cuit: cliente.nroDoc, razonSocial: nombreCli },
          fechaEmision: new Date(Date.now() - (diasAtras - 1) * 24 * 60 * 60 * 1000),
          estatus: 'Pendiente',
          concepto: {
            descripcion: motivoND,
            precioUnitario: montoND,
            alicIva: '21%',
            importe: montoND
          },
          otrosTributos: 0,
          facturaOrigenId: fact._id,
          facturaOrigenNumero: fact.numero
        });
        await nd.save();
        numND++;
        totalCreados.nd++;
        console.log(`  ➕ ND ${nd.numero} - $${nd.total.toFixed(2)}`);
      }
    }

    // ===================== DATOS POR PROVEEDOR =====================
    const insumosProveedor = [
      { codigo: 'INS-100', descripcion: 'Notebook Lenovo ThinkPad', precio: 850000 },
      { codigo: 'INS-101', descripcion: 'Mouse inalámbrico x10', precio: 45000 },
      { codigo: 'INS-102', descripcion: 'Disco SSD 1TB Samsung', precio: 95000 },
      { codigo: 'INS-103', descripcion: 'Memoria RAM 16GB DDR5', precio: 72000 },
      { codigo: 'INS-104', descripcion: 'Cable HDMI 2m x20', precio: 28000 },
      { codigo: 'INS-105', descripcion: 'UPS 1500VA APC', precio: 185000 },
      { codigo: 'LOG-100', descripcion: 'Flete interurbano', precio: 35000 },
      { codigo: 'LOG-101', descripcion: 'Embalaje especial', precio: 12000 },
      { codigo: 'LOG-102', descripcion: 'Seguro de carga', precio: 15000 },
      { codigo: 'LOG-103', descripcion: 'Almacenamiento depósito mensual', precio: 42000 },
    ];

    console.log('\n\n════════════════════════════════════════');
    console.log('  FACTURAS DE PROVEEDORES');
    console.log('════════════════════════════════════════\n');

    for (let i = 0; i < proveedores.length; i++) {
      const proveedor = proveedores[i];
      console.log(`\n── ${proveedor.razonSocial} ──`);

      // 2 Facturas por proveedor
      for (let j = 0; j < 2; j++) {
        const ins1 = insumosProveedor[(i * 2 + j) % insumosProveedor.length];
        const ins2 = insumosProveedor[(i * 2 + j + 3) % insumosProveedor.length];
        const diasAtras = (j + 1) * 5 + i * 4;

        const fact = new FacturaProveedor({
          numero: `0003-${pad(numFactProv)}`,
          puntoVenta: 3,
          proveedorId: proveedor._id,
          proveedorInfo: { cuit: proveedor.nroDoc, razonSocial: proveedor.razonSocial },
          fechaEmision: new Date(Date.now() - diasAtras * 24 * 60 * 60 * 1000),
          fechaVencimiento: new Date(Date.now() + (30 - diasAtras) * 24 * 60 * 60 * 1000),
          estatus: 'Pendiente',
          detalles: [
            { codigo: ins1.codigo, descripcion: ins1.descripcion, cantidad: 2, precioUnitario: ins1.precio, alicIva: '21%', importe: ins1.precio * 2 },
            { codigo: ins2.codigo, descripcion: ins2.descripcion, cantidad: 1, precioUnitario: ins2.precio, alicIva: '21%', importe: ins2.precio }
          ],
          otrosTributos: 0
        });
        await fact.save();
        numFactProv++;
        totalCreados.factProv++;
        console.log(`  📑 ${fact.numero} - $${fact.total.toFixed(2)}`);
      }
    }

    // ===================== RESUMEN =====================
    console.log('\n\n════════════════════════════════════════');
    console.log('         RESUMEN FINAL');
    console.log('════════════════════════════════════════');
    console.log(`\n  🧾 Facturas Cliente creadas: ${totalCreados.factCli} (2 por cada ${clientes.length} clientes)`);
    console.log(`  ➖ Notas de Crédito creadas: ${totalCreados.nc} (2 por cada ${clientes.length} clientes)`);
    console.log(`  ➕ Notas de Débito creadas: ${totalCreados.nd} (2 por cada ${clientes.length} clientes)`);
    console.log(`  📑 Facturas Proveedor creadas: ${totalCreados.factProv} (2 por cada ${proveedores.length} proveedores)`);
    console.log(`\n  Total documentos creados: ${totalCreados.factCli + totalCreados.nc + totalCreados.nd + totalCreados.factProv}`);
    console.log('════════════════════════════════════════\n');

    await mongoose.disconnect();
    console.log('✅ Seed completado. Desconectado de MongoDB.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
