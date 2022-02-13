import { PayloadAction } from '@reduxjs/toolkit';
import { all, call, takeLatest } from 'redux-saga/effects';
import { removePostByEntity, upsertPost } from '.';
import PostsService from '../../services/PostsService';
import Post from '../../types/shared/Post';

function* upsertPostHandler(action: PayloadAction<Post>) {
  yield call(PostsService.upsertPost, action.payload);
}

function* removePostHandler(action: PayloadAction<Post>) {
  yield call(PostsService.removePost, action.payload);
}

export default function* postsSaga() {
  yield all([
    takeLatest(upsertPost.type, upsertPostHandler),
    takeLatest(removePostByEntity.type, removePostHandler),
  ]);
}
