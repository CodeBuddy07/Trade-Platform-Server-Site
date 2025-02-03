import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { jwtVarify } from "../controllers/Auth/JWT/jwt.roleVerifyController";
import { logoutUser } from "../controllers/Auth/JWT/jwt.logOutController";
import { Login } from "../controllers/Auth/JWT/jwt.logInController";
import { getUser } from "../controllers/Auth/JWT/jwt.getUserController";

const router = express.Router();

router.get('/jwt', verifyToken, jwtVarify);
router.get('/get/:id', verifyToken, getUser);
router.post('/logout', logoutUser);
router.post('/login', Login);

export default router;