export default interface ChatModel {
  lastMessage: string,
  members: { [key:string]: string, value: string }[],
  NO_ID_FIELD: string,
}
