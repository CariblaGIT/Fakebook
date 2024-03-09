import { Router } from "express"
import { auth } from "../../core/middlewares/auth.js";
import { changeUserRole, deleteUserById, getProfile, getUsers, modifyProfile } from "./controller.js";
import { verifySuperAdmin } from "../../core/middlewares/isSuperAdmin.js";

const router = Router();

router.get('/', auth, verifySuperAdmin, getUsers);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, modifyProfile);
router.delete('/:id', auth, verifySuperAdmin, deleteUserById);
router.put('/:id/role', auth, verifySuperAdmin, changeUserRole);

export default router;