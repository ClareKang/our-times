import firebase from 'firebase';
import * as FirebaseHelper from './firebase-helper';

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;

const config = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId,
};

export const FirebaseApp = firebase.initializeApp(config);
export const FirebaseAuth = FirebaseApp.auth();
export const FirebaseDb = FirebaseApp.database();

export const currentUser = FirebaseHelper.currentUser;
export const isAdmin = FirebaseHelper.isAdmin;

// FIREBASE TOOL OBJECT LITERAL
const FireBaseTools = {
  signIn: (callback = () => {}) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return FirebaseAuth
      .signInWithPopup(provider)
      .then(result => {
        // save user to localstorage
        FirebaseHelper
          .fetchUserObject(result)
          .then(FireBaseTools.getAdmins)
          .then(callback);
          // window.location.href = '/';
      })
      .catch((error) => {
        // Handle Errors here.
        const { code, message } = error;
        alert(`[${code}] ${message}`);
        console.log(error);
      });
  },
  signOut: (callback = () => {}) => {
    return FirebaseAuth
      .signOut()
      .then(() => {
        // Sign-out successful and clear data.
        window.localStorage.clear();
        if (typeof callback === 'function') {
          callback();
        } else {
          window.location.reload();
        }
      });
  },
  getAdmins: (callback = () => {}) => {
    const user = currentUser();
    return FirebaseDb.ref(`admins/${user.uid}`)
      .on('value', (snapshot) => {
        if (snapshot && snapshot.exists()) {
          FirebaseHelper.updateUserObject({ permission: 'ADMIN' });
        }
      });
  },
};

// export FirebaseTools
export default FireBaseTools;
