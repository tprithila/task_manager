import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
    Keyboard.dismiss();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const uid = user.uid;
        navigation.replace('Main');
        console.log('User is signed in');
      } else {
        // User is signed out
        console.log('User is signed out');
      }
    });
    return unsubscribe;
  }, []);

  const Login = () => {
    // Check all input fields have data
    if (email === '' || password === '') {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Input Required',
        textBody: 'Please fill in all fields',
        button: 'Close',
        iconConfig: {
          iconColor: '#6495ED',
        },
        buttonStyle: {
          backgroundColor: '#6495ED',
          color: 'white',
        },
      });

    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Logged in
          const user = userCredential.user;
          console.log('Logged in as: ', user.displayName);
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Login Successful',
            textBody: 'Welcome back!',
          });
          navigation.navigate('Googleauth');
        })
        .catch((error) => {
          console.log(error.message);
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Login Failed',
            textBody: 'Invalid login credentials. Try again.',
            button: 'Close',
          });
        });
    }
  };

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={{ marginTop: '30%' }}>
            <FontAwesome
              name="user-circle-o"
              size={130}
              color="#FED36A"
              style={{ alignSelf: 'center', marginBottom: '10%' }}
            />
            <View><Text style={{ fontSize: 26, color: "white", marginBottom: 10, textAlign: "center",fontFamily:"Poppins-Bold" }} >Welcome Back!</Text></View>

            {/* EMAIL */}
            {/* <Text style={styles.inputLabel}>Email:</Text> */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="email"
                size={30}
                color="#FED36A"
                style={{ marginRight: '2%',marginLeft:"2%" }}
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="white"

              />
            </View>
            {/* PASSWORD */}
            {/* <Text style={styles.inputLabel}>Password:</Text> */}
            <View style={styles.passinputContainer}>
             
              <MaterialCommunityIcons
                name="lock"
                size={30}
                color="#FED36A"
                style={{ marginRight: '2%',marginLeft:"2%" }}
              />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="white"
                secureTextEntry={!isPasswordVisible} // Toggle visibility based on state
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
            {/* BUTTONS */}
            <View style={{ flexDirection: 'column', justifyContent: 'space-around', marginTop: '10%' }}>
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: '#FED36A' }]}
                onPress={Login}
              >
                <Text style={{ fontSize: 14, color: 'black',textAlign:"center",fontFamily:"Poppins-Bold", }}>Let's go!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => {
                  navigation.navigate('Register');
                }}
              >
                <Text style={{ fontSize: 14, color: '#FED36A', textAlign: "center" ,fontFamily:"Poppins-Regular",}}>Register Account</Text>
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: '5%',
  },
  inputLabel: {
    fontSize: 16,
    color: '#FED36A',
    marginBottom: 10
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
    fontFamily:"Poppins-Regular",
    borderRadius: 0,
    color: 'white', // This will make the text inside the input field white
  },
  passinputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
    marginBottom: '3%',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#FED36A',
  },
  visibilityIcon: {
    position: 'absolute',
    right: 10,
  },
  submitBtn: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#FED36A',
    borderRadius: 0,
    textAlign:"center",
    marginBottom:9
  },
});
