import React from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

type Props = {
  onFinish: () => void;
};

export function Splash({ onFinish }: Props) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/images/splash.json")}
        autoPlay
        loop={false}
        onAnimationFinish={onFinish}
        style={{ width: 250, height: 250 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EA1D2C",
    justifyContent: "center",
    alignItems: "center",
  },
});
