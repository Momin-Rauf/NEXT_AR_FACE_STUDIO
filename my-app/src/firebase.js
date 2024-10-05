// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBksxNyFREGRgWU_HZzTvJjOzeUQoS0QLI",
  authDomain: "ar-face-studio.firebaseapp.com",
  projectId: "ar-face-studio",
  storageBucket: "ar-face-studio.appspot.com",
  messagingSenderId: "1043605697731",
  appId: "1:1043605697731:web:de1af1428f004867cd1e76",
  measurementId: "G-N1ZEK470GF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };