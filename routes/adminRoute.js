import express from "express";
import {
  createAdminOTPController,
  verifyAdminOTPController,
  assignRole,
  assignPermissions,
  revokePermissions,
  getAllAdmins
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post('/login', createAdminOTPController);
adminRouter.post('/verify-otp', verifyAdminOTPController);

adminRouter.get('/', adminAuth, getAllAdmins);
adminRouter.put('/assign-role', adminAuth, assignRole);
adminRouter.put('/assign-permissions', adminAuth, assignPermissions);
adminRouter.put('/revoke-permissions', adminAuth, revokePermissions);

export default adminRouter;