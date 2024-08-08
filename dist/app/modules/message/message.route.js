"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = require("express");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const message_controller_1 = require("./message.controller");
const message_validation_1 = require("./message.validation");
const router = (0, express_1.Router)();
router.post('/', 
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
(0, validateRequest_1.default)(message_validation_1.MessageValidation.createMessage), message_controller_1.MessageController.insertDB);
router.get('/', message_controller_1.MessageController.getAllDb);
router.get('/user', message_controller_1.MessageController.getUserMessage);
router.get('/:id', message_controller_1.MessageController.getSingleDataById);
router.patch('/:id', (0, validateRequest_1.default)(message_validation_1.MessageValidation.updateMessage), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), message_controller_1.MessageController.updateOneInDB);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), message_controller_1.MessageController.deleteByIdFromDB);
exports.MessageRoutes = router;
