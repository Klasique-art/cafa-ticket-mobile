const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 👇 make CSS support explicit
if (!config.resolver.sourceExts.includes("css")) {
    config.resolver.sourceExts.push("css");
}

module.exports = withNativeWind(config, {
    input: "./global.css",
});
