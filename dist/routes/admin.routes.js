"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)('admin'));
router.get('/users', admin_controller_1.getAllUsers);
router.patch('/users/:id/role', admin_controller_1.changeUserRole);
router.delete('/users/:id', admin_controller_1.deleteUser);
exports.default = router;
