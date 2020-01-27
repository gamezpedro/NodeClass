let mongoose = require( 'mongoose' );

mongoose.Promise = global.Promise;  //Promesa es cuando yo solicito informacion me llega

let studentCollection = mongoose.Schema({     //estamos haciendo la coleccion del estudiante --definiendo la tabla
    nombre : { type: String },
    apellido : { type: String },
    matricula : {
        type : Number,
        required : true,
        unique : true
    }
});

let Student = mongoose.model( 'students', studentCollection);

let StudentList = {
    getAll : function(){
        return Student.find()
            .then( students => {
                return students;
            })
            .catch( error => {
                throw Error( error );
            });
    },
    /*
    getById : function(id){
        return Student.findOne( {matricula: 'id'} )
            .then( students => {
                ////////
            })
    }
    */
   addStudent : function( newStudent ){
       return Student.create( newStudent )

   }

};




module.exports = {
    StudentList
};

