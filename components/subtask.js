import { useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { BackgroundCol } from '../utilities/theme.js';
import { FontAwesome, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { Context } from '../utilities/ContextManager.js';

const subtask = ({
    subtaskList,
    setSubtaskList,
    subtask,
    setSubtask,
}) => {
    const { theme, darkmode } = useContext(Context);

    // adds subtask to subtask list
    const addSubtaskToList = () => {
        //make copy of array
        const subtaskListArray = [...subtaskList];

        // get list of subtask
        const subtasksTitle = [];
        subtaskListArray.map((item) => {
            subtasksTitle.push(item.subtask);
        })

        // if no subtask input, alert user
        if (subtask == "") {
            alert("Enter a subtask");
            return;
        }
        // dont allow same subtask title, as i will be using the title as reference 
        // for locating the correct subtask to mark as complete, edit, delete etc.
        else if (subtasksTitle.includes(subtask)) {
            alert("Same Subtask title name exists. Enter a new Subtask title");
            return;
        }
        else {
            //push new subtask into array
            subtaskListArray.push({ subtask: subtask, complete: false });

            //set subtasklist to new array
            setSubtaskList(subtaskListArray);
        }

        //clear text input
        setSubtask("");
    }

    const removeSubtaskFromList = (index) => {
        //console.log(subtaskList.index);
        const subtaskListArray = [...subtaskList];
        subtaskListArray.splice(index, 1);
        setSubtaskList(subtaskListArray);
    }

    return (
        <View style={{ marginTop: "1%", marginBottom: "2%", borderWidth: 2, borderColor: `${theme}`, padding: 8, borderRadius: 0 }}>
            <Text style={[styles.subtaskLabel, { color: BackgroundCol() }]}>
                Subtask:
            </Text>

            {/* DISPLAY SUBTASKS */}
            {/* DISPLAYING VIA MAP INSTEAD OF FLATLIST, AS THE ADDTASK PARENT COMPONENT NEEDS 
            TO BE WRAPPED IN SCROLLVIEW, WHICH DOESNT WORK WELL WITH A NESTED FLATLIST */}
            {subtaskList.map((item, index) => (
                <View style={styles.subtaskListItemContainer} key={index}>
                    <View style={styles.subtaskListText}>
                        <Octicons name="dot-fill" size={16} color={`${theme}`} />
                        <Text style={[styles.subtaskList, { color: darkmode ? "#ffffff" : "#000000" }]}>
                            {item.subtask}
                        </Text>
                    </View>

                    <View style={{ width: "10%", alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { removeSubtaskFromList(index) }}>
                            <FontAwesome name="remove" size={24} color={`${theme}`} />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            {/* SUBTASK TEXT INPUT */}
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                {/* SUBTASK INPUT */}
                <TextInput
                    style={[styles.subtaskInput, {
                        flex: 0.8, // 80% width
                        borderColor: theme,
                        color: darkmode ? "#ffffff" : theme,
                        backgroundColor: `${theme}40`
                    }]}
                    onChangeText={setSubtask}
                    value={subtask}
                    placeholder="Enter Subtask"
                    placeholderTextColor={darkmode ? "#ffffff" : theme}
                    placeholderStyle={{ fontSize: 16 }}
                />

                {/* ADD SUBTASK BUTTON */}
                <TouchableOpacity
                    onPress={addSubtaskToList}
                    style={{
                        flex: 0.2, // 20% width
                        flexDirection: 'row',
                        justifyContent: "center",
                        alignItems: 'center',
                        backgroundColor: darkmode ? "#ffffff" : `${theme}60`,
                        paddingVertical: 9.5,
                        borderWidth: 0,
                        borderColor: theme
                    }}>
                  
                    <MaterialCommunityIcons name="plus-thick" size={24} color={BackgroundCol()} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default subtask;

const styles = StyleSheet.create({
    subtaskLabel: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold'
    },
    subtaskInput: {
        fontSize: 16,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderWidth: 0,
        borderRadius: 0,
        marginTop: "3%",
        marginBottom: "3%",
        fontFamily: 'Poppins-Regular'
    },
    addSubtaskBtn: {
        fontSize: 16,
        marginRight: "1%",
        width: "10%",
        fontFamily: 'Poppins-Regular'
    },
    subtaskList: {
        marginLeft: "2%",
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
    },
    subtaskListItemContainer: {
        flexDirection: 'row',
        marginTop: "2%",
        marginLeft: "2%",
        alignItems: 'center',
    },
    subtaskListText: {
        width: "90%",
        flexDirection: 'row',
        alignItems: 'center',
    },
})