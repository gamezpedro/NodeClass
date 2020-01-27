//intención es utilizar estas variables a lo largo del proyecto

//identificar si está en un ambiente de producción o en un ambiente local, si no lo encuentra local mente va asignar el mongodb
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/university";

exports.PORT = process.env.PORT || 8080;
