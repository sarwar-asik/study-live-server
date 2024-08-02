import { Message, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  messageRelationalFields,
  MessageSearchableField,
} from './message.contant';
import { IMessageFilterRequest } from './message.interface';

const insertDB = async (messageData: Partial<Message >): Promise<Message> => {
  const result = await prisma.message.create({
    data: messageData,
    include: {
      receiver: true,
      sender: true,
    },
  });

  return result;
};

const getUserMessageDB = async (senderId: string, receiverId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          AND: [{ senderId: senderId }, { receiverId: receiverId }],
        },
        {
          AND: [{ senderId: receiverId }, { receiverId: senderId }],
        },
      ],
    },
    include: {
      receiver: true,
      sender: true,
    },
  });

  return messages;
};

// const getAllDb = async (
//   filters: IServiceFilterRequest,
//   options: IPaginationOptions
// ): Promise<IGenericResponse<Service[]>> => {
//   // !for pagination
//   const { page, limit, skip } = paginationHelpers.calculatePagination(options);

//   //   ! for filters

//   const { searchTerm, ...filtersData } = filters;

//   const andConditions = [];

//   if (searchTerm) {
//     andConditions.push({
//       OR: ServiceSearchableField.map(field => ({
//         [field]: {
//           contains: searchTerm,
//           mode: 'insensitive'
//         },
//       })),
//     });
//   }

//   if (Object.keys(filtersData).length > 0) {
//     andConditions.push({
//         AND: Object.keys(filtersData).map((key) => {
//             if (serviceRelationalFields.includes(key)) {
//                 return {
//                     [serviceRelationalFieldsMapper[key]]: {
//                         id: (filtersData as any)[key]
//                     }
//                 };
//             } else {
//                 return {
//                     [key]: {
//                         equals: (filtersData as any)[key]
//                     }
//                 };
//             }
//         })
//     });
// }

//   // for andCondition for where

//   const whereCondition: Prisma.ServiceWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};

//   const result = await prisma.message.findMany({
//     include:{
//       category:true
//     },
//     where: whereCondition,
//     skip,
//     take: limit,

//     orderBy:
//       options.sortBy && options.sortOrder
//         ? {
//             [options.sortBy]: options.sortOrder,
//           }
//         : {
//             createdAt: 'desc',
//           },
//   });
//   const total = await prisma.message.count();
//   return {
//     meta: {
//       total,
//       page,
//       limit,
//     },
//     data: result,
//   };
// };

const getAllDb = async (
  filters: IMessageFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Message[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  console.log('🚀 ~ file: message.ts:124 ~ filters:', filters);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: MessageSearchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (messageRelationalFields.includes(key)) {
          console.log(messageRelationalFields);
          return {
            [key]: (filterData as any)[key],
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  // console.log(andConditions[0].AND,"aaaa");
  const whereConditions: Prisma.MessageWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.message.findMany({
    include: {
      receiver: true,
      sender: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.message.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleData = async (id: string): Promise<Message | null> => {
  const result = await prisma.message.findUnique({
    where: {
      id,
    },
    include: {
      receiver: true,
      sender: true,
    },
  });

  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Message | any>
): Promise<Message> => {
  // console.log(id, 'annnnnd ', payload);

  const result = await prisma.message.update({
    where: {
      id,
    },
    data: payload,
    include: {
      receiver: true,
      sender: true,
    },
  });

  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Message> => {
  const result = await prisma.message.delete({
    where: {
      id,
    },
    include: {
      receiver: true,
      sender: true,
    },
  });

  return result;
};

export const MessageServices = {
  insertDB,
  getAllDb,
  getSingleData,
  updateOneInDB,
  deleteByIdFromDB,
  getUserMessageDB,
};
