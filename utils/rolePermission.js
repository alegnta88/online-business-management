export const rolePermissions = {
  admin: [
    "CAN_MANAGE_USERS",
    "CAN_ASSIGN_ROLES",
    "CAN_VIEW_PRODUCTS",
    "CAN_EDIT_PRODUCTS",
    "CAN_APPROVE_ORDERS",
    "CAN_VIEW_ORDERS",
  ],
  user: [
    "CAN_VIEW_PRODUCTS",
    "CAN_ADD_PRODUCTS",
  ],
  customer: [
    "CAN_VIEW_PRODUCTS",
    "CAN_CREATE_ORDERS",
  ],
};