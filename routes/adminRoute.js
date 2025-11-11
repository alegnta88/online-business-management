import express from "express";
import { assignRole, getAllAdmins } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.get('/', adminAuth, getAllAdmins);
adminRouter.put('/assign-role', adminAuth, assignRole);

export default adminRouter;