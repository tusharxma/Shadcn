// Import the functions you need from the SDKs you need
import { getApps, initializeApp, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { collection, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAo98cFQZdtYvOqeX9otLm00FlNyNZPHhs',
  authDomain: 'shadcn-next-c488d.firebaseapp.com',
  projectId: 'shadcn-next-c488d',
  storageBucket: 'shadcn-next-c488d.appspot.com',
  messagingSenderId: '870683164189',
  appId: '1:870683164189:web:48f97eb03a9916261e50f4',
  measurementId: 'G-TWJQYHHF2F'
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let analytics;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const db = getFirestore();

export const auth = getAuth();
// const colRef = collection(db,"users")
// getDocs(colRef)
// .then((snapshot) => {
//  let books = [];
//  snapshot.docs.forEach((doc)=> {
//    books.push({...doc.data(), id : doc.id})

//  })
// }).catch(error => console.log(error))
