import { Request, Response } from 'express';

import sendResponse from '../../../shared/sendResponse';

import { Message } from '@prisma/client';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { MessageFilterableFields } from './message.contant';
import { MessageServices } from './message.service';

const insertDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await MessageServices.insertDB(data);

  // console.log('message created');

  sendResponse<Message>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Successfully created Service',
    data: result,
  });
});

const getAllDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, MessageFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  // console.log(filters,"filters from controller",options);
  const result = await MessageServices.getAllDb(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message all fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getUserMessage = catchAsync(async (req: Request, res: Response) => {
  const senderId = req.query.receiverId as string;
  const receiverId = req.query.senderId as string;
  // console.log(filters,"filters from controller",options);
  const result = await MessageServices.getUserMessageDB(senderId, receiverId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Usser Message all fetched successfully',
    data: result,
  });
});

const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await MessageServices.getSingleData(id);

  sendResponse<Message>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Successfully get `,
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MessageServices.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MessageServices.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category delete successfully',
    data: result,
  });
});
export const MessageController = {
  insertDB,
  getAllDb,
  getSingleDataById,
  updateOneInDB,
  deleteByIdFromDB,
  getUserMessage,
};
