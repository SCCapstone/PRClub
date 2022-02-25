export default interface Post {
  id: string;
  userId: string;
  username: string;
  workoutId: string;
  createdDate: string;
  caption: string;
  comments: number;
  commentIds: string[];
  likes: number;
  likedByIds: string[];
  prId?: string;
  image?: string;
}
