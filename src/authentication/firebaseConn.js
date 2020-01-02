import firebase from "firebase/app";
import "firebase/auth";

const FIREBASE_CONFIG = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MSG_SENDER_ID
};
// firebase.initializeApp(FIREBASE_CONFIG);

let _firebase;
let _auth;

function initFirebaseAuth() {
  if (_auth) {
    throw new Error("Firebase AUTH already initialized");
  } else {
    console.log("Connected successfully to firebase");
    firebase.initializeApp(FIREBASE_CONFIG);
    _firebase = firebase;
    _auth = firebase.auth();
  }
}

function AUTH() {
  if (_auth) {
    return _auth;
  } else {
    throw new Error("Firebase AUTH not initialized");
  }
}

function FIREBASE() {
  if (_firebase) {
    return _firebase;
  } else {
    throw new Error("Firebase not initialized");
  }
}

async function getAUTHidToken() {
  try {
    const idToken = await _auth.currentUser
      .getIdToken(/* forceRefresh */ true)
      .then(idToken => {
        return idToken;
      });
    return idToken;
  } catch (error) {
    throw new Error(error);
  }
}

async function registerEmailPass(userInfo) {
  try {
    const user = await _auth
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then(result => {
        return result.user;
      });
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function signInEmailPass(userInfo) {
  try {
    const user = await _auth
      .signInWithEmailAndPassword(userInfo.email, userInfo.password)
      .then(result => {
        return result.user;
      });
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function signInProvider(social) {
  try {
    var provider;
    if (social == "google") {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (social == "facebook") {
      provider = new firebase.auth.FacebookAuthProvider();
    } else if (social == "twitter") {
      provider = new firebase.auth.TwitterAuthProvider();
    } else if (social == "github") {
      provider = new firebase.auth.GithubAuthProvider();
    } else {
      throw new Error("Unrecognized provider");
    }

    const user = await _auth.signInWithPopup(provider).then(result => {
      return result.user;
    });
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function signOut() {
  try {
    _auth.signOut();
  } catch (error) {
    throw new Error(error);
  }
}

async function resetPassword(email) {
  try {
    _auth.sendPasswordResetEmail(email);
  } catch (error) {
    throw new Error(error);
  }
}

async function updateDisplayName(user, newName) {
  try {
    user.updateProfile({
      displayName: newName
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function sendVerificationEmail(user) {
  try {
    user.sendEmailVerification();
  } catch (error) {
    throw new Error(error);
  }
}

export {
  initFirebaseAuth,
  FIREBASE,
  AUTH,
  getAUTHidToken,
  registerEmailPass,
  signInEmailPass,
  signInProvider,
  signOut,
  resetPassword,
  updateDisplayName,
  sendVerificationEmail
};
