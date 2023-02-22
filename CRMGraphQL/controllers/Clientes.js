const Cliente = require("../models/Cliente");
const Pedido = require("../models/Pedido");


const AllClients = async () => {
    try {
       const clientes = await Cliente.find({});
       return clientes;
    } catch (error) {
       console.log(error);
    }
 }

 const AllClientsSeller = async(_,{}, ctx)=>{
    try {
       const clientes = await Cliente.find({vendedor: ctx.usuario.id.toString()});
       return clientes;
    } catch (error) {
       console.log(error);
    }
 }

 const lookupClient = async (_, { id }, ctx) => {
    try {
       const clientId = await Cliente.findById(id);
       if(!clientId) throw new Error("Cliente no encontrado");
       if(clientId.vendedor.toString() !== ctx.usuario.id) throw new Error("No tienes las credenciales");
       return clientId;
    } catch (error) {
       console.log(error);
    }
 }

 const bestCustomers = async () => {
    const clientes = await Pedido.aggregate([
       { $match: { estado: "COMPLETADO"} },
       {$group: { 
          _id: "$cliente",
          total: { $sum: '$total' }
       }},
       {
          $lookup: {
             from: 'clientes',
             localField: '_id',
             foreignField: '_id',
             as: 'cliente'
          }
       },
       {
          $limit: 10
       },
       {
          $sort: { total: -1 }
       }
    ]);
    return clientes;
  }

  const newClient = async(_, {input}, ctx) => {
    // console.log("ctx")
    // console.log(ctx)
    const { email } = input;
    //verificar si el cliente esta registrado
    const cliente = await Cliente.findOne({email});
    
    if(cliente) throw new Error("Cliente ya se encuentra registrado");
     
    //asignar vendedor
 const nuevoCliente = new Cliente(input);
    nuevoCliente.vendedor = ctx.usuario.id;
    //guardar en la bd
    try {
       const result = await nuevoCliente.save();
       return result;
    } catch (error) {
       console.log(error);
    }
  }

 const updateClient = async (_, {id, input}, ctx) => {
    //verificar si existe
    let cliente = await Cliente.findById(id);
    if(!cliente) throw new Error('El cliente no existe');

    //verificar si el vendedor es quien edita
    if(cliente.vendedor.toString() !== ctx.usuario.id) throw new Error('No tienes las credenciales');

    //actualizar cliente
    cliente = await Cliente.findByIdAndUpdate({_id: id}, input, {new: true});
    return cliente;
  }

  const deleteClient = async(_, {id}, ctx) => {
    let cliente = await Cliente.findById(id);
    if(!cliente){
       throw new Error("ese cliente no existe");
    }

    //verificar si el vendendor es quien elimina
    if(cliente.vendedor.toString() !== ctx.usuario.id){
       throw new Error("No tienes las credenciales");
    }

    //eliminar
    await Cliente.findOneAndDelete({_id: id});
    return "Cliente eliminado";
  }

 module.exports = {
    AllClients,
    AllClientsSeller,
    lookupClient,
    bestCustomers,
    newClient,
    updateClient,
    deleteClient
 }