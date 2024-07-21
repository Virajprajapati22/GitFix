// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
import { GithubAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBcMQK9sPhtG1NK5X--EAQc4HQQEmHQcHU",
    authDomain: "gitfix-29190.firebaseapp.com",
    projectId: "gitfix-29190",
    storageBucket: "gitfix-29190.appspot.com",
    messagingSenderId: "357979293743",
    appId: "1:357979293743:web:f71e38792506a6b18a5eda",
    measurementId: "G-GH9BRJQPBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('repo');
githubProvider.setCustomParameters({
    'allow_signup': 'false'
});

export { auth, githubProvider };


// npm install -g firebase-tools
// https://gitfix-29190.firebaseapp.com/__/auth/handler