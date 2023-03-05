const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variable.env'});

const crearToken = (usuario, secreta, expiresIn)=>{
    // console.log("token")
    // console.log(usuario);
    const { id, email, nombre, apellido } = usuario;
    return jwt.sign({id, email, nombre, apellido }, secreta, { expiresIn})
 }

 module.exports = crearToken;