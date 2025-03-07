"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const multer_1 = __importDefault(require("../../middlewares/multer/multer"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Auth_controller_1 = require("./Auth.controller");
const Auth_validation_1 = require("./Auth.validation");
const router = (0, express_1.Router)();
router.post('/sign-up', multer_1.default.single('image'), 
// validateRequest(AuthValidation.signUp),
Auth_controller_1.AuthController.SignUp);
router.post('/login', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.loginUser), Auth_controller_1.AuthController.login);
router.patch('/change-password', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.changePassword), Auth_controller_1.AuthController.changePassword);
router.post('/forgot-password', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.forgotPassword), Auth_controller_1.AuthController.forgotPassword);
router.post('/reset-password', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.resetPassword), Auth_controller_1.AuthController.resetPassword);
router.post('/refresh-token', (0, validateRequest_1.default)(Auth_validation_1.AuthValidation.refreshTokenZodSchema), Auth_controller_1.AuthController.refreshToken);
exports.authRoutes = router;
