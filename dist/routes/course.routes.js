"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', course_controller_1.getCourses);
router.get('/my-courses', auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)('teacher', 'admin'), course_controller_1.getMyCourses);
router.get('/:id', course_controller_1.getCourse);
router.post('/', auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)('teacher', 'admin'), course_controller_1.createCourse);
router.put('/:id', auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)('teacher', 'admin'), course_controller_1.updateCourse);
router.delete('/:id', auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)('teacher', 'admin'), course_controller_1.deleteCourse);
router.patch('/:id/status', auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)('teacher', 'admin'), course_controller_1.toggleStatus);
exports.default = router;
