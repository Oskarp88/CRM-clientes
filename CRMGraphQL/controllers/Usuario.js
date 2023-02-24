const Usuario = require("../models/Usuario");
const bcryptjs = require('bcryptjs');
const crearToken = require("../db/jwt");
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variable.env'});

const newUser = async (_, { input }) => {
    const { email, password} = input;
   //revisar si el usuario ya existe
   const user = await Usuario.findOne({email});
   console.log(user)
   if(user) throw new Error("El usuario ya esta registrado")
   //hashear su password
   const salt = await bcryptjs.genSalt(10);
   input.password = await bcryptjs.hash(password, salt)
   //guardar en la bd
   try {
       const newUser = new Usuario(input);
       newUser.save();
       return newUser;
   } catch (error) {
       console.log(error);
   }
}

const allUsers = async (_, { token }) => {
    const userId = await jwt.verify(token, process.env.SECRETA);
    return userId;
 }

const authenticateUser = async(_, { input }) => {
               
    const { email, password } = input;

    //si el usuario existe
    const user = await Usuario.findOne({email});
    if(!user){
       throw new Error("El usuario no existe");
    }

    //revisar si el password es correcto
    const passwordVerify = await bcryptjs.compare(password, user.password);
    if(!passwordVerify) throw new Error("El password es incorrecto")
    //crear token
    return{
       token: crearToken(user, process.env.SECRETA, "24h")
    }
}

module.exports = {
    newUser,
    allUsers,
    authenticateUser
}