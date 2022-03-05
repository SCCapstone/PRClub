/* eslint-disable react/destructuring-assignment */
module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      '@babel/preset-typescript',
    ],
    plugins: [
      ['transform-inline-environment-variables', {
        include: [
          'NODE_ENV',
          'FIREBASE_API_KEY',
          'FIREBASE_AUTH_DOMAIN',
          'FIREBASE_PROJECT_ID',
          'FIREBASE_STORAGE_BUCKET',
          'FIREBASE_MESSAGING_SENDER_ID',
          'FIREBASE_APP_ID',
          'FIREBASE_MEASUREMENT_ID',
        ],
      }],
    ],
  };
};
