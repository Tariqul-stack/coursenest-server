"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qa_controller_1 = require("../controllers/qa.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get('/', qa_controller_1.getPosts);
router.get('/:id', qa_controller_1.getPost);
router.post('/', auth_middleware_1.verifyToken, qa_controller_1.createPost);
router.delete('/:id', auth_middleware_1.verifyToken, qa_controller_1.deletePost);
router.post('/:id/answers', auth_middleware_1.verifyToken, qa_controller_1.createAnswer);
router.patch('/:id/answers/:answerId/accept', auth_middleware_1.verifyToken, qa_controller_1.acceptAnswer);
router.delete('/:id/answers/:answerId', auth_middleware_1.verifyToken, qa_controller_1.deleteAnswer);
exports.default = router;
