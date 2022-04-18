import { doc, getDoc } from '@firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { POSTS_COLLECTION, USERS_COLLECTION } from '../../constants/firestore';
import { firestore } from '../../firebase-lib';
import Post from '../../models/firestore/Post';
import User from '../../models/firestore/User';
import PostsService from '../PostsService';

describe('PostsService', () => {
  test('upsert and remove a post', async () => {
    // user data from emulator
    const user = {
      id: '2jpUzlAk5wBDR9zzhwABBEiTaMRy',
      name: 'Em2',
    };

    // initializing mock post object
    const post: Post = {
      id: uuidv4(),
      userId: user.id,
      username: user.name,
      workoutId: uuidv4(),
      createdDate: new Date().toString(),
      caption: 'test',
      commentIds: [],
      likedByIds: [],
    };

    // references to post and user documents in firestore
    const postDoc = doc(firestore, POSTS_COLLECTION, post.id);
    const userDoc = doc(firestore, USERS_COLLECTION, post.userId);

    // attempt to put mock post object to firestore emulator
    await PostsService.upsertPost(post);

    // query firestore to check that post document exists
    const upsertedPostData = await getDoc(postDoc);
    const upsertedPost = upsertedPostData.data() as Post;

    // also check that postId got added to user array
    const userDataAfterUpsert = await getDoc(userDoc);
    const userAfterUpsert = userDataAfterUpsert.data() as User;
    expect(userAfterUpsert.postIds).toContain(post.id);

    // test to make sure it was successful
    expect(upsertedPost).toEqual(post);

    // then, test removing a post and ensure it got deleted in firestore
    await PostsService.removePost(post);
    const deletedPostData = await getDoc(postDoc);
    expect(deletedPostData.exists()).toBe(false);

    // also ensure post id got deleted in user's postIds array
    const userDataAfterDelete = await getDoc(userDoc);
    const userAfterDelete = userDataAfterDelete.data() as User;
    expect(userAfterDelete.postIds).not.toContain(post.id);
  });

  // test('like and unlike a post', async () => {
  //   // user data from emulator
  //   const postingUser = {
  //     id: 'UU5NXWiguC36dWBCYZEtlqpnLvFE',
  //     name: 'Emulator1',
  //   };
  //   const likingUser = {
  //     id: 'debKjhaRMGqYRMOUkhgwm0etsfgZ',
  //     name: 'BigDuck',
  //   };

  //   // initializing mock post object
  //   const post: Post = {
  //     id: uuidv4(),
  //     userId: postingUser.id,
  //     username: postingUser.name,
  //     workoutId: uuidv4(),
  //     createdDate: new Date().toString(),
  //     caption: 'test',
  //     commentIds: [],
  //     likedByIds: [],
  //   };

  //   // put mock post in emulator
  //   await PostsService.upsertPost(post);

  //   // attempt for likingUser to like this post
  //   await PostsService.likePost(post, likingUser.id);

  //   // ensure reference to post in firestore includes likingUser
  //   const postDoc = doc(firestore, POSTS_COLLECTION, post.id);
  //   const postDataAfterLiking = await getDoc(postDoc);
  //   const postAfterLiking = postDataAfterLiking.data() as Post;
  //   expect(postAfterLiking.likedByIds).toContain(likingUser.id);

  //   // ensure reference to likingUser in firestore includes post
  //   const userDoc = doc(firestore, USERS_COLLECTION, likingUser.id);
  //   const userDataAfterLiking = await getDoc(userDoc);
  //   const userAfterLiking = userDataAfterLiking.data() as User;
  //   expect(userAfterLiking.likedPostIds).toContain(post.id);

  //   // attempt for likingUser to unlike this post
  //   await PostsService.unlikePost(post, likingUser.id);

  //   // ensure reference to post in firestore does not include likingUser
  //   const postDataAfterUnliking = await getDoc(postDoc);
  //   const postAfterUnliking = postDataAfterUnliking.data() as Post;
  //   expect(postAfterUnliking.likedByIds).not.toContain(likingUser.id);

  //   // ensure reference to likingUser in firestore does not include post
  //   const userDataAfterUnliking = await getDoc(userDoc);
  //   const userAfterUnliking = userDataAfterUnliking.data() as User;
  //   expect(userAfterUnliking.likedPostIds).not.toContain(post.id);

  //   // remove testing post
  //   await PostsService.removePost(post);
  // });
    test('like and unlike a post', async () => {
      
    }
});
