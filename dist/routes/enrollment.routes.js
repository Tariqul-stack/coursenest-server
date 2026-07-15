"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enrollment_controller_1 = require("../controllers/enrollment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/certificate/:certificateId', enrollment_controller_1.getCertificate);
router.post('/', auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)('student', 'teacher', 'admin'), enrollment_controller_1.enrollCourse);
router.post('/paid', auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)('student', 'teacher', 'admin'), enrollment_controller_1.enrollPaidCourse);
router.get('/my', auth_middleware_1.verifyToken, enrollment_controller_1.getMyEnrollments);
router.patch('/:id/progress', auth_middleware_1.verifyToken, enrollment_controller_1.updateProgress);
router.get('/course/:courseId', auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)('teacher', 'admin'), enrollment_controller_1.getCourseEnrollments);
exports.default = router;
