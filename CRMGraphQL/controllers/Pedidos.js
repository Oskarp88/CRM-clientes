const Cliente = require("../models/Cliente");
const Pedido = require("../models/Pedido");
const Producto = require("../models/Producto");


const allOrders = async() => {
    try {
       const pedidos = await Pedido.find({});
       return pedidos;
    } catch (error) {
       console.log(error);
    }
 }

 const allOrdersSeller = async(_, {}, ctx) => {
    try {
       const pedidos = await Pedido.find({vendedor: ctx.usuario.id});
       return pedidos;
    } catch (error) {
       console.log(error);
    }
 }

 const orderById = async(_, {id}, ctx) => {
    //si el pedido existe o no
    const pedido = await Pedido.findById(id);
    if(!pedido) throw new Error("Pedido no encontrado");
    //Solo quien lo creo puede verlo
    if(pedido.vendedor.toString() !== ctx.usuario.id) throw new Error("No tienes las credenciales");
    // retornar el resultado
    return pedido;
  }

 const allOrderState = async (_, {estado}, ctx) =>{
    const pedidos = await Pedido.find({vendedor: ctx.usuario.id, estado});
    return pedidos;
  }

  const newOrder = async (_,{input}, ctx) => {
    const { cliente } = input;
    //verificar si esxite el cliente
    let clienteExiste = await Cliente.findById(cliente);
    if(!clienteExiste){
       throw new Error('Ese cliente no existe');
    }

    //verificar si el cliente es del vendedor
    if(clienteExiste.vendedor.toString() !== ctx.usuario.id){
       throw new Error("No tienes las credenciales");
    }
    //revisar que el stock este dispoinble
     for await ( const articulo of input.pedido) {
        const { id  } = articulo;

        const producto = await Producto.findById(id);

        if(articulo.cantidad > producto.existencia){
          throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
        }
     }
    //crear un nuevo pedido
    const newPedido = new Pedido(input);
   
    //asignarle un vendedor
    newPedido.vendedor = ctx.usuario.id;

    //guardar en la bd
    const result = await newPedido.save();
    return result;
  }

  const updateOrder = async(_,{id, input}, ctx) => {
    const { cliente } = input;
    //verificar que exista el pedido
    const pedido = await Pedido.findById(id);
    if(!pedido) throw new Error("Pedido no encontrado");

    //verificar si el cliente existe
    const existeCliente = await Cliente.findById(cliente);
    if(!existeCliente) throw new Error("El cliente no existe")

    //verificar si cliente y pedido pertence a vendedor
    if(pedido.vendedor.toString() !== ctx.usuario.id) throw new Error("no tienes las credenciales");
    
    //verificar el stock si hay disponible
    if(input.pedido){
       for await ( const articulo of input.pedido){
          const { id } = articulo;
          const producto = await Producto.findById(id);

          if(articulo.cantidad > producto.existencia) {
             throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
          } else {
             //restar la cantidad a lo disponible 
             producto.existencia = producto.existencia - articulo.cantidad;

             await producto.save();
          }
       }
    }
    
    //actualizar producto
    try {
       const result = await Pedido.findByIdAndUpdate({_id: id}, input, {new: true});
       return result;
    } catch (error) {
       console.log(error)
    }
  }

  const deleteOrder = async(_, {id}, ctx) => {
    //verificar si existe el pedido 
    let pedido = await Pedido.findById(id);
    if(!pedido) throw new Error("Pedido no existe");

    // //verificar si el cliente existe
    // const existeCliente = await Cliente.findById(cliente);
    // if(!existeCliente) throw new Error("El cliente no existe")

     //verificar si el vendedor es el que lo borra
    if(pedido.vendedor.toString() !== ctx.usuario.id) throw new Error("no tienes las credenciales");
    
    //eliminar pedido
    await Pedido.findOneAndDelete({_id: id});
    return "Pedido eliminado";
  }

 module.exports = {
    allOrders,
    allOrdersSeller,
    orderById,
    allOrderState,
    newOrder,
    updateOrder,
    deleteOrder
 }