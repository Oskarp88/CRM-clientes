const Producto = require("../models/Producto");

const allProducts = async()=>{
    try {
       const AllProduct = await Producto.find({});
       return AllProduct;
    } catch (error) {
       console.log(error);
    }
 }

 const productById = async (_, {id}) =>{
    //verificar si existe el producto
    const productVerify = await Producto.findById(id);

    if(!productVerify) throw new Error("Producto no encontrado");

    return productVerify;
 }

const buscarProductos = async (_, { texto }) => {
    const productos = await Producto.find({ $text: { $search: texto}}).limit(10);
    return productos;
}

const newProduct = async (_, {input})=>{
    try {
       const newProduct = new Producto(input);

       //guardar en la bd
       const result = await newProduct.save();
       return result;
    } catch (error) {
       console.log(error)
    }
}

const updateProduct = async(_, {id, input}) => {
    //verificar si existe el producto
  let updateProduct = await Producto.findById(id);

  if(!updateProduct) throw new Error("Producto no encontrado");

  //guardar en la bd
    updateProduct = await Producto.findOneAndUpdate({_id: id}, input, {new: true});
    return updateProduct;
 }

const deleteProduct = async(_, { id }) =>{
    //verificar si existe el producto
  let deleteProduct = await Producto.findById(id);

  if(!deleteProduct) throw new Error("Producto no encontrado");
   
  //eliminar
  await Producto.findOneAndDelete({_id: id});

  return "Producto eliminado";
 }

module.exports = {
    buscarProductos,
    allProducts,
    productById,
    newProduct,
    updateProduct,
    deleteProduct
}