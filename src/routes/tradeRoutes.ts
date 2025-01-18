import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { addTrade } from "../controllers/Trade/trade.addTradeController";
import { deleteTrade } from "../controllers/Trade/trade.deleteTradeController";
import { getAllTrades } from "../controllers/Trade/trade.getAllTradecontroller";


const router = express.Router();


router.get("/trades", verifyToken, getAllTrades);
router.post("/trades", verifyToken, verifyRole("admin"), addTrade); 
router.delete("/trades/:id", verifyToken, verifyRole("admin"), deleteTrade); 

export default router;
