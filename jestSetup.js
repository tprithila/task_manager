import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// Mock Expo AuthSession
jest.mock("expo-auth-session", () => ({
    makeRedirectUri: jest.fn(() => "mocked-redirect-uri"),
    startAsync: jest.fn(() =>
        Promise.resolve({
            type: "success",
            params: { access_token: "mocked-token" },
        })
    ),
}));
jest.mock("react-native-screens", () => ({
    enableScreens: jest.fn(),
}));