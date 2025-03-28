import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Switch } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Context } from '../utilities/ContextManager.js'
import { BackgroundCol } from "../utilities/theme.js";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, firebaseDB } from '../firebaseConfig.js';
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


export function DrawerContent(props) {
    const { theme, setTheme, darkmode, setDarkMode, ThemeArray, setThemeArray } = useContext(Context);
    console.log("Current Dark mode from context is", darkmode)

    const [deleteMode, setDeleteMode] = useState(false);

    const navigation = useNavigation();

    const userProfile = auth.currentUser;

    useEffect(() => {
        fetchThemes();
    }, [])

    // get themes from firebase
    const fetchThemes = async () => {
        const docRef = await getDocs(collection(firebaseDB, "user", userProfile.uid, "Themes"));

        // if there is no Themes collection in firebase yet, set one
        if (docRef.empty) {
            const tempArray = [...ThemeArray];
            tempArray.map(async (themeColor) => {
                // set doc for each colour
                await setDoc(doc(firebaseDB, "user", userProfile.uid, "Themes", themeColor.color), { color: themeColor.color, state: themeColor.state });
                // set the current theme
                if (themeColor.state == true) {
                    setTheme(themeColor.color);
                }
            })
        }
        // else get from firebase and set to ThemeArray
        else {
            const tempArray = [];
            // get themes from firebase
            docRef.forEach((doc) => {
                tempArray.push(doc.data());
            })
            // set theme array
            setThemeArray(tempArray);

            // set the current theme
            tempArray.map((themeColor) => {
                if (themeColor.state == true) {
                    setTheme(themeColor.color);
                }
            })
        }
    }

    // sign out function
    const SignOut = async () => {
        await signOut(auth)
            .then(() => {
                navigation.replace("Login");
            })
            .catch(error => alert(error.message));
        await AsyncStorage.removeItem('googleAccessToken');
    }

    // toggles the delete mode state
    
    const toggleDarkModeButton = async () => {
        // update to firebase
    
        setDarkMode(!darkmode);
     
        try {
            await updateDoc(doc(firebaseDB, "user", userProfile.uid, "Mode", "DarkMode"),
                { darkMode: !darkmode });
           
        } catch (e) {
            console.log("Error at Firebase while setthing darkmode", e)
        }

    }
   
    // toggles the delete mode state
    const toggleDeleteButton = () => {
        setDeleteMode(!deleteMode);
    }

    // handles theme change within the application
    const selectTheme = async (col, key) => {
        console.log("Selected Color:", col)
        setTheme(col);
        // update firebase
        // set old theme object to false state
        await updateDoc(doc(firebaseDB, "user", userProfile.uid, "Themes", theme), { state: false });
        // set new theme object to true state
        await updateDoc(doc(firebaseDB, "user", userProfile.uid, "Themes", col), { state: true });


        // set the 'theme', and 'theme selected', to selected theme color


        const themeColors = [...ThemeArray];

        // set all others' state to false
        themeColors.map((themeCol) => {
            themeCol.state = false;
        })
        // set selected theme state to true
        themeColors[key].state = true;

        // set theme array
        setThemeArray(themeColors);
    }

    // handles which theme to delete from the array, based on given index
    const deleteTheme = async (col, key) => {
        const themeColors = [...ThemeArray];
        // remove from array, based on the key (index)
        themeColors.splice(key, 1);
        // set theme array
        setThemeArray(themeColors);

        // if theme to be deleted is current theme
        if (col == theme) {
            // if theme to be deleted is not the first theme
            if (key > 0) {
                //set theme to be the theme infront of the deleted theme
                setTheme(ThemeArray[key - 1].color);

                // set new theme object to true state
                await updateDoc(doc(firebaseDB, "user", userProfile.uid, "Themes", ThemeArray[key - 1].color), { state: true });
            }
            else {
                //set theme to be the first theme in list
                setTheme(ThemeArray[0].color);

                // set new theme object to true state
                await updateDoc(doc(firebaseDB, "user", userProfile.uid, "Themes", ThemeArray[0].color), { state: true });
            }
        }
        // reset delete button
        toggleDeleteButton();

        // update firebase
        await deleteDoc(doc(firebaseDB, "user", userProfile.uid, "Themes", col));
    }

    // renders custom theme buttons
    const renderThemeButtons = () => {
        // if delete theme mode is true, show the 'X' icon within all themes
        // when pressed, calls deleteTheme, parsing in the index to delete
        if (deleteMode) {
            return ThemeArray.map((col, key) => {
                return (
                    <TouchableOpacity onPress={() => deleteTheme(col.color, key)} key={key}
                        style={[styles.themeButton, { backgroundColor: col.color }]}>
                        <FontAwesome name="trash-o" size={20} color={"white"} style={{ alignSelf: 'center' }} />
                    </TouchableOpacity>
                );
            });
        }
        // else, render theme buttons, change theme to respective color when pressed
        else {
            return ThemeArray.map((col, key) => {
                // if the theme is pressed, display an icon to indicate current theme selected
                return (
                    <TouchableOpacity onPress={() => selectTheme(col.color, key)} key={key}
                        style={[styles.themeButton, { backgroundColor: col.color }]}>
                        <FontAwesome5 name="check-circle" size={20} color={"white"} style={{ alignSelf: 'center', display: theme == col.color ? 'flex' : 'none' }} />
                    </TouchableOpacity>
                );
            });
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <Drawer.Section>
                    <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 15, marginVertical: 10 }}>
                        {/* IMAGE */}
                        <Image source={{ uri: userProfile?.photoURL }} style={[styles.userProfileImg, { borderColor: `${theme}` }]} />
                        {/* USERNAME */}
                        <Text style={{ fontSize: 20, color: `${theme}`, alignSelf: 'flex-start', marginLeft: "8%" }}>
                            {userProfile?.displayName}
                        </Text>
                    </View>
                </Drawer.Section>

                {/* DRAWER TABS */}
                <Drawer.Section>
                    <DrawerItemList {...props} />
                </Drawer.Section>

                {/* PREFERENCES */}
                <Drawer.Section style={{marginBottom:"25%"}}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10,backgroundColor:`${BackgroundCol()}20`,paddingVertical:15,alignItems:"center",paddingHorizontal:10 }}>
                        <Text style={{ fontSize: 16, color: BackgroundCol(),width:"90%",fontFamily:"Poppins-Regular" }}>
                            Preferences
                        </Text>
                        <TouchableOpacity onPress={() => { toggleDeleteButton() }}
                            style={{ color: 'red' }}>
                            <MaterialCommunityIcons name="delete" size={30} color={theme} style={{ alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={{ color: BackgroundCol(),fontFamily:"Poppins-Regular" }}>Current Theme: {theme}</Text>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: "wrap", marginLeft: 26 }}>
                        {/* render all theme buttons */}
                        {renderThemeButtons()}

                        {/* customise theme button */}
                        <TouchableOpacity onPress={() => props.navigation.navigate('CustomColorPicker')}
                            style={[styles.themeButton, {
                                borderColor: "white",
                                backgroundColor: `${theme}`
                            }]}>
                            <FontAwesome5 name="plus" size={26} color="white" style={{ alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                </Drawer.Section>

                {/* DARK MODE SWITCH */}
                <Drawer.Section>
                    <View style={[ styles.drawerItem,{ flex: 1, flexDirection: "row", marginLeft: 10, justifyContent: 'space-between', width: "93%", alignItems: "center",paddingLeft:10,backgroundColor:`${BackgroundCol()}20`,paddingVertical:5 }]}>
                        <Text style={{ fontSize: 16, color: BackgroundCol(), width: "40%",fontFamily:"Poppins-Regular" }}>
                            Dark Mode
                        </Text>
                        <Switch
                            trackColor={{ true: BackgroundCol() }}
                            thumbColor={"white"}
                            onChange={toggleDarkModeButton}
                            value={darkmode}
                            style={{ marginRight: 5 }}
                        />
                    </View>
                </Drawer.Section>
            </DrawerContentScrollView>

            {/* SIGN OUT */}
            <Drawer.Section style={{ marginLeft: 0, marginBottom: 10 }}>
                <DrawerItem
                    label="Sign out"
                    icon={({ color, size }) => (
                        <MaterialCommunityIcons name="logout" size={30} color={BackgroundCol()} />
                    )}
                    onPress={SignOut}
                    labelStyle={{
                        fontSize: 16,
                        color: BackgroundCol(),
                        fontFamily:"Poppins-Regular"
                    }}
                   
                    style={[styles.drawerItem,{backgroundColor:`${BackgroundCol()}20`}]}
                    
                />
            </Drawer.Section>
        </View>
    );
};

const styles = StyleSheet.create({
    sideMenuProfileIcon: {
        resizeMode: 'center',
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        alignSelf: 'center',
    },
    iconStyle: {
        width: 15,
        height: 15,
        marginHorizontal: 5,
    },
    customItem: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeButton: {
        width: 30,
        height: 30,
        borderWidth: 0,
        borderRadius: 0,
        marginRight: 0,
        marginVertical: 8,
        backgroundColor: "white",
        justifyContent: 'center'
    },
    userProfileImg: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderRadius: 0,
        resizeMode: 'cover',
    },
    drawerItem: {
      
        marginVertical: 5,
        borderRadius: 1,
    },
});