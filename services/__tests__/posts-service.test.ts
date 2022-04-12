import PostsService from '../PostsService';
import { doc, getDoc } from "@firebase/firestore";
import { firestore } from "../../firebase-lib";
import Post from "../../models/firestore/Post";
import User from "../../models/firestore/User";
import { POSTS_COLLECTION, USERS_COLLECTION } from "../../constants/firestore"
import { v4 as uuidv4 } from "uuid";

describe('PostsService', () => {
    test('upsert and remove a post', async () => {
        const post: Post = {
            id: uuidv4(),
            userId: "2jpUzlAk5wBDR9zzhwABBEiTaMRy",
            username: "Em2",
            workoutId: uuidv4(),
            createdDate: new Date().toString(),
            caption: "test",
            commentIds: [],
            likedByIds: [],
        } 

        const postDoc = doc(firestore, POSTS_COLLECTION, post.id)
        const userDoc = doc(firestore, USERS_COLLECTION, post.userId)

        await PostsService.upsertPost(post);

        const upsertedPostData = await getDoc(postDoc)
        const upsertedPost = upsertedPostData.data() as Post

        // also check that workoutId got added to user array
        const userDataAfterUpsert = await getDoc(userDoc)
        const userAfterUpsert = userDataAfterUpsert.data() as User
        expect(userAfterUpsert.postIds).toContain(post.id)

        // test to make sure it was successful
        expect(upsertedPost).toEqual(post)

        // then, test removing a workout and ensure it got deleted in firestore
        await PostsService.removePost(post)
        const deletedPostData = await getDoc(postDoc)
        expect(deletedPostData.exists()).toBe(false)

        // also ensure workout id got deleted in user's workoutIds array
        const userDataAfterDelete = await getDoc(userDoc)
        const userAfterDelete = userDataAfterDelete.data() as User
        expect(userAfterDelete.postIds).not.toContain(post.id)
    });
    // test('like and unlike a post', async () => {

    //     const result = await PostsService.addComment();
    //     expect(result);
    // });
});