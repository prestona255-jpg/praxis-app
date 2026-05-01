// =====================================================================
// integrations.js -- Praxis external integrations layer
//
// At 1.1: holds the Claude proxy URL constant only. Praxis routes
// Claude calls through a Netlify Function (HQ uses a Cloudflare
// Worker -- divergence is intentional). ISBN, Firebase, and other
// adapters land in later sub-stages.
// =====================================================================

'use strict';

var CLAUDE_PROXY_URL = '/.netlify/functions/claude-proxy';

var firebaseConfig = {
  apiKey:            "AIzaSyDegS-mT0hrBVuptm-I-ByrogeLmJis6rE",
  authDomain:        "praxis-b25d6.firebaseapp.com",
  projectId:         "praxis-b25d6",
  storageBucket:     "praxis-b25d6.firebasestorage.app",
  messagingSenderId: "1013316338014",
  appId:             "1:1013316338014:web:19e7e7673f94f6fcca8fcf"
};
firebase.initializeApp(firebaseConfig);

// Auth state is persisted to localStorage via sv()/ls() so
// getCurrentUser() works synchronously across reloads. Firebase's own
// auth observer is not wired in 1.3 -- added in a later sub-stage
// when the app needs reactive auth state.
function signInWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    var u = result.user;
    var userObj = {
      uid:         u.uid,
      displayName: u.displayName,
      email:       u.email,
      photoURL:    u.photoURL
    };
    sv('praxis_user', userObj);
    console.log('signInWithGoogle: success', userObj);
  }).catch(function (err) {
    console.warn('signInWithGoogle: error', err);
  });
}

function signOut() {
  firebase.auth().signOut().then(function () {
    sv('praxis_user', null);
    console.log('signOut: success');
  }).catch(function (err) {
    sv('praxis_user', null);
    console.warn('signOut: error', err);
  });
}

function getCurrentUser() {
  return ls('praxis_user', null);
}

console.log('integrations.js loaded');
