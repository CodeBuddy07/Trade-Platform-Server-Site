import express from "express";
import { registerTradesPerson } from "../controllers/Auth/TradePerson/auth.tradePersonRegisterController";
import { registerCustomer } from "../controllers/Auth/Customer/auth.customerRegisterController";
import { loginCustomer } from "../controllers/Auth/Customer/auth.customerLoginController";
import { adminLogin } from "../controllers/Auth/Admin/admin.loginController";
import upload from "../config/multer";



const router = express.Router();

//Admin Authentication
router.post("/admin/login", adminLogin);

// TradePerson Authentication
router.post(
    "/tradesperson/register",
    upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "insuranceImage", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
  ]), registerTradesPerson)
  ;


// Customer Authentication
router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);

export default router;
