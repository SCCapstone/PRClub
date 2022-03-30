export default interface Chat {
  lastMessage: string,
  members: { [key:string]: string, value: boolean }[];
}
