import {
  arrayUnion, doc, setDoc, updateDoc,
} from '@firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { CHATS_COLLECTION, MESSAGES_COLLECTION } from '../constants/firestore';
import { firestore } from '../firebase-lib';
import Chat from '../models/firestore/Chat';
import Message from '../models/firestore/Message';

export default {
  /**
   * This function creates a new chat between two users
   * @param fromUserId id of the sender
   * @param toUserId id of the recipient
   */
  async createChat(fromUserId: string, toUserId: string): Promise<void> {
    const chat: Chat = {
      id: uuidv4(),
      userIds: [toUserId, fromUserId],
      messageIds: [],
    };

    await setDoc(doc(firestore, CHATS_COLLECTION, chat.id), chat);
  },
  /**
   * This function sends a message in a given chat
   * @param chatId id of the chat that the message is sent in
   * @param userId id of the sender
   * @param text the actual message
   */
  async sendMessage(chatId: string, userId: string, text: string): Promise<void> {
    const message: Message = {
      id: uuidv4(),
      userId,
      text,
      isLiked: false,
      date: new Date().toISOString(),
    };

    await updateDoc(doc(firestore, CHATS_COLLECTION, chatId), {
      messageIds: arrayUnion({
        date: message.date,
        messageId: message.id,
      }),
      lastMessage: message,
    });
    await setDoc(doc(firestore, MESSAGES_COLLECTION, message.id), message);
  },
  /**
   * This function likes a message
   * @param messageId id of the message
   */
  async likeMessage(messageId: string): Promise<void> {
    await updateDoc(doc(firestore, MESSAGES_COLLECTION, messageId), {
      isLiked: true,
    });
  },
  /**
   * This function removes a like from a message
   * @param messageId id of the message
   */
  async unlikeMessage(messageId: string): Promise<void> {
    await updateDoc(doc(firestore, MESSAGES_COLLECTION, messageId), {
      isLiked: false,
    });
  },
};
