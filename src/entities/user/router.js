import { Router } from "express"
import { auth } from "../../core/middlewares/auth.js";
import { getProfile, getUsers, modifyProfile } from "./controller.js";
import { verifySuperAdmin } from "../../core/middlewares/isSuperAdmin.js";

const router = Router();

router.get('/', auth, verifySuperAdmin, getUsers);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, modifyProfile);

export default router;