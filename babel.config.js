/* eslint-disable react/destructuring-assignment */
module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      '@babel/preset-typescript',
    ],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      }],
    ],
  };
};
