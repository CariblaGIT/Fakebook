import path from "path";
import { fileURLToPath } from 'url';
import express from 'express';
import { Router } from "express";
import userRouter from "./entities/user/router.js";
import authRouter from "./entities/auth/router.js";
import postRouter from "./entities/post/router.js";

const router = Router();

router.get('/healthy', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy :D"
    })
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use('/public/avatar', express.static(path.join(__dirname,"../public/img_avatars/")));
router.use('/public/post', express.static(path.join(__dirname,"../public/img_posts/")));

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/posts', postRouter);

export default router;