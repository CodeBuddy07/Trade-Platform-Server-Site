import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { getAllServiceAreas } from "../controllers/ServiceArea/serviceArea.getAllController";
import { addServiceArea } from "../controllers/ServiceArea/serviceArea.addAreaController";
import { deleteServiceArea } from "../controllers/ServiceArea/serviceArea.deleteAreaController";


const router = express.Router();


router.get("/service-area", verifyToken, getAllServiceAreas);
router.post("/service-area", verifyToken, verifyRole('admin','superadmin'), addServiceArea); 
router.delete("/service-area/:id", verifyToken, verifyRole('admin','superadmin'), deleteServiceArea); 

export default router;