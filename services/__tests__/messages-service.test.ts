import {
  collection, doc, getDoc, getDocs, query, where,
} from '@firebase/firestore';
import { CHATS_COLLECTION, MESSAGES_COLLECTION } from '../../constants/firestore';
import { firestore } from '../../firebase-lib';
import Chat from '../../models/firestore/Chat';
import Message from '../../models/firestore/Message';
import MessagesService from '../MessagesService';

describe('MessagesService', () => {
  test('create a chat, send a message, and like/unlike a message', async () => {
    const bigDuckUserId = 'debKjhaRMGqYRMOUkhgwm0etsfgZ';
    const susManUserId = 'EEZkaBDz75E5OSSQV79JoRl8EjJ1';

    // create the chat between the two users
    await MessagesService.createChat(bigDuckUserId, susManUserId);

    // check if chat doc was created
    const chatQuery = query(
      collection(firestore, CHATS_COLLECTION),
      where('userIds', 'array-contains', bigDuckUserId),
    );
    const chatQueryResult = await getDocs(chatQuery);
    expect(chatQueryResult.size).toBe(1);

    // get the newly created chat id and chat reference
    const chat = chatQueryResult.docs[0].data() as Chat;
    const chatDoc = doc(firestore, CHATS_COLLECTION, chat.id);

    // send a message from one user to another
    await MessagesService.sendMessage(chat.id, bigDuckUserId, 'Yo');

    // ensure message was added to chat
    const chatWithMessage = (await getDoc(chatDoc)).data() as Chat;
    const { lastMessage } = chatWithMessage;
    expect(lastMessage).toBeDefined();
    expect(lastMessage!.userId).toBe(bigDuckUserId);
    expect(lastMessage!.text).toBe('Yo');

    // get other user to like message
    await MessagesService.likeMessage(lastMessage!.id);
    const messageDoc = doc(firestore, MESSAGES_COLLECTION, lastMessage!.id);
    const message = (await getDoc(messageDoc)).data() as Message;
    expect(message.isLiked).toBe(true);

    // get other user to unlike message
    await MessagesService.unlikeMessage(lastMessage!.id);
    const unlikedMessage = (await getDoc(messageDoc)).data() as Message;
    expect(unlikedMessage.isLiked).toBe(false);
  });
});
