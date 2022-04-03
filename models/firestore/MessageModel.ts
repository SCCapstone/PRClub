export default interface MessageModel {
  NO_ID_FIELD: string,
  from: string,
  message: string,
  timestamp: number,
  likedBy: { [key:string]: string, value: string }[]
}
