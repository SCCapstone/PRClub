export default interface Chat {
  id: string;
  userIds: string[];
  messageIds: {date: string, messageId: string}[];
}
