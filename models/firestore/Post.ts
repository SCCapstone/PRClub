export default interface Post {
  id: string;
  userId: string;
  username: string;
  workoutId: string;
  createdDate: string;
  caption: string;
  commentIds: string[];
  likedByIds: string[];
  prId?: string;
  image?: string;
}
