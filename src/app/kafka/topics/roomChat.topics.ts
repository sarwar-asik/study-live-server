export const ROOM_CHAT_TOPICS = {
  ROOM_JOIN: 'room-join',
  ROOM_LEAVE: 'room-leave',
  WEBRTC_OFFER: 'webrtc-offer',
  WEBRTC_ANSWER: 'webrtc-answer',
  ICE_CANDIDATE: 'ice-candidate',
} as const;

export type RoomChatTopics = typeof ROOM_CHAT_TOPICS[keyof typeof ROOM_CHAT_TOPICS];
