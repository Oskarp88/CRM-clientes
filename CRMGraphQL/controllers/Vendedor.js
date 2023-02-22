const Pedido = require("../models/Pedido");


const bestSeller = async () => {
    const vendedores = await Pedido.aggregate([
       { $match: { estado: "COMPLETADO" } },
       { $group: {
          _id: "$vendedor",
          total: {$sum: '$total'}
       }},
       {
          $lookup: {
            from: 'usuarios' ,
            localField: '_id',
            foreignField: '_id',
            as: 'vendedor'
          }
       },
       {
          $limit: 3
       },
       {
          $sort: { total: -1}
       }
    ])
    return vendedores;
  }

  module.exports = {
    bestSeller
  }