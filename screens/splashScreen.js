import React from 'react'
import { useState, useEffect,useContext } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { color } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SplashScreen = ({ navigation }) => {

    

    const LoginScreen = () => {
        navigation.navigate("Login")
    }

    const checkAndRemoveItem = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);

            if (value !== null) {
           
                await AsyncStorage.removeItem(key);
                console.log(`✅ Item with key "${key}" removed successfully.`);
            } else {
                console.log(`❌ No item found with key "${key}".`);
            }
        } catch (error) {
            console.log('Error checking or removing item:', error);
        }
    };

    // Usage example
    checkAndRemoveItem('googleAccessToken');

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={{ marginTop: "30%" }}>
                    <View style={{ alignSelf: 'center', marginBottom: "10%", borderWidth: 3,borderColor:"#FED36A",padding:2,width:"100%",height:"60%" }}>
                        <Image
                            source={require('../assets/pana2.png')}
                            style={{width:"100%",height:"100%",objectFit:"scale-down"}}
                        />
                    </View>
                    <View >
                        <Text style={styles.splashText}>
                            SEAMLESS TASK {'\n'}
                            <Text style={[styles.splashText, { color: '#FED36A' }]}>MANAGEMENT</Text>
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: "10%" }}>
                        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#FED36A' }]}
                            onPress={LoginScreen}  >
                            <Text style={{ fontSize: 16, color: 'black', fontFamily: "Poppins-Bold", width: "100%" }}>Let's Start!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: "5%",
    },
    splashText: {
        fontSize: 34,
        color: "white",
        textAlign: 'center',
        paddingHorizontal: 20,
        fontFamily: "Poppins-Bold"
    },
    submitBtn: {
        paddingHorizontal: 120,
        paddingVertical: 15,
        borderWidth: 2,
        borderColor: '#FED36A',
    },
})