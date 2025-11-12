import express from "express";
import { assignRole, getAllAdmins } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import { assignPermissions, revokePermissions } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/', adminAuth, getAllAdmins);
adminRouter.put('/assign-role', adminAuth, assignRole);
adminRouter.put('/assign-permissions', adminAuth, assignPermissions);
adminRouter.put('/revoke-permissions', adminAuth, revokePermissions);

export default adminRouter;