const { withNativeWind } = require("nativewind/metro");
const {
    getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// 👇 make CSS support explicit
if (!config.resolver.sourceExts.includes("css")) {
    config.resolver.sourceExts.push("css");
}

module.exports = withNativeWind(config, {
    input: "./global.css",
});