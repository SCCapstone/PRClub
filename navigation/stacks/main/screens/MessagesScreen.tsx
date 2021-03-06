import {
  collection, doc, query, where,
} from '@firebase/firestore';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ActivityIndicator, Button, Text, TextInput,
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import tw from 'twrnc';
import BackButton from '../../../../components/BackButton';
import CenteredView from '../../../../components/CenteredView';
import Search from '../../../../components/Search';
import { CHATS_COLLECTION, MESSAGES_COLLECTION } from '../../../../constants/firestore';
import { useAppSelector } from '../../../../hooks/redux';
import Chat from '../../../../models/firestore/Chat';
import Message from '../../../../models/firestore/Message';
import User from '../../../../models/firestore/User';
import MessagesService from '../../../../services/MessagesService';
import UsersService from '../../../../services/UsersService';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';
import { sortByDate } from '../../../../utils/arrays';
import { colors } from '../../../../constants/styles';
import { toHumanReadableDate } from '../../../../utils/dates';
/**
 * This child component displays the name of the recipient and the last message sent in the chat
 * @param chatId the id of the specified chat
 * @param onChatPress function that executes when the specified chat is clicked
 * @returns a preview of a specified chat
 */
function ChatPreview({
  chatId,
  onChatPress,
}: { chatId: string, onChatPress: (chat: Chat) => void }) {
  const currentUser = useAppSelector(selectCurrentUser);

  const firestore = useFirestore();
  const chatDoc = doc(firestore, CHATS_COLLECTION, chatId);
  const {
    status: chatStatus,
    data: chatData,
  } = useFirestoreDocData(chatDoc);
  const chat = chatData as Chat;

  const chatMessages = chatStatus === 'success' ? chat.messageIds : [];
  const [otherChatUsername, setOtherChatUsername] = useState<string | null>(null);

  const chatUsers = chatStatus === 'success' ? chat.userIds : [];
  if (currentUser && chatUsers.length > 0) {
    UsersService
      .fetchUser(chatUsers.filter((c) => c !== currentUser.id)[0])
      .then((user) => setOtherChatUsername(user?.username || 'User not found'));
  }

  return (
    <>
      {
        chatStatus === 'loading' || !otherChatUsername
          ? <ActivityIndicator />
          : (
            <TouchableOpacity
              style={tw`p-2 border-b`}
              onPress={() => onChatPress(chat)}
            >
              <Text style={tw`font-bold text-lg`}>
                {`@${otherChatUsername}`}
              </Text>
              <Text style={chatMessages.length > 0 ? {} : tw`italic`}>
                {
                  chat.lastMessage
                    ? (
                      `${chat.lastMessage.date.split('T')[0]}: ${chat.lastMessage.text}`
                    )
                    : 'No messages'
                }
              </Text>
            </TouchableOpacity>
          )
      }
    </>
  );
}
/**
 * This child component displays a message as a received messaged (gray colored)
 * @param message The text of a given message
 * @param date the time the message was received
 * @returns a message
 */
function MessageReceived({ message, date }: { message: string, date: string}) {
  const { gray1 } = colors;
  return (
    <View>
      <View style={tw`bg-[${gray1}] m-2 p-4 max-w-xs mr-auto rounded-md`}>
        <Text>{message}</Text>
      </View>
      <View style={tw`m-1`}>
        <Text style={tw`text-gray-500`}>{toHumanReadableDate(date)}</Text>
      </View>

    </View>
  );
}
/**
 * This child component displays a message as a sent messaged (blue colored)
 * @param message The text of a given message
 * @param date the time the message was sent
 * @returns a message
 */
function MessageSent({ message, date }: { message: string, date:string }) {
  const { lightBlue } = colors;
  return (
    <View>
      <View style={tw`bg-[${lightBlue}] m-2 p-4 max-w-xs ml-auto rounded-md`}>
        <Text style={tw`text-white`}>{message}</Text>
      </View>
      <View style={tw`m-1 ml-auto`}>
        <Text style={tw`text-gray-500`}>{toHumanReadableDate(date)}</Text>
      </View>
    </View>
  );
}
/**
 * This child component displays all messages of a specified chat
 * @param chatId the id of the specified chat
 * @returns messages
 */
function ChatView({ chatId }: { chatId: string }) {
  const currentUser = useAppSelector(selectCurrentUser);

  const firestore = useFirestore();

  const chatDoc = doc(firestore, CHATS_COLLECTION, chatId);
  const {
    status: chatStatus,
    data: chatData,
  } = useFirestoreDocData(chatDoc);
  const chat = chatData as Chat;

  const messagesCollection = collection(firestore, MESSAGES_COLLECTION);
  const {
    status: messagesStatus,
    data: allMessagesData,
  } = useFirestoreCollectionData(messagesCollection);
  const allMessages = allMessagesData as Message[];
  const messages = !!chat && !!allMessages
    ? allMessages.filter((m) => chat.messageIds.map((i) => i.messageId).includes(m.id))
    : [];

  const [messageText, setMessageText] = useState<string>('');

  if (chatStatus === 'loading' || messagesStatus === 'loading') {
    return <ActivityIndicator />;
  }

  if (currentUser && chatStatus === 'success' && messagesStatus === 'success') {
    return (
      <>
        <TextInput
          onChangeText={(text) => setMessageText(text)}
          placeholder="enter a message..."
          value={messageText}
          right={(
            <TextInput.Icon
              name="send"
              onPress={() => {
                MessagesService.sendMessage(chatId, currentUser.id, messageText)
                  .then(() => setMessageText(''));
              }}
              disabled={messageText === ''}
            />
          )}
        />
        {
          messages.length === 0
            ? (
              <CenteredView>
                <Text style={tw`text-lg text-center`}>No messages!</Text>
              </CenteredView>
            )
            : (
              <ScrollView>
                {
                  sortByDate(messages, (m) => m.date, true).map((m) => (
                    m.userId === currentUser.id
                      ? (
                        <View key={m.id}>
                          <MessageSent message={m.text} date={m.date} />
                          {
                            m.isLiked ? (
                              <View style={tw`items-end pl-10 pb-5`}>
                                <Ionicons name="heart" size={16} color="red" />
                              </View>
                            ) : <></>
                          }
                        </View>
                      )
                      : (
                        <View key={m.id}>
                          <TouchableOpacity
                            onPress={async () => {
                              if (m.isLiked) {
                                await MessagesService.unlikeMessage(m.id);
                              } else {
                                await MessagesService.likeMessage(m.id);
                              }
                            }}
                          >
                            <MessageReceived message={m.text} date={m.date} />
                          </TouchableOpacity>
                          {
                            m.isLiked ? (
                              <View style={tw`items-start pr-10 pb-5`}>
                                <Ionicons name="heart" size={16} color="red" />
                              </View>
                            ) : <></>
                          }
                        </View>
                      )
                  ))
                }
              </ScrollView>
            )
        }
      </>
    );
  }

  return <></>;
}
/**
 * This component displays all chats associated with the currently logged in user
 * Also provides functionality for searching for users & creating new chats with them
 * @returns all chats and create new chat button
 */
export default function MessagesScreen() {
  const currentUser = useAppSelector(selectCurrentUser);

  const firestore = useFirestore();
  const chatsCollection = collection(firestore, CHATS_COLLECTION);
  const chatsQuery = query(
    chatsCollection,
    where('userIds', 'array-contains', currentUser?.id || ''),
  );
  const {
    status: chatsStatus,
    data: chatsData,
  } = useFirestoreCollectionData(chatsQuery);
  const chats = chatsData as Chat[];

  const [searchingForUsers, setSearchingForUsers] = useState<boolean>(false);
  const [chatBeingViewed, setChatBeingViewed] = useState<Chat | null>(null);
  const [otherChatUsername, setOtherChatUsername] = useState<string | null>(null);
  const { black } = colors;
  if (!!currentUser && searchingForUsers) {
    return (
      <>
        <BackButton onPress={() => setSearchingForUsers(false)} />
        <Search
          onUserPress={(user: User) => {
            MessagesService.createChat(currentUser.id, user.id)
              .then(() => {
                setSearchingForUsers(false);
              });
          }}
          filterBy={(u: User) => !chats.flatMap((c) => c.userIds).includes(u.id)}
        />
      </>
    );
  }

  if (!!currentUser && !!chatBeingViewed) {
    UsersService
      .fetchUser(chatBeingViewed.userIds.filter((c) => c !== currentUser.id)[0])
      .then((user) => setOtherChatUsername(user?.username || 'Error retriving user!.'));

    return (
      <>
        <View style={tw`flex flex-row`}>
          <View style={tw`flex flex-1`}>
            {/* <Button
              mode="contained"
              onPress={() => {
                setOtherChatUsername(null);
                setChatBeingViewed(null);
              }}
            >
              <Ionicons name="arrow-back" size={16} color="white" />
            </Button> */}
            <BackButton onPress={() => {
              setOtherChatUsername(null);
              setChatBeingViewed(null);
            }}
            />
          </View>
          <View style={tw`flex flex-3`}>
            {
              !otherChatUsername
                ? <ActivityIndicator />
                : <Text style={tw`text-xl text-center font-bold`}>{`@${otherChatUsername}`}</Text>
            }
          </View>
          <View style={tw`flex flex-1`} />
        </View>
        <ChatView chatId={chatBeingViewed.id} />
      </>
    );
  }

  if (currentUser) {
    return (
      <>
        <Button
          mode="contained"
          icon={() => <Ionicons name="create" size={16} color="white" />}
          onPress={() => setSearchingForUsers(true)}
          color={black}
        >
          Start New Chat
        </Button>
        {
          chatsStatus === 'loading'
            ? <ActivityIndicator />
            : (
              chats.length > 0
                ? (
                  <ScrollView>
                    {chats
                      .filter((c) => !c.lastMessage)
                      .map((c) => (
                        <ChatPreview
                          key={c.id}
                          chatId={c.id}
                          onChatPress={(chat) => setChatBeingViewed(chat)}
                        />
                      ))}
                    {(sortByDate(
                      chats.filter((c) => c.lastMessage), (c) => c.lastMessage!.date,
                    )).map((c) => (
                      <ChatPreview
                        key={c.id}
                        chatId={c.id}
                        onChatPress={(chat) => setChatBeingViewed(chat)}
                      />
                    ))}
                  </ScrollView>
                )
                : (
                  <CenteredView>
                    <Text style={tw`text-lg text-center`}>No chats!</Text>
                  </CenteredView>
                )
            )
        }
      </>
    );
  }

  return <></>;
}
