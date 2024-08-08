"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const Users_controller_1 = require("./Users.controller");
const Users_validation_1 = require("./Users.validation");
const router = (0, express_1.Router)();
router.get('/profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), Users_controller_1.UsersController.userProfile);
router.get('/', 
// auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
Users_controller_1.UsersController.getAllUsers);
router.patch('/update', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(Users_validation_1.UsersValidation.updateProfile), Users_controller_1.UsersController.updateProfile);
router.put('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(Users_validation_1.UsersValidation.updateProfile), Users_controller_1.UsersController.updateUser);
router.post('/create-admin', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(Users_validation_1.UsersValidation.createAdmin), Users_controller_1.UsersController.createAdmin);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), Users_controller_1.UsersController.deleteByIdFromDB);
router.get('/:id', 
// auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
Users_controller_1.UsersController.getSingleDataById);
router.patch('/add-points/:id', 
// auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
(0, validateRequest_1.default)(Users_validation_1.UsersValidation.updatePoints), Users_controller_1.UsersController.addPoints);
router.patch('/decrement-points/:id', 
// auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
(0, validateRequest_1.default)(Users_validation_1.UsersValidation.updatePoints), Users_controller_1.UsersController.decrementPoints);
exports.userRoutes = router;
