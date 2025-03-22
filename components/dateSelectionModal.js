import moment from 'moment';
import { useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BackgroundCol, TintCol } from '../utilities/theme.js';
import { Context } from '../utilities/ContextManager.js';
import CalendarPicker from 'react-native-calendar-picker';

const DateSelectionModal = ({
    calendarModalVisible,
    setCalendarModalVisible,
    setSelectedStartDate,
    setSelectedEndDate,
    startDate,
    endDate,
}) => {

    const { theme, darkmode } = useContext(Context);

    // const minDate = new Date(); // Today's Date
    const minDate = new Date(2000, 1, 1);
    const maxDate = new Date(2100, 1, 1);

    const onDateChange = (date, type) => {
        var formatDate = moment(date).format("Do MMM YYYY");
        if (type === 'START_DATE') {
            setSelectedStartDate(formatDate);
        }
        else {
            setSelectedEndDate(formatDate);
        }
    }

    return (
        <View style={{ flexDirection: 'row', marginBottom: "2%",alignContent:"center",borderWidth:0,borderColor:`${theme}`,borderRadius:0,justifyContent:"center",justifyItems:"center",backgroundColor:`${theme}40` }}>
            {/* START DATE */}
            <View style={{ width: "44%" }}>
                <TextInput
                    editable={false}
                    style={[styles.titleInput, { borderColor: "white", color: darkmode ? "#ffffff" : "#000000", borderRightWidth: 1}]}
                    onChangeText={(startDate) => { setSelectedStartDate(startDate) }}
                    value={startDate}
                    placeholder="Start Date"
                    placeholderTextColor={darkmode ? "#ffffff":`${theme}`}
                />
            </View>
            {/* END DATE */}
            <View style={{ width: "44%" }}>
                <TextInput
                    editable={false}
                    style={[styles.titleInput, { borderColor: "white", color: darkmode ? "#ffffff" : "#000000", borderRightWidth: 1}]}
                    onChangeText={(endDate) => { setSelectedEndDate(endDate) }}
                    value={endDate}
                    placeholder="End Date"
                    placeholderTextColor={darkmode ? "#ffffff":`${theme}`}
                />
            </View>
            {/* CALENDAR DATE SELECTOR */}
            <View style={{ width: "8%", marginHorizontal: "2%",marginTop:"3%", alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { setCalendarModalVisible(!calendarModalVisible) }}>
                    <FontAwesome5 name="calendar" size={28} color={BackgroundCol()} />
                </TouchableOpacity>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={calendarModalVisible}
                    presentationStyle={'overFullScreen'}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center' }}>
                        <View style={[styles.calendarOverlay, { backgroundColor: TintCol(), borderColor: BackgroundCol() }]}>
                            {/* CLOSE MODAL BUTTON */}
                            <TouchableOpacity style={styles.closeModalBtn} onPress={() => { setCalendarModalVisible(!calendarModalVisible) }}>
                                <MaterialCommunityIcons name="close-thick" size={32} color={BackgroundCol()} />
                            </TouchableOpacity>
                            {/* CALENDAR MODAL */}
                            <View style={{ marginBottom: "5%" }}>
                                <CalendarPicker
                                    startFromMonday={true}
                                    showDayStragglers={true}
                                    allowRangeSelection={true}
                                    allowBackwardRangeSelect={true}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    onDateChange={onDateChange}
                                    previousTitle={"<"}
                                    nextTitle={">"}
                                    previousTitleStyle={{ color: BackgroundCol(), fontSize: 30 }}
                                    nextTitleStyle={{ color: BackgroundCol(), fontSize: 30 }}
                                    monthTitleStyle={{ color: BackgroundCol(), fontSize: 22, fontWeight: 'bold' }}
                                    yearTitleStyle={{ color: BackgroundCol(), fontSize: 22, fontWeight: 'bold' }}
                                    textStyle={{ color: darkmode ? "#ffffff" : "#000000", fontSize: 16 }}
                                    todayBackgroundColor={"crimson"}
                                    todayTextStyle={{ color: "#ffffff", fontWeight: 'bold' }}
                                    selectedDayColor={BackgroundCol()}
                                    selectedDayTextStyle={{ color: "#ffffff", fontWeight: 'bold' }}

                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>


        </View>
    );
}

export default DateSelectionModal;

const styles = StyleSheet.create({
    titleInput: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 9,
        borderWidth: 0,
        borderRadius: 0,
        marginBottom: "0%",
        marginRight:4,
        fontFamily: 'Poppins-Regular'
    },
    calendarOverlay: {
        borderWidth: 3,
        borderRadius: 0,
        marginHorizontal:"2%"
    },
    closeModalBtn: {
        alignSelf: 'flex-end',
        margin: 10
    },
});