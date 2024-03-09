import { Router } from "express"
import { getProfile, getUsers, modifyProfile } from "./controller.js";
import { auth } from "../../core/middlewares/auth.js";

const router = Router();

router.get('/', getUsers);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, modifyProfile);

export default router;