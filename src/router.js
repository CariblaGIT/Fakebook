import { Router } from "express";
import userRouter from "./entities/user/router.js";

const router = Router();

router.get('/healthy', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy :D"
    })
})

router.use('/users', userRouter);

export default router;