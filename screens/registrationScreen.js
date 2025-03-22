import React from 'react'
import { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';


const RegistrationScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
        Keyboard.dismiss()
    };
    const togglePasswordVisibility2 = () => {
        setIsPasswordVisible2((prevState) => !prevState);
        Keyboard.dismiss()
    };


    const registerAccount = () => {
        // check all input fields have data
        if (username == '' || email == '' || password == '' || confirmPassword == '') {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Input Required',
                textBody: 'Please fill in all fields',
                button: 'Close',
            });
        }
        // password should be longer than 6 characters
        else if (password.length < 6) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Validation error',
                textBody: 'Password should be at least 6 characters',
                button: 'Close',
            });
        }
        // check password fields match
        else if (password != confirmPassword) {
            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: 'Validation error',
                textBody: 'Password does not match',
                button: 'Close',
            });
        }
        else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Account created
                    const user = userCredential.user;
                    

                    // update display name
                    updateProfile(userCredential.user, {
                        displayName: username,
                    })
                        .then((user) => {
                            // console.log(auth.currentUser);
                        })
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Register Successful',
                        textBody: 'Account registered successfully!',
                    });
                    navigation.navigate('Login');
                })
                .catch((error) => {
                    console.log(error.message)
                    alert('Invalid registration credentials. Try again.')
                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'Registration Failed',
                        textBody: 'Invalid registration credentials. Try again.',
                        button: 'Close',
                    });
                });
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ScrollView style={{ marginTop: "8%" }}>
                    <FontAwesome name="user-circle-o" size={130} color="#FED36A" style={{ alignSelf: 'center', marginBottom: "8%" }} />
                    <View><Text style={{ fontSize: 26,  fontFamily:"Poppins-Bold", paddingBottom: 10, color: "white", textAlign: "center" }} >Create your account</Text></View>
                    {/* USERNAME */}
                    {/* <Text style={styles.inputLabel}>Username:</Text> */}
                    <View style={styles.inputContainer}>
                        <FontAwesome name="user-circle-o" size={30} color="#FED36A" style={{ marginRight: "2%", marginLeft: "2%" }} />
                        <TextInput
                            placeholder='Username'
                            value={username}
                            onChangeText={text => setUsername(text)}
                            placeholderTextColor="white"
                            autoCapitalize='none'
                            style={styles.input}
                            
                        />
                    </View>
                    {/* EMAIL */}
                    {/* <Text style={styles.inputLabel}>Email:</Text> */}
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="email" size={30} color="#FED36A" style={{ marginRight: "2%", marginLeft: "2%" }} />
                        <TextInput
                            placeholder='Email'
                            value={email}
                            onChangeText={text => setEmail(text)}
                            autoCapitalize='none'
                            placeholderTextColor="white"
                            style={styles.input}
                        />
                    </View>
                    {/* PASSWORD */}
                    {/* <Text style={styles.inputLabel}>Password:</Text> */}
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock" size={30} color="#FED36A" style={{ marginRight: "2%", marginLeft: "2%" }} />
                        <TextInput
                            placeholder='Password'
                            value={password}
                            onChangeText={text => setPassword(text)}
                            autoCapitalize='none'
                            style={styles.input}
                            placeholderTextColor="white"
                            secureTextEntry={!isPasswordVisible}
                        />
                        {/* Toggle Eye Icon for Password Visibility */}
                        <TouchableOpacity style={styles.visibilityIcon} onPress={togglePasswordVisibility}>
                            <MaterialCommunityIcons
                                name={isPasswordVisible ? 'eye' : 'eye-off'} // Toggle eye icon based on password visibility state
                                size={30}
                                color="#FED36A"
                            />
                        </TouchableOpacity>
                    </View>
                    {/* CONFIRM PASSWORD */}
                    {/* <Text style={styles.inputLabel}>Confirm Password:</Text> */}
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock" size={30} color="#FED36A" style={{ marginRight: "2%", marginLeft: "2%" }} />
                        <TextInput
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChangeText={text => setConfirmPassword(text)}
                            autoCapitalize='none'
                            style={styles.input}
                            secureTextEntry={!isPasswordVisible2}
                            placeholderTextColor="white"
                        />
                        {/* Toggle Eye Icon for Password Visibility */}
                        <TouchableOpacity style={styles.visibilityIcon} onPress={togglePasswordVisibility2}>
                            <MaterialCommunityIcons
                                name={isPasswordVisible2 ? 'eye' : 'eye-off'} // Toggle eye icon based on password visibility state
                                size={30}
                                color="#FED36A"
                            />
                        </TouchableOpacity>
                    </View>
                    {/* BUTTONS */}
                    <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginTop: '10%' }}>
                        {/* GO TO LOGIN PAGE */}
                        <TouchableOpacity onPress={() => { navigation.navigate("Login") }}
                            style={styles.submitBtn}>
                            <Text style={{ fontSize: 14, color: '#FED36A', textAlign: "center",fontFamily:"Poppins-Regular" }}>Back to Login</Text>
                        </TouchableOpacity>
                        {/* REGISTER BUTTON */}
                        <TouchableOpacity onPress={registerAccount}
                            style={[styles.submitBtn, { backgroundColor: '#FED36A' }]}>
                            <Text style={{ fontSize: 14, color: 'black',textAlign:"center",fontFamily:"Poppins-Bold" }}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default RegistrationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: "5%",
    },
    inputLabel: {
        fontSize: 16,
        color: '#FED36A',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '4%',
        marginBottom: '3%',
        borderWidth: 2,
        borderColor: '#FED36A',
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingHorizontal: 10,
        paddingVertical: 12,
        color:"white",
        borderRadius: 10,
        fontFamily:"Poppins-Regular"
    },
    passinputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '1%',
        marginBottom: '3%',
        position: "relative"
    },
    visibilityIcon: {
        position: "absolute",
        right: 10
    },
    dateText: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 2,
        borderColor: '#FED36A',
        borderRadius: 10,
    },
    submitBtn: {
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: '#FED36A',
        borderRadius: 0,
        textAlign: "center",
        marginBottom: 9
    },
})