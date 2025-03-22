import { useContext } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { BackgroundCol } from '../utilities/theme.js';
import { Context } from '../utilities/ContextManager.js';

export const AutoCategorizeTasks = () => {
    const { autoCategorize, setAutoCategorize,theme } = useContext(Context);
    return (
        <View style={{flexDirection:'row', marginRight: "6%" }}>
            <Text style={{fontSize: 16, color: BackgroundCol(), alignSelf:'center', marginRight: "0%",width:"70%",fontFamily: 'Poppins-Regular'}}>
                Auto Categorization:
            </Text>
            <Switch
                trackColor={{true: BackgroundCol(),false:`${theme}` }}
                thumbColor={"white"}
                onValueChange={() => {setAutoCategorize(!autoCategorize)}}
                value={autoCategorize}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewIcon: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
})