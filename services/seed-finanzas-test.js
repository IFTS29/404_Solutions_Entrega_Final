/**
 * Script para crear datos de prueba para Finanzas
 * Crea: 1 cliente, 1 factura, 1 nota de crédito, 1 nota de débito
 * 
 * Ejecutar: node seed-finanzas-test.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Cliente = require('./models/Cliente');
const FacturaCliente = require('./models/FacturaCliente');
const NotaDeCredito = require('./models/NotaDeCredito');
const NotaDeDebito = require('./models/NotaDeDebito');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // 1. Crear cliente
    const cliente = await Cliente.create({
      tipoDoc: 'CUIT',
      nroDoc: '30-71234567-9',
      razonSocial: 'Distribuidora Norte S.R.L.',
      email: 'contacto@distribuidoranorte.com.ar',
      telefono: '+54 11 4555 6789',
      direccion: 'Av. San Martín 1500, CABA',
      saldoCuentaCorriente: 0
    });
    console.log('👤 Cliente creado:', cliente.razonSocial, '- ID:', cliente._id);

    // 2. Crear factura de cliente ($50.000 + IVA 21% = $60.500)
    const factura = new FacturaCliente({
      numero: '0001-00000100',
      puntoVenta: 1,
      clienteId: cliente._id,
      clienteInfo: {
        cuit: cliente.nroDoc,
        razonSocial: cliente.razonSocial,
        telefono: cliente.telefono,
        direccion: cliente.direccion
      },
      fechaEmision: new Date(),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      estatus: 'Pendiente',
      detalles: [
        {
          codigo: 'SERV-001',
          descripcion: 'Servicio de consultoría mensual',
          cantidad: 1,
          precioUnitario: 30000,
          alicIva: '21%',
          importe: 30000
        },
        {
          codigo: 'PROD-005',
          descripcion: 'Licencia de software anual',
          cantidad: 1,
          precioUnitario: 20000,
          alicIva: '21%',
          importe: 20000
        }
      ],
      otrosTributos: 0,
      observaciones: 'Factura de prueba para módulo de finanzas'
    });
    await factura.save();
    console.log('🧾 Factura creada:', factura.numero, '- Total: $' + factura.total.toFixed(2));

    // 3. Crear nota de crédito ($10.000 + IVA 21% = $12.100)
    const notaCredito = new NotaDeCredito({
      numero: '0001-00000050',
      puntoVenta: 1,
      clienteId: cliente._id,
      clienteInfo: {
        cuit: cliente.nroDoc,
        razonSocial: cliente.razonSocial,
        telefono: cliente.telefono,
        direccion: cliente.direccion
      },
      fechaEmision: new Date(),
      estatus: 'Pendiente',
      conceptos: [
        {
          codigo: 'DESC-001',
          descripcion: 'Descuento por pronto pago',
          cantidad: 1,
          precioUnitario: 10000,
          alicIva: '21%',
          importe: 10000
        }
      ],
      otrosTributos: 0,
      observaciones: 'Nota de crédito de prueba',
      facturaOrigenId: factura._id,
      facturaOrigenNumero: factura.numero
    });
    await notaCredito.save();
    console.log('➖ Nota de Crédito creada:', notaCredito.numero, '- Total: $' + notaCredito.total.toFixed(2));

    // 4. Crear nota de débito ($5.000 + IVA 21% = $6.050)
    const notaDebito = new NotaDeDebito({
      numero: '0001-00000025',
      puntoVenta: 1,
      clienteId: cliente._id,
      clienteInfo: {
        cuit: cliente.nroDoc,
        razonSocial: cliente.razonSocial,
        telefono: cliente.telefono,
        direccion: cliente.direccion
      },
      fechaEmision: new Date(),
      estatus: 'Pendiente',
      concepto: {
        descripcion: 'Intereses por pago fuera de término',
        precioUnitario: 5000,
        alicIva: '21%',
        importe: 5000
      },
      otrosTributos: 0,
      observaciones: 'Nota de débito de prueba',
      facturaOrigenId: factura._id,
      facturaOrigenNumero: factura.numero
    });
    await notaDebito.save();
    console.log('➕ Nota de Débito creada:', notaDebito.numero, '- Total: $' + notaDebito.total.toFixed(2));

    // Resumen
    console.log('\n=== RESUMEN ===');
    console.log('Factura:         + $' + factura.total.toFixed(2));
    console.log('Nota de Crédito: - $' + notaCredito.total.toFixed(2));
    console.log('Nota de Débito:  + $' + notaDebito.total.toFixed(2));
    const saldoEsperado = factura.total - notaCredito.total + notaDebito.total;
    console.log('─────────────────────────');
    console.log('Saldo por cobrar:  $' + saldoEsperado.toFixed(2));

    await mongoose.disconnect();
    console.log('\n✅ Seed completado. Desconectado de MongoDB.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
