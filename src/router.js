import { Router } from "express"

const router = Router();

router.get('/healthy', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy :D"
    })
})

export default router;