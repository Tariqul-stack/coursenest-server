"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/course/:courseId', review_controller_1.getCourseReviews);
router.get('/my', auth_middleware_1.verifyToken, review_controller_1.getMyReviews);
router.post('/', auth_middleware_1.verifyToken, review_controller_1.createReview);
router.put('/:id', auth_middleware_1.verifyToken, review_controller_1.updateReview);
router.delete('/:id', auth_middleware_1.verifyToken, review_controller_1.deleteReview);
exports.default = router;
