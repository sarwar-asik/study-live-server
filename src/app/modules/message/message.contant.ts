export const MessageSearchableField = ['receiverId', 'senderId'];

export const MessageFilterableFields = [
  'receiverId',
  'senderId',

  'searchTerm',

  'message',
];

export const messageRelationalFields: string[] = ['receiverId', 'senderId'];
export const messageRelationalFieldsMapper: { [key: string]: string } = {
  sender: 'users',
  receiver: 'users',
};
