
let express = require( 'express' );
let morgan = require( 'morgan' );
let bodyParser = require( 'body-parser' );
let mongoose = require( 'mongoose' )
let jsonParser = bodyParser.json();
let { StudentList } = require( './model');
let {DATABASE_URL, PORT} = require( './config' );

let app = express();

app.use ( express.static( 'public' ));
app.use ( morgan ('dev') );


//Es para habilitar los CORS y permitir que otras personas accedan al servidor
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
    return res.send(204);
    }
    next();
   });


let estudiantes = [{
    nombre: "Miguel",
    apellido: "Ángeles",
    matricula: 1730939
},
{
    nombre: "Erick",
    apellido: "González",
    matricula: 1039859
},
{
    nombre: "Victor",
    apellido: "Villareal",
    matricula: 1039863
},
{
    nombre: "Victor",
    apellido: "Cárdenas",
    matricula: 816350
}];

app.get( '/api/students',( req, res ) => {

    StudentList.getAll()
        .then( StudentList => {
            return res.status( 200 ).json( StudentList );
        })
        .catch( error => {
            console.log(error);
            res.statusMessage = "Hubo un error de conexion con la base de datos";
            return res.status( 500 ).send();
        });
});

app.get( '/api/getById',( req, res ) => {

    let id = req.query.id;
    let result = estudiantes.find(( elemento ) => {
        if ( elemento.matricula == id){
            return elemento;
        }
    });
   
    if(result){
        return res.status( 200 ).json( result );
    }
    else{
        res.statusMessage = "El alumno no se encuentra en la base de datos";
        return res.status( 404 ).send();
    }
});


app.get( '/api/getByName/:name',( req, res ) => {

    let name = req.params.name;
    let result = estudiantes.filter(( elemento ) => {
        if ( elemento.nombre === name){
            return elemento;
        }
    });
   
    if(result.length > 0){
        return res.status( 200 ).json( result );

    }
    else{
        res.statusMessage = "El alumno no se encuentra en la base de datos";
        return res.status( 404 ).send();
    }
});

app.post( '/api/newStudent',jsonParser, ( req, res) =>{
    console.log( req.body.nombre );
    let name = req.body.nombre;
    let matricula = req.body.matricula;
    let apellido = req.body.apellido;
    let result = estudiantes.find(( elemento ) => {
        if ( elemento.matricula == matricula){
            return true;
        }
    });
    let estudiante = {
            nombre : name,
            apellido: apellido,
            matricula: matricula
    };

    if(result || name == undefined || matricula == undefined || apellido == undefined || name == "" || matricula == "" || apellido == ""){
        return res.status(406).json({});
    }
    else {
        estudiantes.push(estudiante);
        return res.status(200).json({});
    }
});


app.put( '/api/updateStudent/:id', jsonParser,( req, res) =>{
    console.log( req.body );
    return res.status(200).json({});

});


function runServer(port, databaseUrl){
    return new Promise( (resolve, reject ) => {
        mongoose.connect(databaseUrl, response => {
            if ( response ){
                return reject(response);
            }
            else{
                server = app.listen(port, () => {
                    console.log( "App is running on port " + port );
                    resolve();
                })
                .on( 'error', err => {
                    mongoose.disconnect();
                    return reject(err);
                })
            }
        });
    });
}
   

function closeServer(){
    
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close( err => {
                    if (err){
                        return reject(err);
                    }
                    else{
                        resolve();
                    }
                });
            });
        });
}

runServer( PORT, DATABASE_URL);

module.exports = {app, runServer, closeServer}


/*
app.listen( 8080, () =>{
    console.log( "Servidor corriendo en puerto 8080." );
});
*/