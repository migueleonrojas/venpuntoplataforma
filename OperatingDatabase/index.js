const express = require('express');
const bodyparser = require('body-parser');
const methodoverride = require('method-override');
const http = require('http');
const cors = require('cors');

const { Router } = require('express');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const companyModel = require('./CompanyDataDB');
const adminModel = require('./AdministratorDataDB');
mongoose.connect('mongodb+srv://migueleonrojas:Venezuela.2022@cluster0.tsjtp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', (err, res) => {

    
    if(err) throw err;

    console.log('Conexion con el servidor de manera exitosa');

});

const app = express();
app.use(cors());

app.use(bodyparser.urlencoded({ extended:false }));
app.use(bodyparser.json());
app.use(express.json( { limit: '50mb' } ));
app.use(methodoverride());

const router = express.Router();

router.post('/consult_admin_for_id',(req, res) => {

    let query = { _id: { $eq : req.body.id} };

    adminModel.findOne( query, (err, respuesta) => {

        if(err){
            res.send({
                codigo: -1,
                error: err.message ,
                mensaje: { mensaje: err.message}
            })
        }

        if(respuesta === null){

            res.send( {
                codigo: 0,
                error: "Sin errores",
                mensaje: `El usuario no existe`
                
            });
        }

        else{
            res.send({
                codigo: 1,
                error: "Sin errores",
                mensaje: `El usuario existe`,
                dataAdmin: respuesta
            });
        }

    });

});

router.put('/update_admin_for_id',(req, res) => {
    
    let query = { _id: { $eq : req.body.id} };

    adminModel.findOne( query, (err, respuesta) => {

        if(err){
            res.send({
                codigo: -1,
                error: err.message ,
                mensaje: { mensaje: err.message}
            })
        }

        if(respuesta === null){

            res.send( {
                codigo: 0,
                error: "Sin errores",
                mensaje: `El usuario no existe`
                
            });
        }

        else{
            res.send({
                codigo: 1,
                error: "Sin errores",
                mensaje: `El usuario existe`,
                dataAdmin: respuesta
            });
        }

    });

});

router.post('/consult_admin', (req, res) => {  

    let query = { $and: [ { Nombre: { $eq : req.body.nombre} }, { Password: { $eq: req.body.password  } } ]  };
    
    adminModel.findOne( query, (err, respuesta) => {

        if(err){
            res.send( {
                codigo: -1,
                error: err.message ,
                mensaje: { mensaje: err.message}
            });
        }

        if(respuesta === null){

            res.send( {
                codigo: 0,
                error: "Sin errores",
                mensaje: `El usuario o el password es incorrecto`
                
            });
        }

        else{
            res.send({
                codigo: 1,
                error: "Sin errores",
                mensaje: `Bienvenido ${req.body.nombre}`,
                dataAdmin: respuesta
            });
        }

    });
    
});

router.post('/register_administrator', (req, res) => {  

    let objectAdmin = new adminModel();
    objectAdmin.Nombre = req.body.nombre;
    objectAdmin.Password = req.body.password;
    objectAdmin.LoggedIn = false

    objectAdmin.save((err, respuesta) => {

        if(err){
            res.send( {
                error: "No se pudo registrar el admin",
                mensaje: { mensaje: err.message}
            });
        }

        else{
            res.send({
                error: "Sin errores",
                mensaje: "El admin se guardo con exito"
            });
        }

    });
    
});

router.post('/register_company', (req, res) => {  
    let objectCompany = new companyModel();
    objectCompany.Nombre = req.body.nombre;
    objectCompany.Rif = req.body.rif;
    objectCompany.Direccion = req.body.direccion;

    objectCompany.save( (err, respuesta) => { 
        if(err){

            res.send( {
                error: "No se pudo registrar la compañia",
                mensaje: { mensaje: err.message}
            });
        }
        else{
            res.send({
                error: "Sin errores",
                mensaje: "La compañia se guardo con exito"
            });
        }

     });
});

const port = 3000;
app.listen(port, () =>  {

    console.log(`El servidor esta corriendo en el puerto ${port}`);

});

app.use(router);