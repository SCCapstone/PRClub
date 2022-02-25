export default interface Post {
  id: string;
  userId: string;
  username: string;
  workoutId: string;
  createdDate: string;
  caption: string;
  likedBy: string[];
  commentIds: string[];
  prId?: string;
  image?: string;
}
