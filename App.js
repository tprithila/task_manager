import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens'; 
 enableScreens();
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/splashScreen.js';
import NavigationDrawerStructure from "./components/customDrawer.js"
import LoginScreen from './screens/loginScreen.js';
import RegistrationScreen from './screens/registrationScreen.js';
import GoogleAuth from "./screens/GoogleAuth.js"

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();
export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            await Font.loadAsync({
                'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
                'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
                'Poppins-Italic': require('./assets/fonts/Poppins-Italic.ttf'),
                'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
                'Poppins-Semibold': require('./assets/fonts/Poppins-SemiBold.ttf'),
            });
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />;
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: '#1E1E1E' },
                    }}
                >
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegistrationScreen} />
                    <Stack.Screen name="Googleauth" component={GoogleAuth} />
                    <Stack.Screen name="Main" component={NavigationDrawerStructure} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
    },
});