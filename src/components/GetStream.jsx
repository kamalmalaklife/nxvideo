import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Platform,
} from "react-native";

import { Video } from "expo-av";

import md5 from "md5";
import { btoa, atob } from "react-native-quick-base64";
const GetStream = () => {
  urlFetcher = {
    folder: "/hls/",
    extension: ".m3u8?hi&auth=",
  };

  // webm files work on Android at the moment,
  // this manipulates the generated URL to be webm incase we are running
  // On Android
  if (Platform.OS == "android") {
    urlFetcher.folder = "/media/";
    urlFetcher.extension = ".webm?resolution=1080p&auth=";
  }
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  const authKey = useRef(null);

  //const [authKey, setauthKey] = useState();
  const [cameraURL, setcameraURL] = useState(null);
  //const server = "local"
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState();

  // switching between where to send auth requests | create a toggle button later
  const server = 1 == 2 ? "remote" : "local";
  const username =
    server == "remote" ? "cloud@user.name" : "LocalHttpNxUsername";
  const password =
    server == "remote" ? "cloudPassword" : "LocalHttpNxServerPassword";
  const cameraId = "1f01f97e-86fe-d6c6-ef17-89f5a7c3fe74";
  const systemId = "2fb88d01-767b-4ac0-8d1c-7a00aea69e6e";
  const serverCloudAddress = "https://" + systemId + ".relay.vmsproxy.com";
  const serverLocalAddress = "https://nxcloud.mplus.co.il";
  const serverAddress =
    server == "local" ? serverLocalAddress : serverCloudAddress;

  const calculateHash = (realm, nonce) => {
    const digest = md5(username + ":" + realm + ":" + password);
    const partial_ha2 = md5("GET" + ":");
    const simplified_ha2 = md5(digest + ":" + nonce + ":" + partial_ha2);

    authKey.current = btoa(username + ":" + nonce + ":" + simplified_ha2);
    setcameraURL(
      serverAddress +
        urlFetcher.folder +
        cameraId +
        urlFetcher.extension +
        authKey.current,
    );
  };
  const playHandler = () => {
    video.current.isPlaying
      ? video.current.pauseAsync()
      : video.current.playAsync();
  };
  useEffect(() => {
    //if (Platform.os == "ios") {
    if (!status.isPlaying && Platform.OS != "android") {
      console.log(status);
    }
    //}
  }, [status]);
  useEffect(() => {
    fetch(serverAddress + "/api/getNonce")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.reply);
          calculateHash(result.reply.realm, result.reply.nonce);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          //setIsLoaded(true);
          setError(error);
          console.log(error);
        },
      );
  }, []);

  const manualUrl =
    "https://nxcloud.mplus.co.il/hls/1f01f97e-86fe-d6c6-ef17-89f5a7c3fe74.mkv?lo&duration=300&auth=YWRtaW46em53WW9qSm81ZzdnZzlhMll6M293RVltandoVG5VPWh6b29sbzpkNWM4Y2FkZTU2ZjI3ZDM3MGJhNDMwZjQ2MTMwYjI1ZQ==";
  //"https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8";
  //"https://34.121.134.231:7001/static/index.html#/view/1f01f97e-86fe-d6c6-ef17-89f5a7c3fe74?&auth=YWRtaW46em53WW9qSm81ZzdnZzlhMll6M293RVltandoVG5VPWh6Y2FrZjo0Njg1ZWNjMDg2ZmYzNWYwN2M1ZTliOGFkYmE5YWRmNg==";
  //

  const [finalURL, setFinalUrl] = useState("");

  if (isLoaded) {
    return (
      <View style={styles.container}>
        <Text>{urlFetcher.folder}</Text>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: cameraURL, //manualUrl
          }}
          useNativeControls
          resizeMode="contain"
          shouldPlay
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        <Button
          title={status.isPlaying ? "Pause" : "Play"}
          onPress={playHandler.bind(status.isPlaying)}
        />
        <Button
          title="Print Camera Url"
          onPress={() => console.log(cameraURL)}
        />
      </View>
    );
  } else {
    return <ActivityIndicator />;
  }
};

export default GetStream;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
