// const Producto = require("../models/Producto");

// class StockService {
//   // Método estático para obtener el próximo ID disponible
//   static async getNextProductoId() {
//     const ultimoProducto = await Producto.findOne().sort({ id: -1 });
//     return ultimoProducto ? ultimoProducto.id + 1 : 1;
//   }

//   // Actualizar stock desde una factura
//   static async actualizarStockDesdeFactura(factura) {
//     const resultados = [];

//     for (const detalle of factura.detalles) {
//       let producto = null;

//       // Buscar por ID si se proporcionó
//       if (detalle.productoId) {
//         producto = await Producto.findOne({ id: detalle.productoId });
//       }

//       // Si no se encontró por ID, buscar por código
//       if (!producto && detalle.codigo) {
//         // Intentar buscar por ID numérico
//         const codigoNumero = parseInt(detalle.codigo);
//         if (!isNaN(codigoNumero)) {
//           producto = await Producto.findOne({ id: codigoNumero });
//         }

//         // Si no, buscar por nombre exacto
//         if (!producto && detalle.descripcion) {
//           producto = await Producto.findOne({
//             nombre: { $regex: `^${detalle.descripcion}$`, $options: "i" },
//           });
//         }
//       }

//       if (producto) {
//         // Actualizar stock del producto existente
//         const stockAnterior = producto.stockActual;
//         producto.stockActual += detalle.cantidad;
//         // Actualizar precio también (el último precio de compra)
//         producto.precio = detalle.precioUnitario;
//         await producto.save();

//         resultados.push({
//           exito: true,
//           accion: "actualizado",
//           productoId: producto.id,
//           nombre: producto.nombre,
//           stockAnterior,
//           stockNuevo: producto.stockActual,
//           cantidadAgregada: detalle.cantidad,
//         });
//       } else if (detalle.descripcion) {
//         // Crear producto automáticamente si no existe
//         const nuevoId = await StockService.getNextProductoId(); // ✅ Usar StockService.getNextProductoId()

//         const nuevoProducto = new Producto({
//           id: nuevoId,
//           nombre: detalle.descripcion,
//           categoria: "Nuevo",
//           precio: detalle.precioUnitario,
//           stockActual: detalle.cantidad,
//           stockMinimo: 0,
//         });

//         await nuevoProducto.save();

//         // Actualizar el detalle de la factura con el nuevo productoId
//         detalle.productoId = nuevoId;

//         resultados.push({
//           exito: true,
//           accion: "creado",
//           productoId: nuevoId,
//           nombre: detalle.descripcion,
//           stockActual: detalle.cantidad,
//           cantidadAgregada: detalle.cantidad,
//           mensaje: `Producto "${detalle.descripcion}" creado automáticamente (ID: ${nuevoId})`,
//         });

//         console.log(`Producto creado: ${detalle.descripcion} (ID: ${nuevoId})`);
//       } else {
//         resultados.push({
//           exito: false,
//           codigo: detalle.codigo,
//           descripcion: detalle.descripcion,
//           error: "No se pudo crear el producto: falta descripción",
//         });
//       }
//     }

//     return resultados;
//   }

//   // Revertir stock al anular una factura
//   static async revertirStockDesdeFactura(factura) {
//     const resultados = [];

//     for (const detalle of factura.detalles) {
//       let producto = null;

//       if (detalle.productoId) {
//         producto = await Producto.findOne({ id: detalle.productoId });
//       } else if (detalle.codigo) {
//         const codigoNumero = parseInt(detalle.codigo);
//         if (!isNaN(codigoNumero)) {
//           producto = await Producto.findOne({ id: codigoNumero });
//         }
//       }

//       if (producto) {
//         const stockAnterior = producto.stockActual;
//         producto.stockActual -= detalle.cantidad;
//         if (producto.stockActual < 0) producto.stockActual = 0;
//         await producto.save();

//         resultados.push({
//           exito: true,
//           productoId: producto.id,
//           nombre: producto.nombre,
//           stockAnterior,
//           stockNuevo: producto.stockActual,
//           cantidadRevertida: detalle.cantidad,
//         });
//       } else {
//         resultados.push({
//           exito: false,
//           descripcion: detalle.descripcion,
//           error: "Producto no encontrado para revertir stock",
//         });
//       }
//     }

//     return resultados;
//   }

//   // Buscar productos para autocompletado
//   static async buscarProductos(termino) {
//     const productos = await Producto.find({
//       $or: [
//         { nombre: { $regex: termino, $options: "i" } },
//         { id: !isNaN(termino) ? parseInt(termino) : -1 },
//         { categoria: { $regex: termino, $options: "i" } },
//       ],
//     }).limit(10);

//     return productos;
//   }

//   // Obtener inventario completo
//   static async obtenerInventario() {
//     const productos = await Producto.find().sort({ id: 1 });

//     return productos.map((p) => ({
//       id: p.id,
//       nombre: p.nombre,
//       categoria: p.categoria,
//       precio: p.precio,
//       stockActual: p.stockActual,
//       stockMinimo: p.stockMinimo,
//       estado: p.stockActual <= p.stockMinimo ? "⚠️ Bajo stock" : "✅ Normal",
//       colorEstado: p.stockActual <= p.stockMinimo ? "#cc0000" : "#28a745",
//     }));
//   }

//   // Obtener todos los productos para el selector
//   static async obtenerTodosProductos() {
//     return await Producto.find().sort({ nombre: 1 });
//   }

//   // Descontar stock desde una factura de cliente
//   static async descontarStockDesdeFacturaCliente(factura) {
//     const resultados = [];

//     for (const detalle of factura.detalles) {
//       let producto = null;

//       // Buscar por ID si se proporcionó
//       if (detalle.productoId) {
//         producto = await Producto.findOne({ id: detalle.productoId });
//       }

//       // Si no se encontró por ID, buscar por código
//       if (!producto && detalle.codigo) {
//         const codigoNumero = parseInt(detalle.codigo);
//         if (!isNaN(codigoNumero)) {
//           producto = await Producto.findOne({ id: codigoNumero });
//         }

//         // Si no, buscar por nombre exacto
//         if (!producto && detalle.descripcion) {
//           producto = await Producto.findOne({
//             nombre: { $regex: `^${detalle.descripcion}$`, $options: "i" },
//           });
//         }
//       }

//       if (producto) {
//         // Verificar stock suficiente
//         if (producto.stockActual < detalle.cantidad) {
//           throw new Error(
//             `Stock insuficiente para el producto "${producto.nombre}". Stock actual: ${producto.stockActual}, Requerido: ${detalle.cantidad}`,
//           );
//         }

//         // Descontar stock del producto existente
//         const stockAnterior = producto.stockActual;
//         producto.stockActual -= detalle.cantidad;
//         await producto.save();

//         resultados.push({
//           exito: true,
//           accion: "descontado",
//           productoId: producto.id,
//           nombre: producto.nombre,
//           stockAnterior,
//           stockNuevo: producto.stockActual,
//           cantidadDescontada: detalle.cantidad,
//         });
//       } else if (detalle.descripcion) {
//         // Si el producto no existe, lo creamos con stock 0 y luego descontamos?
//         // Para factura de cliente, normalmente no se crean productos nuevos
//         // Mejor mostrar error
//         resultados.push({
//           exito: false,
//           codigo: detalle.codigo,
//           descripcion: detalle.descripcion,
//           error: "Producto no encontrado en el inventario",
//         });

//         throw new Error(
//           `Producto "${detalle.descripcion}" no encontrado en el inventario. Verifique el catálogo.`,
//         );
//       } else {
//         resultados.push({
//           exito: false,
//           codigo: detalle.codigo,
//           descripcion: detalle.descripcion,
//           error: "No se pudo descontar stock: producto no identificado",
//         });
//       }
//     }

//     return resultados;
//   }

//   // Revertir stock desde una factura de cliente (cuando se anula)
//   static async revertirStockDesdeFacturaCliente(factura) {
//     const resultados = [];

//     for (const detalle of factura.detalles) {
//       let producto = null;

//       if (detalle.productoId) {
//         producto = await Producto.findOne({ id: detalle.productoId });
//       } else if (detalle.codigo) {
//         const codigoNumero = parseInt(detalle.codigo);
//         if (!isNaN(codigoNumero)) {
//           producto = await Producto.findOne({ id: codigoNumero });
//         }
//       }

//       if (producto) {
//         const stockAnterior = producto.stockActual;
//         producto.stockActual += detalle.cantidad;
//         await producto.save();

//         resultados.push({
//           exito: true,
//           productoId: producto.id,
//           nombre: producto.nombre,
//           stockAnterior,
//           stockNuevo: producto.stockActual,
//           cantidadRevertida: detalle.cantidad,
//         });
//       } else {
//         resultados.push({
//           exito: false,
//           descripcion: detalle.descripcion,
//           error: "Producto no encontrado para revertir stock",
//         });
//       }
//     }

//     return resultados;
//   }

//   // Devolver stock desde una nota de crédito (devuelve productos al inventario)
//   static async devolverStockDesdeNotaCredito(nota) {
//     const resultados = [];

//     for (const concepto of nota.conceptos) {
//       let producto = null;

//       // Buscar por ID si se proporcionó
//       if (concepto.productoId) {
//         producto = await Producto.findOne({ id: concepto.productoId });
//       }

//       // Si no se encontró por ID, buscar por código
//       if (!producto && concepto.codigo) {
//         const codigoNumero = parseInt(concepto.codigo);
//         if (!isNaN(codigoNumero)) {
//           producto = await Producto.findOne({ id: codigoNumero });
//         }
//       }

//       // Si no, buscar por nombre
//       if (!producto && concepto.descripcion) {
//         producto = await Producto.findOne({
//           nombre: { $regex: `^${concepto.descripcion}$`, $options: "i" },
//         });
//       }

//       if (producto) {
//         // Aumentar stock del producto existente (devolución)
//         const stockAnterior = producto.stockActual;
//         producto.stockActual += concepto.cantidad;
//         await producto.save();

//         resultados.push({
//           exito: true,
//           accion: "devuelto",
//           productoId: producto.id,
//           nombre: producto.nombre,
//           stockAnterior,
//           stockNuevo: producto.stockActual,
//           cantidadDevuelta: concepto.cantidad,
//         });
//       } else {
//         resultados.push({
//           exito: false,
//           codigo: concepto.codigo,
//           descripcion: concepto.descripcion,
//           error: "Producto no encontrado en el inventario para devolver",
//         });

//         throw new Error(
//           `Producto "${concepto.descripcion}" no encontrado en el inventario.`,
//         );
//       }
//     }

//     return resultados;
//   }

//   // Revertir la devolución de stock (cuando se anula una nota de crédito)
//   static async revertirDevolucionStockDesdeNotaCredito(nota) {
//     const resultados = [];

//     for (const concepto of nota.conceptos) {
//       let producto = null;

//       if (concepto.productoId) {
//         producto = await Producto.findOne({ id: concepto.productoId });
//       } else if (concepto.codigo) {
//         const codigoNumero = parseInt(concepto.codigo);
//         if (!isNaN(codigoNumero)) {
//           producto = await Producto.findOne({ id: codigoNumero });
//         }
//       }

//       if (producto) {
//         const stockAnterior = producto.stockActual;
//         producto.stockActual -= concepto.cantidad;
//         if (producto.stockActual < 0) producto.stockActual = 0;
//         await producto.save();

//         resultados.push({
//           exito: true,
//           productoId: producto.id,
//           nombre: producto.nombre,
//           stockAnterior,
//           stockNuevo: producto.stockActual,
//           cantidadRevertida: concepto.cantidad,
//         });
//       } else {
//         resultados.push({
//           exito: false,
//           descripcion: concepto.descripcion,
//           error: "Producto no encontrado para revertir devolución",
//         });
//       }
//     }

//     return resultados;
//   }
// }

// module.exports = StockService;


const Producto = require("../models/Producto");
const mongoose = require('mongoose');

class StockService {
  // Método estático para obtener el próximo ID disponible (para el campo id numérico)
  static async getNextProductoId() {
    const ultimoProducto = await Producto.findOne().sort({ id: -1 });
    return ultimoProducto ? ultimoProducto.id + 1 : 1;
  }

  // Actualizar stock desde una factura
  static async actualizarStockDesdeFactura(factura) {
    const resultados = [];

    for (const detalle of factura.detalles) {
      let producto = null;

      // ✅ Buscar por _id (ObjectId) si se proporcionó
      if (detalle.productoId) {
        // Si es string, convertirlo a ObjectId
        if (typeof detalle.productoId === 'string') {
          try {
            producto = await Producto.findById(detalle.productoId);
          } catch (error) {
            // Si falla, intentar buscar por id numérico
            const idNumero = parseInt(detalle.productoId);
            if (!isNaN(idNumero)) {
              producto = await Producto.findOne({ id: idNumero });
            }
          }
        } else if (detalle.productoId instanceof mongoose.Types.ObjectId) {
          producto = await Producto.findById(detalle.productoId);
        } else {
          // Si es número, buscar por id
          producto = await Producto.findOne({ id: detalle.productoId });
        }
      }

      // Si no se encontró por ID, buscar por código
      if (!producto && detalle.codigo) {
        // Intentar buscar por ID numérico
        const codigoNumero = parseInt(detalle.codigo);
        if (!isNaN(codigoNumero)) {
          producto = await Producto.findOne({ id: codigoNumero });
        }

        // Si no, buscar por nombre exacto
        if (!producto && detalle.descripcion) {
          producto = await Producto.findOne({
            nombre: { $regex: `^${detalle.descripcion}$`, $options: "i" },
          });
        }
      }

      if (producto) {
        // Actualizar stock del producto existente
        const stockAnterior = producto.stockActual;
        producto.stockActual += detalle.cantidad;
        producto.precio = detalle.precioUnitario;
        await producto.save();

        resultados.push({
          exito: true,
          accion: "actualizado",
          productoId: producto._id, // ✅ Usar _id (ObjectId)
          productoIdNum: producto.id, // También guardar el id numérico por si acaso
          nombre: producto.nombre,
          stockAnterior,
          stockNuevo: producto.stockActual,
          cantidadAgregada: detalle.cantidad,
        });
      } else if (detalle.descripcion) {
        // Crear producto automáticamente si no existe
        const nuevoId = await StockService.getNextProductoId();

        const nuevoProducto = new Producto({
          id: nuevoId,
          nombre: detalle.descripcion,
          categoria: "Nuevo",
          precio: detalle.precioUnitario,
          stockActual: detalle.cantidad,
          stockMinimo: 0,
        });

        await nuevoProducto.save();

        // ✅ IMPORTANTE: Guardar el _id (ObjectId) en el detalle
        detalle.productoId = nuevoProducto._id;

        resultados.push({
          exito: true,
          accion: "creado",
          productoId: nuevoProducto._id, // ✅ Usar _id (ObjectId)
          productoIdNum: nuevoProducto.id, // También guardar el id numérico
          nombre: detalle.descripcion,
          stockActual: detalle.cantidad,
          cantidadAgregada: detalle.cantidad,
          mensaje: `Producto "${detalle.descripcion}" creado automáticamente (ID: ${nuevoId})`,
        });

        console.log(`Producto creado: ${detalle.descripcion} (ID ObjectId: ${nuevoProducto._id}, ID numérico: ${nuevoId})`);
      } else {
        resultados.push({
          exito: false,
          codigo: detalle.codigo,
          descripcion: detalle.descripcion,
          error: "No se pudo crear el producto: falta descripción",
        });
      }
    }

    return resultados;
  }

  // Revertir stock al anular una factura
  static async revertirStockDesdeFactura(factura) {
    const resultados = [];

    for (const detalle of factura.detalles) {
      let producto = null;

      // ✅ Buscar por _id (ObjectId) si se proporcionó
      if (detalle.productoId) {
        if (typeof detalle.productoId === 'string') {
          try {
            producto = await Producto.findById(detalle.productoId);
          } catch (error) {
            const idNumero = parseInt(detalle.productoId);
            if (!isNaN(idNumero)) {
              producto = await Producto.findOne({ id: idNumero });
            }
          }
        } else if (detalle.productoId instanceof mongoose.Types.ObjectId) {
          producto = await Producto.findById(detalle.productoId);
        } else {
          producto = await Producto.findOne({ id: detalle.productoId });
        }
      } else if (detalle.codigo) {
        const codigoNumero = parseInt(detalle.codigo);
        if (!isNaN(codigoNumero)) {
          producto = await Producto.findOne({ id: codigoNumero });
        }
      }

      if (producto) {
        const stockAnterior = producto.stockActual;
        producto.stockActual -= detalle.cantidad;
        if (producto.stockActual < 0) producto.stockActual = 0;
        await producto.save();

        resultados.push({
          exito: true,
          productoId: producto._id, // ✅ Usar _id
          nombre: producto.nombre,
          stockAnterior,
          stockNuevo: producto.stockActual,
          cantidadRevertida: detalle.cantidad,
        });
      } else {
        resultados.push({
          exito: false,
          descripcion: detalle.descripcion,
          error: "Producto no encontrado para revertir stock",
        });
      }
    }

    return resultados;
  }

  // Buscar productos para autocompletado
  static async buscarProductos(termino) {
    const productos = await Producto.find({
      $or: [
        { nombre: { $regex: termino, $options: "i" } },
        { id: !isNaN(termino) ? parseInt(termino) : -1 },
        { categoria: { $regex: termino, $options: "i" } },
      ],
    }).limit(10);

    return productos;
  }

  // Obtener inventario completo
  static async obtenerInventario() {
    const productos = await Producto.find().sort({ id: 1 });

    return productos.map((p) => ({
      id: p.id,
      _id: p._id, // ✅ Incluir _id
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      stockActual: p.stockActual,
      stockMinimo: p.stockMinimo,
      estado: p.stockActual <= p.stockMinimo ? "⚠️ Bajo stock" : "✅ Normal",
      colorEstado: p.stockActual <= p.stockMinimo ? "#cc0000" : "#28a745",
    }));
  }

  // Obtener todos los productos para el selector
  static async obtenerTodosProductos() {
    return await Producto.find().sort({ nombre: 1 });
  }

  // Descontar stock desde una factura de cliente
  static async descontarStockDesdeFacturaCliente(factura) {
    const resultados = [];

    for (const detalle of factura.detalles) {
      let producto = null;

      // ✅ Buscar por _id (ObjectId) si se proporcionó
      if (detalle.productoId) {
        if (typeof detalle.productoId === 'string') {
          try {
            producto = await Producto.findById(detalle.productoId);
          } catch (error) {
            const idNumero = parseInt(detalle.productoId);
            if (!isNaN(idNumero)) {
              producto = await Producto.findOne({ id: idNumero });
            }
          }
        } else if (detalle.productoId instanceof mongoose.Types.ObjectId) {
          producto = await Producto.findById(detalle.productoId);
        } else {
          producto = await Producto.findOne({ id: detalle.productoId });
        }
      }

      // Si no se encontró por ID, buscar por código
      if (!producto && detalle.codigo) {
        const codigoNumero = parseInt(detalle.codigo);
        if (!isNaN(codigoNumero)) {
          producto = await Producto.findOne({ id: codigoNumero });
        }

        if (!producto && detalle.descripcion) {
          producto = await Producto.findOne({
            nombre: { $regex: `^${detalle.descripcion}$`, $options: "i" },
          });
        }
      }

      if (producto) {
        if (producto.stockActual < detalle.cantidad) {
          throw new Error(
            `Stock insuficiente para el producto "${producto.nombre}". Stock actual: ${producto.stockActual}, Requerido: ${detalle.cantidad}`,
          );
        }

        const stockAnterior = producto.stockActual;
        producto.stockActual -= detalle.cantidad;
        await producto.save();

        resultados.push({
          exito: true,
          accion: "descontado",
          productoId: producto._id, // ✅ Usar _id
          nombre: producto.nombre,
          stockAnterior,
          stockNuevo: producto.stockActual,
          cantidadDescontada: detalle.cantidad,
        });
      } else if (detalle.descripcion) {
        resultados.push({
          exito: false,
          codigo: detalle.codigo,
          descripcion: detalle.descripcion,
          error: "Producto no encontrado en el inventario",
        });

        throw new Error(
          `Producto "${detalle.descripcion}" no encontrado en el inventario. Verifique el catálogo.`,
        );
      } else {
        resultados.push({
          exito: false,
          codigo: detalle.codigo,
          descripcion: detalle.descripcion,
          error: "No se pudo descontar stock: producto no identificado",
        });
      }
    }

    return resultados;
  }

  // Revertir stock desde una factura de cliente (cuando se anula)
  static async revertirStockDesdeFacturaCliente(factura) {
    const resultados = [];

    for (const detalle of factura.detalles) {
      let producto = null;

      // ✅ Buscar por _id (ObjectId) si se proporcionó
      if (detalle.productoId) {
        if (typeof detalle.productoId === 'string') {
          try {
            producto = await Producto.findById(detalle.productoId);
          } catch (error) {
            const idNumero = parseInt(detalle.productoId);
            if (!isNaN(idNumero)) {
              producto = await Producto.findOne({ id: idNumero });
            }
          }
        } else if (detalle.productoId instanceof mongoose.Types.ObjectId) {
          producto = await Producto.findById(detalle.productoId);
        } else {
          producto = await Producto.findOne({ id: detalle.productoId });
        }
      } else if (detalle.codigo) {
        const codigoNumero = parseInt(detalle.codigo);
        if (!isNaN(codigoNumero)) {
          producto = await Producto.findOne({ id: codigoNumero });
        }
      }

      if (producto) {
        const stockAnterior = producto.stockActual;
        producto.stockActual += detalle.cantidad;
        await producto.save();

        resultados.push({
          exito: true,
          productoId: producto._id, // ✅ Usar _id
          nombre: producto.nombre,
          stockAnterior,
          stockNuevo: producto.stockActual,
          cantidadRevertida: detalle.cantidad,
        });
      } else {
        resultados.push({
          exito: false,
          descripcion: detalle.descripcion,
          error: "Producto no encontrado para revertir stock",
        });
      }
    }

    return resultados;
  }

  // Devolver stock desde una nota de crédito
  static async devolverStockDesdeNotaCredito(nota) {
    const resultados = [];

    for (const concepto of nota.conceptos) {
      let producto = null;

      // ✅ Buscar por _id (ObjectId) si se proporcionó
      if (concepto.productoId) {
        if (typeof concepto.productoId === 'string') {
          try {
            producto = await Producto.findById(concepto.productoId);
          } catch (error) {
            const idNumero = parseInt(concepto.productoId);
            if (!isNaN(idNumero)) {
              producto = await Producto.findOne({ id: idNumero });
            }
          }
        } else if (concepto.productoId instanceof mongoose.Types.ObjectId) {
          producto = await Producto.findById(concepto.productoId);
        } else {
          producto = await Producto.findOne({ id: concepto.productoId });
        }
      }

      if (!producto && concepto.codigo) {
        const codigoNumero = parseInt(concepto.codigo);
        if (!isNaN(codigoNumero)) {
          producto = await Producto.findOne({ id: codigoNumero });
        }
      }

      if (!producto && concepto.descripcion) {
        producto = await Producto.findOne({
          nombre: { $regex: `^${concepto.descripcion}$`, $options: "i" },
        });
      }

      if (producto) {
        const stockAnterior = producto.stockActual;
        producto.stockActual += concepto.cantidad;
        await producto.save();

        resultados.push({
          exito: true,
          accion: "devuelto",
          productoId: producto._id, // ✅ Usar _id
          nombre: producto.nombre,
          stockAnterior,
          stockNuevo: producto.stockActual,
          cantidadDevuelta: concepto.cantidad,
        });
      } else {
        resultados.push({
          exito: false,
          codigo: concepto.codigo,
          descripcion: concepto.descripcion,
          error: "Producto no encontrado en el inventario para devolver",
        });

        throw new Error(
          `Producto "${concepto.descripcion}" no encontrado en el inventario.`,
        );
      }
    }

    return resultados;
  }

  // Revertir la devolución de stock
  static async revertirDevolucionStockDesdeNotaCredito(nota) {
    const resultados = [];

    for (const concepto of nota.conceptos) {
      let producto = null;

      // ✅ Buscar por _id (ObjectId) si se proporcionó
      if (concepto.productoId) {
        if (typeof concepto.productoId === 'string') {
          try {
            producto = await Producto.findById(concepto.productoId);
          } catch (error) {
            const idNumero = parseInt(concepto.productoId);
            if (!isNaN(idNumero)) {
              producto = await Producto.findOne({ id: idNumero });
            }
          }
        } else if (concepto.productoId instanceof mongoose.Types.ObjectId) {
          producto = await Producto.findById(concepto.productoId);
        } else {
          producto = await Producto.findOne({ id: concepto.productoId });
        }
      } else if (concepto.codigo) {
        const codigoNumero = parseInt(concepto.codigo);
        if (!isNaN(codigoNumero)) {
          producto = await Producto.findOne({ id: codigoNumero });
        }
      }

      if (producto) {
        const stockAnterior = producto.stockActual;
        producto.stockActual -= concepto.cantidad;
        if (producto.stockActual < 0) producto.stockActual = 0;
        await producto.save();

        resultados.push({
          exito: true,
          productoId: producto._id, // ✅ Usar _id
          nombre: producto.nombre,
          stockAnterior,
          stockNuevo: producto.stockActual,
          cantidadRevertida: concepto.cantidad,
        });
      } else {
        resultados.push({
          exito: false,
          descripcion: concepto.descripcion,
          error: "Producto no encontrado para revertir devolución",
        });
      }
    }

    return resultados;
  }
}

module.exports = StockService;