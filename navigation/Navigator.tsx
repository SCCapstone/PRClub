import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { ActivityIndicator, Snackbar, Text } from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { clearFollowResult, clearUnfollowResult } from '../state/userSlice';
import {
  selectCurrentUser, selectCurrentUserStatus, selectFollowResult, selectUnfollowResult,
} from '../state/userSlice/selectors';
import { followUser, unfollowUser } from '../state/userSlice/thunks';
import { selectUpsertWorkoutResult } from '../state/workoutsSlice/selectors';
import { clearUpsertWorkoutResult } from '../state/workoutsSlice';
import { removeWorkout } from '../state/workoutsSlice/thunks';
import User from '../types/shared/User';
import Workout from '../types/shared/Workout';
import Post from '../types/shared/Post';
import AuthStack from './stacks/auth';
import MainStack from './stacks/main';
import { selectUpdateProfileResult } from '../state/userSlice/selectors';
import { clearUpdateProfileResult } from '../state/userSlice';
import { selectUpsertPostResult } from '../state/postsSlice/selectors';
import { clearUpsertPostResult } from '../state/postsSlice';
import { removePost } from '../state/postsSlice/thunks';


const Stack = createStackNavigator();

export default function Navigator() {
  const dispatch = useAppDispatch();

  const currentUser: User | null = useAppSelector(selectCurrentUser);
  const upsertWorkoutResult = useAppSelector(selectUpsertWorkoutResult);
  const currentUserStatus = useAppSelector(selectCurrentUserStatus);
  const followResult = useAppSelector(selectFollowResult);
  const unfollowResult = useAppSelector(selectUnfollowResult);
  const [submittedWorkout, setSubmittedWorkout] = useState<Workout | null>(null);
  const updateProfileResult = useAppSelector(selectUpdateProfileResult);
  const upsertPostResult = useAppSelector(selectUpsertPostResult);
  const [submittedPost, setSubmittedPost] = useState<Post | null>(null);


  if (currentUserStatus === 'fetching') {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {currentUser
          ? (
            <Stack.Screen
              name="Main"
              component={MainStack}
            />
          )
          : (
            <Stack.Screen
              name="Auth"
              component={AuthStack}
            />
          )}
      </Stack.Navigator>
      {
        currentUser
        && (
          <View
            style={{
              position: 'absolute',
              top: 0.75 * Dimensions.get('window').height,
              height: 0.175 * Dimensions.get('window').height,
              left: 0.025 * Dimensions.get('window').width,
              width: 0.95 * Dimensions.get('window').width,
            }}
          >
            {
              updateProfileResult
              && (
                <>
                  <Snackbar
                    visible={!!updateProfileResult}
                    duration={3000}
                    onDismiss={() => dispatch(clearUpdateProfileResult())}
                    style={updateProfileResult && updateProfileResult.error ? tw`bg-red-500` : {}}
                  >
                    {
                      updateProfileResult
                      && (
                        updateProfileResult.error
                          ? `Error updating profile: ${updateProfileResult.error.message}`
                          : 'Profile updated successfully!'
                      )
                    }
                  </Snackbar>
                </>
              )
            }
            {
              upsertWorkoutResult
              && (
                <>
                  <Snackbar
                    visible={!!upsertWorkoutResult}
                    duration={3000}
                    onDismiss={() => dispatch(clearUpsertWorkoutResult())}
                    action={upsertWorkoutResult && upsertWorkoutResult.success ? {
                      label: 'Done',
                      // label: 'Undo',
                      onPress: () => {
                        /*if (submittedWorkout) {
                          dispatch(removeWorkout(submittedWorkout));
                          setSubmittedWorkout(null);
                        }*/
                      },
                    } : undefined}
                  >
                    {upsertWorkoutResult && (
                      upsertWorkoutResult.success
                        ? 'Workout Submitted!'
                        : `Error submitting workout: ${upsertWorkoutResult.error}`
                    )}
                  </Snackbar>
                </>
              )
            }
            {
              followResult
              && (
                <>
                  <Snackbar
                    visible={!!followResult && followResult.success}
                    duration={3000}
                    onDismiss={() => {
                      dispatch(clearFollowResult());
                    }}
                    action={{
                      label: 'Undo',
                      onPress() {
                        dispatch(unfollowUser(followResult.user?.id || ''));
                      },
                    }}
                  >
                    <Text style={tw`text-white`}>
                      Successfully followed
                      {' '}
                      <Text style={tw`text-white font-bold`}>
                        {`@${followResult.user?.username}`}
                      </Text>
                      .
                    </Text>
                  </Snackbar>
                  <Snackbar
                    visible={!!followResult && !followResult.success}
                    duration={3000}
                    onDismiss={() => dispatch(clearFollowResult())}
                    style={tw`bg-red-500`}
                  >
                    {`Error following user: ${followResult.error?.message}`}
                  </Snackbar>
                </>
              )
            }
            {
              unfollowResult
              && (
                <>
                  <Snackbar
                    visible={!!unfollowResult && unfollowResult.success}
                    duration={3000}
                    onDismiss={() => dispatch(clearUnfollowResult())}
                    action={{
                      label: 'Undo',
                      onPress() {
                        dispatch(followUser(unfollowResult.user?.id || ''));
                      },
                    }}
                  >
                    <Text style={tw`text-white`}>
                      Successfully unfollowed
                      {' '}
                      <Text style={tw`text-white font-bold`}>
                        {`@${unfollowResult.user?.username}`}
                      </Text>
                      .
                    </Text>
                  </Snackbar>
                  <Snackbar
                    visible={!!unfollowResult && !unfollowResult.success}
                    duration={3000}
                    onDismiss={() => dispatch(clearUnfollowResult())}
                    style={tw`bg-red-500`}
                  >
                    {`Error unfollowing user: ${unfollowResult.error?.message}`}
                  </Snackbar>
                </>
              )
            }
            {
              upsertPostResult
              && (
                <>
                  <Snackbar
                    visible={!!upsertPostResult}
                    duration={3000}
                    onDismiss={() => dispatch(clearUpsertPostResult())}
                    action={upsertPostResult && upsertPostResult.success ? {
                      label: 'Done',
                      // label: 'Undo',
                      onPress: () => {
                        /*if (submittedPost) {
                          dispatch(removePost(submittedPost));
                          setSubmittedPost(null);
                        }*/
                      },
                    } : undefined}
                  >
                    {upsertPostResult && (
                      upsertPostResult.success
                        ? 'Workout Submitted!'
                        : `Error submitting workout: ${upsertPostResult.error}`
                    )}
                  </Snackbar>
                </>
              )
            }
          </View>
        )
      }
    </>
  );
}
