import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, View } from 'react-native';
import {
  ActivityIndicator, Snackbar, Text,
} from 'react-native-paper';
import tw from 'twrnc';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import User from '../models/firestore/User';
import {
  clearUploadProfileImageResult, clearFollowResult, clearUnfollowResult, clearUpdateProfileResult,
} from '../state/userSlice';
import {
  selectUploadProfileImageResult,
  selectCurrentUser, selectCurrentUserStatus, selectFollowResult,
  selectUnfollowResult, selectUpdateProfileResult,
} from '../state/userSlice/selectors';
import { clearUpsertPostResult } from '../state/postsSlice';
import { selectUpsertPostResult } from '../state/postsSlice/selectors';
import { clearUpsertPRResult } from '../state/prsSlice';
import { selectUpsertPRResult } from '../state/prsSlice/selectors';
import { clearUpsertWorkoutResult } from '../state/workoutsSlice';
import { selectUpsertWorkoutResult } from '../state/workoutsSlice/selectors';
import AuthStack from './stacks/auth';
import MainStack from './stacks/main';
import ChatScreen from './stacks/chat/screens/ChatScreen';
import ChatStack from './stacks/chat';

const Stack = createStackNavigator();

export default function Navigator() {
  const dispatch = useAppDispatch();

  const currentUser: User | null = useAppSelector(selectCurrentUser);
  const upsertWorkoutResult = useAppSelector(selectUpsertWorkoutResult);
  const currentUserStatus = useAppSelector(selectCurrentUserStatus);
  const followResult = useAppSelector(selectFollowResult);
  const unfollowResult = useAppSelector(selectUnfollowResult);
  const updateProfileResult = useAppSelector(selectUpdateProfileResult);
  const upsertPostResult = useAppSelector(selectUpsertPostResult);
  const upsertPRResult = useAppSelector(selectUpsertPRResult);
  const uploadProfileImageResult = useAppSelector(selectUploadProfileImageResult);

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
              component={ChatStack}
            />
          )
          : (
            <Stack.Screen
              name="Auth"
              component={AuthStack}
            />
          )}
      </Stack.Navigator>
      {/* central location for snackbars */}
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
                    visible={!!updateProfileResult || !!uploadProfileImageResult}
                    duration={3000}
                    onDismiss={() => {
                      dispatch(clearUpdateProfileResult());
                      dispatch(clearUploadProfileImageResult());
                    }}
                    action={{
                      label: 'Dismiss',
                      onPress: () => {
                        dispatch(clearUpdateProfileResult());
                        dispatch(clearUploadProfileImageResult());
                      },
                    }}
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
                    action={{
                      label: 'Dismiss',
                      onPress: () => dispatch(clearUpsertWorkoutResult()),
                    }}
                  >
                    {upsertWorkoutResult && (
                      upsertWorkoutResult.success
                        ? 'Saved workout!'
                        : `Error saving workout: ${upsertWorkoutResult.error}`
                    )}
                  </Snackbar>
                </>
              )
            }
            {
              upsertPRResult
              && upsertPRResult.numberPRsUpserted
              && upsertPRResult.numberPRsUpserted > 0
                ? (
                  <>
                    <Snackbar
                      visible={!!upsertPRResult && upsertPRResult.success}
                      duration={3000}
                      onDismiss={() => dispatch(clearUpsertPRResult())}
                      action={{
                        label: 'Dismiss',
                        onPress: () => dispatch(clearUpsertPRResult()),
                      }}
                    >
                      {`Just earned ${upsertPRResult.numberPRsUpserted} PR${upsertPRResult.numberPRsUpserted > 1 ? 's' : ''}!`}
                    </Snackbar>
                  </>
                )
                : <></>
            }
            {
              followResult
              && (
                <>
                  <Snackbar
                    visible={!!followResult && followResult.success}
                    duration={3000}
                    onDismiss={() => dispatch(clearFollowResult())}
                    action={{
                      label: 'Dismiss',
                      onPress: () => dispatch(clearFollowResult()),
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
                    action={{
                      label: 'Dismiss',
                      onPress: () => dispatch(clearFollowResult()),
                    }}
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
                      label: 'Dismiss',
                      onPress: () => dispatch(clearUnfollowResult()),
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
                    action={{
                      label: 'Dismiss',
                      onPress: () => dispatch(clearUnfollowResult()),
                    }}
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
                      label: 'Dismiss',
                      onPress: () => dispatch(clearUpsertPostResult()),
                    } : undefined}
                  >
                    {upsertPostResult && (
                      upsertPostResult.success
                        ? 'Post submitted!'
                        : `Error submitting post: ${upsertPostResult.error}`
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
