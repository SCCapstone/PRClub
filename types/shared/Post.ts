export default interface Post {
  id: string;
  userId: string;
  username: string;
  kind: 'workout' | 'pr';
  workoutId?: string;
  prId?: string;
  createdDate: string;
  caption: string;
}
