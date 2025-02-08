import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { addTrade } from "../controllers/Trade/trade.addTradeController";
import { deleteTrade } from "../controllers/Trade/trade.deleteTradeController";
import { getAllTrades } from "../controllers/Trade/trade.getAllTradeController";
import upload from "../config/multer";


const router = express.Router();


router.get("/trades", getAllTrades);
router.post("/trades", verifyToken, verifyRole('admin','superadmin'),
upload.fields([
  { name: "tradeImage", maxCount: 1 }
]), addTrade); 
router.delete("/trades/:id", verifyToken, verifyRole('admin','superadmin'), deleteTrade); 

export default router;
