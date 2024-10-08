"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageServices = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const message_contant_1 = require("./message.contant");
const insertDB = (messageData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(messageData, 'messageData');
    const result = yield prisma_1.default.message.create({
        data: messageData,
        include: {
            receiver: true,
            sender: true,
        },
    });
    return result;
});
const getUserMessageDB = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield prisma_1.default.message.findMany({
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
});
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
const getAllDb = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    console.log('🚀 ~ file: message.ts:124 ~ filters:', filters);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: message_contant_1.MessageSearchableField.map(field => ({
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
                if (message_contant_1.messageRelationalFields.includes(key)) {
                    console.log(message_contant_1.messageRelationalFields);
                    return {
                        [key]: filterData[key],
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key],
                        },
                    };
                }
            }),
        });
    }
    // console.log(andConditions[0].AND,"aaaa");
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.message.findMany({
        include: {
            receiver: true,
            sender: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.message.count({
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
});
const getSingleData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.message.findUnique({
        where: {
            id,
        },
        include: {
            receiver: true,
            sender: true,
        },
    });
    return result;
});
const updateOneInDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(id, 'annnnnd ', payload);
    const result = yield prisma_1.default.message.update({
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
});
const deleteByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.message.delete({
        where: {
            id,
        },
        include: {
            receiver: true,
            sender: true,
        },
    });
    return result;
});
exports.MessageServices = {
    insertDB,
    getAllDb,
    getSingleData,
    updateOneInDB,
    deleteByIdFromDB,
    getUserMessageDB,
};
