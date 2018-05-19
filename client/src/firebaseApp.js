import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyDRUjLNHJrBPCaXmxqmDBrdiNjZbNT-T6g",
  authDomain: "money-io-hhk.firebaseapp.com",
  databaseURL: "https://money-io-hhk.firebaseio.com",
  projectId: "money-io-hhk",
  storageBucket: "money-io-hhk.appspot.com",
  messagingSenderId: "404211310182"
};
var firebaseApp = firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const database = firebase.database();

export default firebaseApp;