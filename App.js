import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import GetStream from "./src/components/GetStream";
export default function App() {
  return (
    <View style={styles.container}>
      <GetStream />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
