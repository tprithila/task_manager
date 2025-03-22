import "@firebase/firestore";
import '@firebase/auth';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTYCNMJ84jvyQIDvK2swl_OobiQahQfl4",
  authDomain: "fyp-management-59c2f.firebaseapp.com",
  projectId: "fyp-management-59c2f",
  storageBucket: "fyp-management-59c2f.firebasestorage.app",
  messagingSenderId: "84457559428",
  appId: "1:84457559428:web:2a79fe2576d9377dceb9d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const firebaseDB = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
});
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export { firebaseDB, auth, storage };