import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const VideoStream = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: "http://192.168.1.2:5000/video_feed" }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  webview: {
    flex: 1
  }
});

export default VideoStream;
