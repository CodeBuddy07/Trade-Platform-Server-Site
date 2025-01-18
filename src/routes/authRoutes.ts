import express from "express";
import { registerTradesPerson } from "../controllers/Auth/TradePerson/auth.tradePersonRegisterController";
import { TradesPersonLogin } from "../controllers/Auth/TradePerson/auth.tradePersonLoginController";
import { registerCustomer } from "../controllers/Auth/Customer/auth.customerRegisterController";
import { loginCustomer } from "../controllers/Auth/Customer/auth.customerLoginController";



const router = express.Router();

// TradePerson Authentication
router.post("/tradesperson/register", registerTradesPerson);
router.post("/tradesperson/login", TradesPersonLogin);

// Customer Authentication
router.post("/customer/register", registerCustomer);
router.post("/customer/login", loginCustomer);

export default router;
