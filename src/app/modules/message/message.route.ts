/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { MessageController } from './message.controller';
import { MessageValidation } from './message.validation';
const router = Router();

router.post(
  '/',
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(MessageValidation.createMessage),
  MessageController.insertDB
);

router.get('/', MessageController.getAllDb);
router.get('/:id', MessageController.getSingleDataById);

router.patch(
  '/:id',
  validateRequest(MessageValidation.updateMessage),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  MessageController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  MessageController.deleteByIdFromDB
);

export const MessageRoutes = router;
