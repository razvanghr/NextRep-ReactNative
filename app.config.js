require('dotenv').config();

export default {
  expo: {
    name: "NextRep",
    slug: "NextRep",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.nextrep.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.RAPIDAPI_KEY,
      apiHost: process.env.RAPIDAPI_HOST || "gym-fit.p.rapidapi.com",
    }
  }
}; 