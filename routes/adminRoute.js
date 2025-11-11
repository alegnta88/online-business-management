import express from "express";
import { assignRole, getAllAdmins } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import { assignPermissions } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/', adminAuth, getAllAdmins);
adminRouter.put('/assign-role', adminAuth, assignRole);
adminRouter.put('/assign-permissions', adminAuth, assignPermissions);


export default adminRouter;