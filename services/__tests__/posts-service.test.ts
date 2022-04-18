import { doc, getDoc } from '@firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { COMMENTS_COLLECTION, POSTS_COLLECTION, USERS_COLLECTION } from '../../constants/firestore';
import { firestore } from '../../firebase-lib';
import Post from '../../models/firestore/Post';
import User from '../../models/firestore/User';
import Comment from '../../models/firestore/Comment';
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

  test('comment and uncomment on a post', async () => {
    // user data from emulator
    const postingUser = {
      id: 'UU5NXWiguC36dWBCYZEtlqpnLvFE',
      name: 'Emulator1',
    };
    const commentingUser = {
      id: 'debKjhaRMGqYRMOUkhgwm0etsfgZ',
      name: 'BigDuck',
    };

    // initializing mock post object
    const post: Post = {
      id: uuidv4(),
      userId: postingUser.id,
      username: postingUser.name,
      workoutId: uuidv4(),
      createdDate: new Date().toString(),
      caption: 'test',
      commentIds: [],
      likedByIds: [],
    };

    const comment: Comment = {
      id: uuidv4(),
      userId: commentingUser.id,
      username: commentingUser.name,
      postId: post.id,
      body: 'Test Comment',
      date: Date.toString(),
    };

    // put mock post in emulator
    await PostsService.upsertPost(post);

    // attempt for commentingUser to comment on this post
    await PostsService.addComment(post, comment);

    // ensure reference to post in firestore includes commentingUser
    const postDoc = doc(firestore, POSTS_COLLECTION, post.id);
    const postDataAfterCommenting = await getDoc(postDoc);
    const postAfterCommenting = postDataAfterCommenting.data() as Post;
    expect(postAfterCommenting.commentIds).toContain(comment.id);

    // // ensure reference to commentingUser in firestore includes post
    // const userDoc = doc(firestore, USERS_COLLECTION, commentingUser.id);
    // const userDataAfterCommenting = await getDoc(userDoc);
    // const userAfterCommenting = userDataAfterCommenting.data() as User;
    // expect(userAfterCommenting.commentIds).toContain(comment.id);

    // ensure commment is in COMMENT_COLLECTION
    const commentDoc = doc(firestore, COMMENTS_COLLECTION, comment.id);
    const commentDataAfterCommenting = await getDoc(commentDoc);
    const commentAfterCommenting = commentDataAfterCommenting.data() as Comment;
    expect(commentAfterCommenting).not.toBeUndefined();

    // attempt for commentingUser to remove comment on this post
    await PostsService.removeComment(post, comment);

    // ensure reference to post in firestore does not include commentingUser
    const postDataAfterUncommenting = await getDoc(postDoc);
    const postAfterUncommenting = postDataAfterUncommenting.data() as Post;
    expect(postAfterUncommenting.likedByIds).not.toContain(commentingUser.id);

    // // ensure reference to commentingUser in firestore does not include post
    // const userDataAfterUncommenting = await getDoc(userDoc);
    // const userAfterUncommenting = userDataAfterUncommenting.data() as User;
    // expect(userAfterUncommenting.commentIds).not.toContain(post.id);

    // ensure commment is not in COMMENT_COLLECTION
    const commentDataAfterUncommenting = await getDoc(commentDoc);
    const commentAfterUncommenting = commentDataAfterUncommenting.data() as Comment;
    expect(commentAfterUncommenting).toBeUndefined();

    // remove testing post
    await PostsService.removePost(post);
  });
});
