import firebase from 'firebase';

// save firabase user to local storage from firebase
const setUser = obj => (
  new Promise((resolve, reject) => {
    const user = {
      email: obj.user.email,
      uid: obj.user.uid,
      displayName: obj.user.displayName,
      refreshToken: obj.user.refreshToken,
      permissions: [],
    };
    window.localStorage.setItem('currentUser', JSON.stringify(user));
    const userObject = window.localStorage.getItem('currentUser');
    resolve(JSON.parse(userObject));
  })
);

export default class FirebaseTools {
  constructor() {
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
    this._postPath = process.env.REACT_APP_FIREBASE_POST_PATH;
    this._in = null;
    this._out = null;
    this._user = null;
    this._firebaseApp = firebase.initializeApp(config);
    this._firebaseAuth = this._firebaseApp.auth();
    this._firebaseDb = this._firebaseApp.database();
  }
  get user() {
    return this._user;
  }
  get isAdmin() {
    return this._user.permissions.indexOf('ADMIN') > -1;
  }
  get auth() {
    return this._firebaseAuth;
  }
  get database() {
    return this._firebaseDb;
  }
  getToday(date) {
    const getInTime = new Promise((resolve) => {
      this._firebaseDb
        .ref(`${this._postPath}/${this.user.uid}/${date}`)
        .equalTo('IN', 'type')
        .orderByChild('timestamp')
        .limitToFirst(1)
        .on('child_added', snapshot => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            resolve(val.timestamp);
          }
          resolve(null);
        });
    });
    const getOutTime = new Promise((resolve) => {
      this._firebaseDb
        .ref(`${this._postPath}/${this.user.uid}/${date}`)
        .equalTo('OUT', 'type')
        .orderByChild('timestamp')
        .limitToLast(1)
        .on('child_added', snapshot => {
          if (snapshot.exists()) {
            const val = snapshot.val();
            resolve(val.timestamp);
          }
          resolve(null);
        });
    });
    return Promise.all(getInTime(), getOutTime())
      .then((value) => {
        this._in = value[0];
        this._out = value[1];
      });
  }
  getWeekly(week) {

  }
  signIn() {
    // get firebase user is admin from firebase
    const getIsAdmin = uid => (
      new Promise(resolve => (
        this._firebaseDb.ref(`admins/${uid}`)
          .on('value', (snapshot) => {
            resolve(snapshot && snapshot.exists());
          })
      ))
    );
    const provider = new firebase.auth.GoogleAuthProvider();
    return this._firebaseAuth
      .signInWithPopup(provider)
      .then((result) => {
        // save user to localstorage
        return Promise
          .all([setUser(result), getIsAdmin(result.user.uid)])
          .then((value) => {
            const user = result[0];
            const isAdmin = result[1];
            if (isAdmin) {
              user.permissions.push('ADMIN');
            }
            this._user = user;
            return user;
          })
          .catch(this.error);
      })
      .catch(this.error);
  }
  signOut() {
    return this._firebaseAuth
      .signOut()
      .then(() => {
        // Sign-out successful and clear data.
        this._user = null;
        window.localStorage.clear();
        window.location.reload();
      })
      .catch(this.error);
  }
  updateDb(dbPath, updates) {
    const newPostKey = this._firebaseDb.ref(dbPath).push().key;
    return this._firebaseDb.ref().update(updates, error => {
      if (error) {
        alert(`Data could not be saved. ${error}`);
        console.error(error);
      }
    });
  }
  error(error) {
    // Handle Errors here.
    const { code, message } = error;
    alert(`[${code}] ${message}`);
    console.error(error);
  }
}
