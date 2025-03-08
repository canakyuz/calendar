module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated için
      'react-native-reanimated/plugin',
    ],
  };
}; 