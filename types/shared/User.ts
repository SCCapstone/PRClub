export default interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  followerIds: string[];
  followingIds: string[];
  workoutIds: string[];
  postIds: string[];
  prIds: string[];
}
