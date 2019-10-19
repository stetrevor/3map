import * as firebase from "firebase/app";

export default function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyCF7jKGdLlbIQCjy4efCFBMbWjPq6I07QE",
    authDomain: "app-3map.firebaseapp.com",
    databaseURL: "https://app-3map.firebaseio.com",
    projectId: "app-3map",
    storageBucket: "app-3map.appspot.com",
    messagingSenderId: "632402793356",
    appId: "1:632402793356:web:2a6f8c75c4ad824cd5fca9",
    measurementId: "G-D7TKN9ZC6W"
  };

  firebase.initializeApp(firebaseConfig);

  return firebase;
}
