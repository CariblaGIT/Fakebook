// Forma anticuada de exportar / importar modulos
// const express = require("express");

import 'dotenv/config';
import express from 'express';
import router from './router.js'
import { dbConnection } from './db.js';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

app.use('/api', router);

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
