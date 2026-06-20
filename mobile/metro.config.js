const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.watchFolders = [projectRoot];
config.resolver.blockList = [
  new RegExp(path.resolve(projectRoot, '..', 'backend') + '/.*'),
  new RegExp(path.resolve(projectRoot, '..', 'web') + '/.*'),
];

module.exports = config;
