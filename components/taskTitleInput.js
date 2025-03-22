import { useContext } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Context } from '../utilities/ContextManager.js';

const taskTitleInput = ({titleInputRef, setInputTitle, title}) => {
    
    const { theme, darkmode } = useContext(Context);
    return (
        <TextInput
            ref={titleInputRef}
            style={[styles.titleInput, {borderColor: `${theme}`, color: darkmode ? "#ffffff":"#000000",backgroundColor:`${theme}40`,}]}
            onChangeText={(title) => {setInputTitle(title)}}
            value={title}
            placeholder="Enter Task Title Here"
            placeholderTextColor={darkmode ? "#ffffff":`${theme}`}
        />
    );
}

export default taskTitleInput;

const styles = StyleSheet.create({
    titleInput: {
        fontSize: 16,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderWidth: 0,
        borderRadius:0,
        marginBottom: "3%",
        fontFamily: 'Poppins-Regular'
        
    },
})