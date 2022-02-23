import React from 'react';
import { Text } from 'react-native-paper';
import PR from '../types/shared/PR';

// TODO implement full PRs component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PRs({ prs, forCurrentUser }: {prs: PR[], forCurrentUser: boolean}) {
  return (
    <>
      {prs.map((pr) => <Text key={pr.id}>{JSON.stringify(pr)}</Text>)}
    </>
  );
}
