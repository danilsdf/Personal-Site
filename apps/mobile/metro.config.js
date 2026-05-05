const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

// Packages that must always resolve from the app to avoid duplicate instances
const forcedModules = [
  'react',
  'react-native',
  'react-native-safe-area-context',
  '@react-navigation/native',
  '@react-navigation/bottom-tabs',
  '@react-navigation/native-stack',
  'react-native-screens',
];

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    resolveRequest: (context, moduleName, platform) => {
      if (forcedModules.some(m => moduleName === m || moduleName.startsWith(m + '/'))) {
        return context.resolveRequest(
          { ...context, originModulePath: path.resolve(projectRoot, 'index.js') },
          moduleName,
          platform,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
