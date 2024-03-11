// Forma anticuada de exportar / importar modulos
// const express = require("express");

import 'dotenv/config';
import app from './app.js'
import { dbConnection } from './db.js';

const PORT = process.env.PORT || 4001;

dbConnection()
    .then(() => {
        console.log("Database connected");
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        })
    })
    .catch(error => {
        console.log(error)
    });
