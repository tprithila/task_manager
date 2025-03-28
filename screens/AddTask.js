import moment, { ISO_8601 } from "moment";
import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView, Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  FontAwesome,
  FontAwesome5,
  Octicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BackgroundCol, TintCol } from "../utilities/theme.js";
import { Context } from "../utilities/ContextManager.js";
import TaskTitleInput from "../components/taskTitleInput.js";
import DropDownPicker from "react-native-dropdown-picker";
import DateSelectionModal from "../components/dateSelectionModal.js";
import AddIconItem from "../components/addIconItem.js";
import Subtask from "../components/subtask.js";

import AttachmentComponent from "../components/attachmentComponent.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, firebaseDB } from "../firebaseConfig.js";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from 'expo-linear-gradient';
const AddTask = ({ navigation }) => {
  // Google related work
  const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

  const [eventStatus, setEventStatus] = useState("");

  const AddTaskToGoogleCalender = async (dataObj) => {
    console.log("Function called!");

    try {
      const token = await AsyncStorage.getItem("googleAccessToken");
      console.log("Token fetched:", token);

      if (!token) {
        setEventStatus("❌ No Google Access Token Found!");
        console.log("There is no token");
        return; 
      }

      var startDate = convertToISO(dataObj.startDate)
      var endtDate = convertToISO(dataObj.endDate)

      console.log("Task details:", dataObj); 

      const eventDetails = {
        summary: dataObj.title,
        description: `Category:${dataObj.category},Priority:${dataObj.priority},Type ${dataObj.icon}`,
        start: {
          dateTime: startDate,
          timeZone: "Asia/Karachi",
        },
        end: {
          dateTime: endtDate,
          timeZone: "Asia/Karachi",
        },
      };

      console.log("Event details prepared:", eventDetails);

      try {
        const response = await fetch(GOOGLE_CALENDAR_API, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventDetails),
        });

        console.log("Response received:", response.status); 
        const data = await response.json();
        console.log("Response data:", data); 

        if (response.ok) {
          setEventStatus(`✅ Task added to Google Calendar! Event ID: ${data.id}`);
        } else {
          setEventStatus(`❌ Error: ${data.error?.message || "Unknown error"}`);
        }
      } catch (e) {
        console.log("Error while setting event in calendar", e);
      }
    } catch (error) {
      setEventStatus("❌ Failed to add task. Check console.");
      console.log("Error adding task to Google Calendar:", error);
    }
  };

  const convertToISO = (dateString) => {
   
    const cleanDate = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");

    
    const date = new Date(cleanDate + " 15:00:00 UTC");


    return date.toISOString();
  };

  const {
    theme,
    darkmode,
    taskList,
    setTaskList,
    taskList_stateFilter,
    setTaskList_stateFilter,
    taskList_dateFilter,
    setTaskList_dateFilter,
    taskList_priorityFilter,
    setTaskList_priorityFilter,
    taskList_categoryFilter,
    setTaskList_categoryFilter,
    taskList_iconFilter,
    setTaskList_iconFilter,
    filterCheckbox,
    setFilterCheckbox,
    autoCategorize,
    setAutoCategorize,
    taskEditState,
    setTaskEditState,
    taskItemForScreen,
    setTaskItemForScreen,
  } = useContext(Context);

  const tabBarHeight = useBottomTabBarHeight();

  const userProfile = auth.currentUser;

  const titleInputRef = useRef();

  const [title, setInputTitle] = useState(null);
  const [icon, setInputIcon] = useState(null);
  const [iconLabel, setInputIconLabel] = useState(null);

  const [iconModalVisible, setIconModalVisible] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const [categoryValue, setCategoryValue] = useState(null);
  const [priorityValue, setPriorityValue] = useState(null);
  const [iconValue, setIconValue] = useState(null);
  const [notifyValue, setNotifyValue] = useState(null);

  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const startDate = selectedStartDate ? selectedStartDate.toString() : "";
  const endDate = selectedEndDate ? selectedEndDate.toString() : "";

  const [subtask, setSubtask] = useState([]);
  const [subtaskList, setSubtaskList] = useState([]);

  const [canvasImage, setCanvasImage] = useState(null);
  const [canvasImageList, setCanvasImageList] = useState([]);

  const [image, setImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const [categoryItems, setCategoryItems] = useState([
    { label: "None", value: null },
    { label: "Planning", value: "Planning" },
    { label: "Creative", value: "Creative" },
    { label: "Intellective", value: "Intellective" },
    { label: "Decision-Making", value: "Decision-Making" },
    { label: "Cognitive", value: "Cognitive" },
    { label: "Miscellaneous", value: "Miscellaneous" },
  ]);

  const [priorityItems, setPriorityItems] = useState([
    {
      label: "None",
      value: null,
      icon: () => (
        <MaterialCommunityIcons name="circle-off-outline" size={22} color={"gray"} />
      ),
    },
    {
      label: "High",
      value: "High",
      icon: () => (
        <MaterialCommunityIcons name="circle" size={22} color={"crimson"} />
      ),
    },
    {
      label: "Medium",
      value: "Medium",
      icon: () => (
        <MaterialCommunityIcons name="circle" size={22} color={"gold"} />
      ),
    },
    {
      label: "Low",
      value: "Low",
      icon: () => (
        <MaterialCommunityIcons name="circle" size={22} color={"forestgreen"} />
      ),
    },
  ]);

  const [iconItems, setIconItems] = useState([
    { label: "None", value: null, icon: null },
  ]);

  const [notifyItems, setNotifyItems] = useState([
    { label: "None", value: null },
    { label: "1 day before", value: "1 day" },
    { label: "2 days before", value: "2 day" },
    { label: "3 days before", value: "3 day" },
    { label: "1 week before", value: "1 week" },
    { label: "2 weeks before", value: "2 week" },
  ]);

  // task categorization lists
  const planning = [
    "plan",
    "devise",
    "organize",
    "organise",
    "goal",
    "agenda",
    "strategy",
  ];
  const creative = ["idea", "design", "brainstorm", "create", "invent"];
  const intellective = ["solve", "think", "examine", "analyze"];
  const decisionMaking = [
    "finalize",
    "finalise",
    "select",
    "conclude",
    "complete",
    "classify",
  ];
  const cognitive = [
    "resolve",
    "understand",
    "remember",
    "learn",
    "recall",
    "opinion",
  ];
  const miscellaneous = [
    "buy",
    "get",
    "find",
    "look",
    "order",
    "collect",
    "take",
    "put",
    "bring",
    "reschedule",
    "update",
    "send",
    "make",
    "check",
  ];

  const [iconsToDisplay, setIconsToDisplay] = useState([]);

  // fetch iconItems data
  useEffect(() => {
    const fetchIconItems = async () => {
      const tempArray = [...iconItems];
      const iconItemsDocs = await getDocs(
        collection(firebaseDB, "user", userProfile.uid, "iconItems")
      );
      iconItemsDocs.forEach((doc) => {
        tempArray.push({
          label: doc.data().label,
          value: doc.data().value,
          icon: () => <Text>{doc.data().icon}</Text>,
        });
      });

      setIconItems(tempArray);
    };

    fetchIconItems();
  }, []);

  // get icon items, remove the default null option
  // (that is used in the dropdown picker)
  useEffect(() => {
    const tempArray = [...iconItems];
    const iconArray = [];
    tempArray.map((icon) => {
      if (icon.value != null) {
        iconArray.push(icon);
      }
    });
    setIconsToDisplay(iconArray);
  }, [iconItems]);

  // auto-categorize tasks based on the task title
  useEffect(() => {
    if (autoCategorize) {
      // if task title is null/empty/undefined, set the category to default null
      if (title == null || title == "" || title == undefined) {
        setCategoryValue(null);
      }
      // else set the category according to the title
      else {
        // get a copy of the title
        var taskTitle = [...title];
        // covert it to lowercase for easier word comparison
        // with the task categorization lists above
        taskTitle = taskTitle.toString().toLowerCase();
        // split the task title into words
        taskTitle = taskTitle.toString().split(/(\s+)/);

        // map each word
        taskTitle.map((word) => {
          // remove comma between each character
          word = word.toString().replace(/,/g, "");

          // compare word, check if it exists in the lists above
          if (planning.includes(word)) {
            setCategoryValue("Planning");
          } else if (creative.includes(word)) {
            setCategoryValue("Creative");
          } else if (intellective.includes(word)) {
            setCategoryValue("Intellective");
          } else if (decisionMaking.includes(word)) {
            setCategoryValue("Decision-Making");
          } else if (cognitive.includes(word)) {
            setCategoryValue("Cognitive");
          } else if (miscellaneous.includes(word)) {
            setCategoryValue("Miscellaneous");
          }
        });
      }
    }
  }, [title]);

  // fill the form with task data when edit state is true
  useEffect(() => {
    if (taskEditState) {
      setInputTitle(taskItemForScreen.title);
      setSelectedStartDate(taskItemForScreen.startDate);
      setSelectedEndDate(taskItemForScreen.endDate);
      setCategoryValue(taskItemForScreen.category);
      setPriorityValue(taskItemForScreen.priority);
      setIconValue(taskItemForScreen.icon);
      setNotifyValue(taskItemForScreen.notify);
      setSubtaskList(taskItemForScreen.subtask);
      setCanvasImageList(taskItemForScreen.canvas);
      setImageList(taskItemForScreen.images);
      setFileList(taskItemForScreen.files);
    } else {
      cancelAddNewTask();
    }
  }, [taskEditState]);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused

      return () => {
        // Do something when the screen is unfocused
        // when leaving the screen, set edit state to false
        setTaskEditState(false);
      };
    }, [])
  );

  // unfocus task title text input
  const unfocusTextInput = () => {
    titleInputRef.current.blur();
  };

  //set other dropdowns to close when category dropdown is open
  const onCategoryOpen = useCallback(() => {
    unfocusTextInput();

    setPriorityOpen(false);
    setIconOpen(false);
    setNotifyOpen(false);
  }, []);

  //set other dropdowns to close when priority dropdown is open
  const onPriorityOpen = useCallback(() => {
    unfocusTextInput();

    setCategoryOpen(false);
    setIconOpen(false);
    setNotifyOpen(false);
  }, []);

  //set other dropdowns to close when icon dropdown is open
  const onIconOpen = useCallback(() => {
    unfocusTextInput();

    setCategoryOpen(false);
    setPriorityOpen(false);
    setNotifyOpen(false);
  }, []);

  //set other dropdowns to close when notify dropdown is open
  const onNotifyOpen = useCallback(() => {
    unfocusTextInput();

    setCategoryOpen(false);
    setPriorityOpen(false);
    setIconOpen(false);
  }, []);

  // filter the task data by date, and set it into the date filter state
  const filterDataByState = async (task_data) => {
    // copy task list to new const
    const stateFilter = [...taskList_stateFilter];
    // push into incomplete task by default
    stateFilter[1].data.push(task_data);
    // set to state filter
    setTaskList_stateFilter(stateFilter);
    // Add a new document in collection "IncompleteFilter"
    await setDoc(
      doc(
        firebaseDB,
        "user",
        userProfile.uid,
        "taskList_stateFilter",
        "Incomplete",
        "IncompleteFilter",
        task_data.title
      ),
      task_data
    );
  };

  // filter the task data by date, and set it into the date filter state
  const filterDataByDate = async (task_data) => {
    // Today's date
    const todayDate = new Date();
    const todayDate_formatted = moment(todayDate).format("YYYY-MM-DD");
    // Task End date
    const taskEndDate_formatted = moment(
      task_data.endDate,
      "Do MMM YYYY"
    ).format("YYYY-MM-DD");

    // copy task list to new const
    const dateFilter = [...taskList_dateFilter];

    // if today's date == task end date, categorize it under 'Today' section
    if (todayDate_formatted == taskEndDate_formatted) {
      dateFilter[0].data.push(task_data);

      // Add a new document in collection "todayFilter"
      await setDoc(
        doc(
          firebaseDB,
          "user",
          userProfile.uid,
          "taskList_dateFilter",
          "Today",
          "TodayFilter",
          task_data.title
        ),
        task_data
      );
    }
    // if task end date is after today's date
    else if (moment(taskEndDate_formatted).isAfter(todayDate_formatted)) {
      // if task end date minus 1 day == today's date, categorize it under 'Tomorrow' section
      if (
        moment(taskEndDate_formatted)
          .subtract(1, "days")
          .format("YYYY-MM-DD") == todayDate_formatted
      ) {
        dateFilter[1].data.push(task_data);

        // Add a new document in collection "tomorrowFilter"
        await setDoc(
          doc(
            firebaseDB,
            "user",
            userProfile.uid,
            "taskList_dateFilter",
            "Tomorrow",
            "TomorrowFilter",
            task_data.title
          ),
          task_data
        );
      }
      // else, categorize it under 'Upcoming' section
      else {
        dateFilter[2].data.push(task_data);

        // Add a new document in collection "upcomingFilter"
        await setDoc(
          doc(
            firebaseDB,
            "user",
            userProfile.uid,
            "taskList_dateFilter",
            "Upcoming",
            "UpcomingFilter",
            task_data.title
          ),
          task_data
        );
      }
    }
    // if today's date is after task end date
    else if (moment(todayDate_formatted).isAfter(taskEndDate_formatted)) {
      dateFilter[3].data.push(task_data);

      // Add a new document in collection "overdueFilter"
      await setDoc(
        doc(
          firebaseDB,
          "user",
          userProfile.uid,
          "taskList_dateFilter",
          "Overdue",
          "OverdueFilter",
          task_data.title
        ),
        task_data
      );
    }

    setTaskList_dateFilter(dateFilter);
  };

  // filter tasks by the filterType parsed in, set them to their respective state arrays
  // to be used when viewing filtered tasks in task list screen
  const filterTasks = (
    task_data,
    filterType,
    filterData,
    setFilterData,
    mainCollection
  ) => {
    const tempArray = [...filterData];

    tempArray.map(async (taskItem) => {
      if (filterType == taskItem.header) {
        tempArray[taskItem.id].data.push(task_data);
        // add a new document into the respective collection
        const docRef = doc(
          firebaseDB,
          "user",
          userProfile.uid,
          mainCollection,
          taskItem.header,
          taskItem.header + "Filter",
          task_data.title
        );
        await setDoc(docRef, task_data);
      }
    });

    setFilterData(tempArray);
  };

  // removes old task data from arrays
  const deleteFromArrays = (filterData, setFilterData, mainCollection) => {
    const tempArray = [...filterData];

    tempArray.map((taskItem, taskItemIndex) => {
      taskItem.data.map(async (task, taskIndex) => {
        if (task.title == taskItemForScreen.title) {
          tempArray[taskItemIndex].data.splice(taskIndex, 1);
          // delete the document, by referencing with the document id (which is the original task title)
          const docRef = doc(
            firebaseDB,
            "user",
            userProfile.uid,
            mainCollection,
            taskItem.header,
            taskItem.header + "Filter",
            taskItemForScreen.title
          );
          await deleteDoc(docRef);
        }
      });
    });

    setFilterData(tempArray);
  };

  // add new task to task list, and display it in task screen
  const addNewTask = async () => {


    //make a copy of task list
    const tempArray = [...taskList];

    // save data to push as variable
    var taskData = {
      // id: counter,
      title: title,
      startDate: startDate,
      endDate: endDate,
      category: categoryValue,
      priority: priorityValue,
      icon: iconValue,
      notify: notifyValue,
      subtask: subtaskList,
      canvas: canvasImageList,
      images: imageList,
      files: fileList,
      complete: false,
    };

    // Google
    await AddTaskToGoogleCalender(taskData)

    // if edit state is true, make changes to the task data
    if (taskEditState) {
      tempArray.map((taskItem) => {
        // locate the correct task by title
        if (taskItem.title == taskItemForScreen.title) {
          taskItem.title = title;
          taskItem.endDate = startDate;
          taskItem.endDate = endDate;
          taskItem.category = categoryValue;
          taskItem.priority = priorityValue;
          taskItem.icon = iconValue;
          taskItem.notify = notifyValue;
          taskItem.subtask = subtaskList;
          taskItem.canvas = canvasImageList;
          taskItem.images = imageList;
          taskItem.files = fileList;
          taskItem.complete = false;
        }
      });

      // set task list to be the tempArray
      setTaskList(tempArray);

      // remove old data from the arrays
      deleteFromArrays(
        taskList_stateFilter,
        setTaskList_stateFilter,
        "taskList_stateFilter"
      );
      deleteFromArrays(
        taskList_dateFilter,
        setTaskList_dateFilter,
        "taskList_dateFilter"
      );
      deleteFromArrays(
        taskList_priorityFilter,
        setTaskList_priorityFilter,
        "taskList_priorityFilter"
      );
      deleteFromArrays(
        taskList_categoryFilter,
        setTaskList_categoryFilter,
        "taskList_categoryFilter"
      );
      deleteFromArrays(
        taskList_iconFilter,
        setTaskList_iconFilter,
        "taskList_iconFilter"
      );

      // filter data and set it into different state arrays
      // these are used when filtering tasks
      filterDataByState(taskData);
      filterDataByDate(taskData);
      filterTasks(
        taskData,
        taskData.priority,
        taskList_priorityFilter,
        setTaskList_priorityFilter,
        "taskList_priorityFilter"
      );
      filterTasks(
        taskData,
        taskData.category,
        taskList_categoryFilter,
        setTaskList_categoryFilter,
        "taskList_categoryFilter"
      );
      filterTasks(
        taskData,
        taskData.icon,
        taskList_iconFilter,
        setTaskList_iconFilter,
        "taskList_iconFilter"
      );

      //navigates to task screen after task is added
      navigation.navigate("Task");

      // clears and reset all input after task is added
      cancelAddNewTask();

      setTaskEditState(false);
    }
    // else continue adding the task to list
    else {
      // get list of task titles
      const taskTitles = [];
      tempArray.map((item) => {
        taskTitles.push(item.title);
      });

      // if no task title input, alert user
      if (title == "") {
        alert("Enter task title");
      }
      // dont allow same task title, as i will be using the title as reference
      // for locating the correct task to mark as complete, edit, delete etc.
      else if (taskTitles.includes(title)) {
        alert("Task with same title exists. Enter a new task title");
      }
      // if no task end date is selected, alert user
      else if (endDate == "" || endDate == "Invalid date") {
        alert("Select date range for task");
      } else {
        // push task data into temp array
        tempArray.push(taskData);

        // set task list to be the tempArray
        setTaskList(tempArray);

        // filter data and set it into different state arrays
        // these are used when filtering tasks
        filterDataByState(taskData);
        filterDataByDate(taskData);
        filterTasks(
          taskData,
          taskData.priority,
          taskList_priorityFilter,
          setTaskList_priorityFilter,
          "taskList_priorityFilter"
        );
        filterTasks(
          taskData,
          taskData.category,
          taskList_categoryFilter,
          setTaskList_categoryFilter,
          "taskList_categoryFilter"
        );
        filterTasks(
          taskData,
          taskData.icon,
          taskList_iconFilter,
          setTaskList_iconFilter,
          "taskList_iconFilter"
        );

        //navigates to task screen after task is added
        navigation.navigate("Task");

        // clears and reset all input after task is added
        cancelAddNewTask();
      }
    }
  };

  // cancel add new task
  const cancelAddNewTask = () => {
    // clears and reset all input
    setInputTitle(null);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setCategoryValue(null);
    setPriorityValue(null);
    setIconValue(null);
    setNotifyValue(null);
    setSubtaskList([]);
    setCanvasImage(null);
    setCanvasImageList([]);
    setImageList([]);
    setFileList([]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: TintCol() }}>
      <LinearGradient

        colors={[`${darkmode ? "rgba(0,0,0,0)" : "rgb(255, 255, 255)"}`, `${theme}40`]} // Full opacity to 50% opacity
        style={styles.gradient}
        start={{ x: 0, y: 0.5 }}  // Start from Top
        end={{ x: 0, y: 1 }}    // End at Bottom
      >

        <ScrollView

          style={[styles.container, { marginBottom: tabBarHeight + 25 }]}
        >
          <Image
            source={require('../assets/addTask3.jpg')}  // Replace with your image path
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          <View>
            <Text style={{ fontSize: 22, textAlign: "left", marginBottom: 10,marginTop:4, color: `${theme}`, fontFamily: 'Poppins-Bold', }} >Create New Task</Text>
          </View>
          {/* ENTER TASK TITLE */}
          <TaskTitleInput
            titleInputRef={titleInputRef}
            setInputTitle={setInputTitle}
            title={title}
          />

          {/* SELECT DATE RANGE */}
          <DateSelectionModal
            calendarModalVisible={calendarModalVisible}
            setCalendarModalVisible={setCalendarModalVisible}
            setSelectedStartDate={setSelectedStartDate}
            setSelectedEndDate={setSelectedEndDate}
            startDate={startDate}
            endDate={endDate}
          // setTaskEndDate={setTaskEndDate}
          />

          {/* SELECT CATEGORY */}
          <DropDownPicker
            listMode="SCROLLVIEW"
            zIndex={3000}
            zIndexInverse={1000}
            open={categoryOpen}
            value={categoryValue}
            items={categoryItems}
            setOpen={setCategoryOpen}
            setValue={setCategoryValue}
            setItems={setCategoryItems}
            onOpen={onCategoryOpen}
            placeholder="Select a category"
            placeholderStyle={{ color: darkmode ? "#ffffff" : `${theme}`, fontSize: 16, fontFamily: 'Poppins-Regular'  }}
            textStyle={{ fontSize: 16, color: BackgroundCol(), fontFamily: 'Poppins-Regular' }}
            labelStyle={{ fontWeight: "bold",  fontFamily: 'Poppins-Bold' }}
            ArrowUpIconComponent={({ style }) => (
              <FontAwesome name="caret-up" size={32} color={BackgroundCol()} />
            )}
            ArrowDownIconComponent={({ style }) => (
              <FontAwesome name="caret-down" size={28} color={BackgroundCol()} />
            )}
            TickIconComponent={({ style }) => (
              <FontAwesome5 name="check" size={20} color={TintCol()} />
            )}
            dropDownContainerStyle={[
              styles.dropdownContainer,
              { backgroundColor: TintCol(), borderColor: BackgroundCol(), fontFamily: 'Poppins-Regular' },
            ]}
            listItemLabelStyle={{ color: BackgroundCol() }}
            selectedItemContainerStyle={{ backgroundColor: BackgroundCol() }}
            selectedItemLabelStyle={{ color: TintCol(), fontWeight: "bold" }}
            style={[
              styles.dropdownPicker,
              {
                backgroundColor: `${theme}40`, // Set dropdown button background to black
                borderColor: BackgroundCol(), fontFamily: 'Poppins-Regular'
              },
            ]}
          />

          <View
            style={{
              flexDirection: "row",
              marginBottom: "2%",
              alignItems: "center",
              zIndex: 2000,
              zIndexInverse: 2000,
            }}
          >
            <View style={{ width: "44%" }}>
              {/* SELECT PRIORITY */}
              <DropDownPicker
                listMode="SCROLLVIEW"
                zIndex={2000}
                zIndexInverse={2000}
                open={priorityOpen}
                value={priorityValue}
                items={priorityItems}
                setOpen={setPriorityOpen}
                setValue={setPriorityValue}
                setItems={setPriorityItems}
                onOpen={onPriorityOpen}
                placeholder="Priority"
                placeholderStyle={{ color: darkmode ? "#ffffff" : `${theme}`, fontSize: 16, fontFamily: 'Poppins-Regular' }}
                textStyle={{ fontSize: 16, color: BackgroundCol() }}
                labelStyle={{ fontWeight: "bold",  fontFamily: 'Poppins-Bold' }}
                ArrowUpIconComponent={({ style }) => (
                  <FontAwesome name="caret-up" size={32} color={BackgroundCol()} />
                )}
                ArrowDownIconComponent={({ style }) => (
                  <FontAwesome name="caret-down" size={28} color={BackgroundCol()} />
                )}
                TickIconComponent={({ style }) => (
                  <FontAwesome5 name="check" size={20} color={TintCol()} />
                )}
                dropDownContainerStyle={[
                  styles.dropdownContainer,
                  { backgroundColor: TintCol(), borderColor: BackgroundCol(),fontFamily: 'Poppins-Regular' },
                ]}
                listItemLabelStyle={{ color: BackgroundCol() }}
                selectedItemContainerStyle={{ backgroundColor: BackgroundCol() }}
                selectedItemLabelStyle={{ color: TintCol(), fontWeight: "bold",fontFamily: 'Poppins-Boldr' }}
                style={[
                  styles.dropdownPicker,
                  {
                    backgroundColor: `${theme}40`, // Set dropdown button background to black
                    borderColor: BackgroundCol(),fontFamily: 'Poppins-Regular'
                  },
                ]}
              />
            </View>

            <View style={{ width: "44%", marginLeft: "2%" }}>
              {/* SELECT ICON */}
              <DropDownPicker
                searchable={true}
                listMode="SCROLLVIEW"
                zIndex={2000}
                zIndexInverse={2000}
                open={iconOpen}
                value={iconValue}
                items={iconItems}
                setOpen={setIconOpen}
                setValue={setIconValue}
                setItems={setIconItems}
                onOpen={onIconOpen}
                placeholder="Icon"
                placeholderStyle={{ color: darkmode ? "#ffffff" : `${theme}`, fontSize: 16,fontFamily: 'Poppins-Regular' }}//it is changing the text color of place holder
                textStyle={{ fontSize: 16, color: BackgroundCol() }}
                labelStyle={{ fontWeight: "bold",fontFamily: 'Poppins-Regular' }}
                ArrowUpIconComponent={({ style }) => (
                  <FontAwesome name="caret-up" size={32} color={BackgroundCol()} />
                )}
                ArrowDownIconComponent={({ style }) => (
                  <FontAwesome name="caret-down" size={28} color={BackgroundCol()} />
                )}
                TickIconComponent={({ style }) => (
                  <FontAwesome5 name="check" size={20} color={TintCol()} />
                )}
                dropDownContainerStyle={[
                  styles.dropdownContainer,
                  { backgroundColor: TintCol(), borderColor: BackgroundCol(),fontFamily: 'Poppins-Regular' },
                ]}
                listItemLabelStyle={{ color: BackgroundCol() }}
                selectedItemContainerStyle={{ backgroundColor: BackgroundCol() }}
                selectedItemLabelStyle={{ color: TintCol(), fontWeight: "bold" }}
                searchTextInputStyle={{ borderWidth: 0 }}
                searchContainerStyle={{ borderBottomColor: BackgroundCol(),fontFamily: 'Poppins-Regular' }}
                style={[
                  styles.dropdownPicker,
                  {
                    backgroundColor: `${theme}40`, // Set dropdown button background to black
                    borderColor: BackgroundCol(),fontFamily: 'Poppins-Regular'
                  },
                ]}
              />
            </View>

            {/* ADD ICON ITEM */}
            <View
              style={{
                width: "8%",
                marginHorizontal: "2%",
                marginBottom: "2.5%",
              }}
            >
              <AddIconItem
                iconsToDisplay={iconsToDisplay}
                setIconsToDisplay={setIconsToDisplay}
                iconItems={iconItems}
                setIconItems={setIconItems}
                setIconValue={setIconValue}
                iconModalVisible={iconModalVisible}
                setIconModalVisible={setIconModalVisible}
                iconLabel={iconLabel}
                setInputIconLabel={setInputIconLabel}
                icon={icon}
                setInputIcon={setInputIcon}
              />
            </View>
          </View>

          {/* SELECT NOTIFY TIME */}
          <DropDownPicker
            listMode="SCROLLVIEW"
            zIndex={1000}
            zIndexInverse={3000}
            open={notifyOpen}
            value={notifyValue}
            items={notifyItems}
            setOpen={setNotifyOpen}
            setValue={setNotifyValue}
            setItems={setNotifyItems}
            onOpen={onNotifyOpen}
            placeholder="Notify"
            placeholderStyle={{ color: darkmode ? "#ffffff" : `${theme}`, fontSize: 16,fontFamily: 'Poppins-Regular' }}
            textStyle={{ fontSize: 16, color: BackgroundCol() }}
            labelStyle={{ fontWeight: "bold",fontFamily: 'Poppins-Regular' }}
            ArrowUpIconComponent={({ style }) => (
              <FontAwesome name="caret-up" size={32} color={BackgroundCol()} />
            )}
            ArrowDownIconComponent={({ style }) => (
              <FontAwesome name="caret-down" size={28} color={BackgroundCol()} />
            )}
            TickIconComponent={({ style }) => (
              <FontAwesome5 name="check" size={20} color={TintCol()} />
            )}
            dropDownContainerStyle={[
              styles.dropdownContainer,
              { backgroundColor: TintCol(), borderColor: BackgroundCol(),fontFamily: 'Poppins-Regular' },
            ]}
            listItemLabelStyle={{ color: BackgroundCol() }}
            selectedItemContainerStyle={{ backgroundColor: BackgroundCol() }}
            selectedItemLabelStyle={{ color: TintCol(), fontWeight: "bold",fontFamily: 'Poppins-Regular' }}
            style={[
              styles.dropdownPicker,
              {
                backgroundColor: `${theme}40`, // Set dropdown button background to black
                borderColor: BackgroundCol(),fontFamily: 'Poppins-Regular'
              },
            ]}
          />

          {/* SUBTASK */}
          <Subtask
            subtaskList={subtaskList}
            setSubtaskList={setSubtaskList}
            subtask={subtask}
            setSubtask={setSubtask}
          />

      

          {/* ATTACHMENTS */}
          <AttachmentComponent
            image={image}
            setImage={setImage}
            imageList={imageList}
            setImageList={setImageList}
            file={file}
            setFile={setFile}
            fileList={fileList}
            setFileList={setFileList}
          />

          {/* BUTTONS */}

          {/* CANCEL ADD NEW TASK BUTTON */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: "10%", marginBottom: "5%",  }}>

            <TouchableOpacity
              onPress={() => {
                cancelAddNewTask();
              }}
              style={[styles.cancelTaskBtn, { backgroundColor: "#FF000070" }]}
            >
              <Text style={{ fontSize: 14, color: "white", width: "100%", paddingHorizontal: "2%",fontFamily: 'Poppins-Regular' }}>Cancel</Text>
            </TouchableOpacity>
            {/* ADD NEW TASK BUTTON */}
            <TouchableOpacity
              style={[styles.submitTaskBtn, { backgroundColor: "#00640080" }]}
              onPress={() => {
                addNewTask();
              }}
            >
              <Text style={{ fontSize: 14, color: "white", width: "100%", paddingHorizontal: "2%",fontFamily: 'Poppins-Regular' }}>Create</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </LinearGradient>

    </SafeAreaView>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "13%",
    marginHorizontal: "3%",
  },
  dropdownPicker: {
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: "3%",
    marginTop: "1%",
  },
  dropdownPlaceholder: {
    color: "lightgrey",
    fontSize: 16,
  },
  dropdownContainer: {
    borderWidth: 0,
    borderTopWidth: 1,

  },
  cancelAddNewTaskButton: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderRadius: 25,
    borderColor: "crimson",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "3%",
  },
  addNewTaskButton: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderRadius: 25,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  submitTaskBtn: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderWidth: 0,
    borderColor: "green",
    borderRadius: 0,
  },
  cancelTaskBtn: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderWidth: 0,
    borderColor: "red",
    borderRadius: 0,
  },
  gradient: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,  // Adjust opacity (1 = full, 0.5 = 50%)
    zIndex: -1,  // Sends it behind everything
  },
});

