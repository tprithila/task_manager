import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { View, Text, Button, Image, ImageBackground, Alert } from "react-native";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";

const GOOGLE_CLIENT_ID = Constants.manifest.extra.googleClientId;
const REDIRECT_URI = AuthSession.makeRedirectUri({useProxy: true});

export default function GoogleAuth() {
  const [token, setToken] = useState(null);
  const navigation = useNavigation();

  const authenticateWithGoogle = async () => {
    try {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=https://www.googleapis.com/auth/calendar.events`;

      const result = await AuthSession.startAsync({ authUrl });

      if (result.type === "success") {
        const accessToken = result.params.access_token;
        setToken(accessToken);
        await AsyncStorage.setItem("googleAccessToken", accessToken);
        console.log("Google Access Token Stored:", accessToken);

        // Navigate to Main screen
        navigation.replace("Main");
      } else {
        Alert.alert("Authentication Failed", "User canceled or an error occurred.");
      }
    } catch (error) {
      console.error("Error authenticating with Google:", error);
      Alert.alert("Error", "An error occurred during authentication.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Google_Calendar_icon_%282020%29.svg" }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}
      resizeMode="contain"
    >
      <View style={{ alignItems: "center", padding: 20 }}>

        {/* Google Calendar Icon */}
        <Image
          source={require("../assets/icons8-google-calendar-480.png")}
          style={{ width: 300, height: 300, marginBottom: 0 }}
        />

        {/* Title Text */}
        <Text style={{ fontSize: 22, color: "white", marginBottom: 40, textAlign: "center", fontFamily: "Poppins-Bold" }}>
          Get linked with your Google Calendar
        </Text>

        {/* Connect Button */}
        <Button title="Connect Google Calendar" onPress={authenticateWithGoogle} style={{ fontSize: 22, color: "white", marginBottom: 40, textAlign: "center", fontFamily: "Poppins-Regular" }} />

        {/* Success Message */}
        {token && <Text style={{ marginTop: 18, color: "white", textAlign: "center", fontFamily: "Poppins-Regular" }}>Connected to Google Calendar ✅</Text>}

      </View>
    </ImageBackground>
  );
}