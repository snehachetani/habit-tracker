const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
console.log('Source Exts:', config.resolver.sourceExts);
