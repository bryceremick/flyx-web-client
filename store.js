/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import firebase from "firebase/app";
// import "firebase/auth";
import Api from "./src/services/Api";
import { Snackbar } from "buefy/dist/components/snackbar";
// import { LoadingProgrammatic as Loading} from "buefy/dist/components/loading";
// import { Toast } from 'buefy/dist/components/toast'

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage, // or window.sessionStorage or localForage instance.
  // Function that passes the state and returns the state with only the objects you want to store.
  reducer: state => ({
    USER: state.USER,
    remainingSearches: state.remainingSearches,
    isVIP: state.isVIP,
    isBeta: state.isBeta,
    idToken: state.idToken
  })
});

export const store = new Vuex.Store({
  state: {
    USER: null,
    remainingSearches: null,
    isVIP: null,
    isBeta: null,
    idToken: null
  },
  mutations: {
    initUser(state, firebaseUser) {
      state.USER = firebaseUser;
    },
    setRemainingSearches(state, n) {
      state.remainingSearches = n;
    },
    setVIP(state, v) {
      state.isVIP = v;
    },
    setBeta(state, b) {
      state.isBeta = b;
    },
    setIDToken(state, token) {
      state.idToken = token;
    }
  },
  getters: {
    currUser(state) {
      return state.USER;
    },
    currUserID(state) {
      return state.USER.uid;
    },
    currUserRemainingSearches(state) {
      return state.remainingSearches;
    },
    currUserIDToken(state) {
      return state.idToken;
    },
    currUserIsVIP(state) {
      return state.isVIP;
    },
    currUserIsBeta(state) {
      return state.isBeta;
    }
  },
  actions: {
    // Sign in with email and password
    signIn(context, userInfo) {
      // Open Loading Spinner
      const loadingComponent = this._vm.$loading.open();

      firebase
        .auth()
        .signInWithEmailAndPassword(userInfo.email, userInfo.password)
        .then(result => {
          // Close Loading Spinner
          loadingComponent.close();

          if (result.user.emailVerified) {
            Api()
              .post(
                "/user/verify",
                {},
                {
                  headers: {
                    Authorization: context.getters.currUserIDToken
                  }
                }
              )
              .then(response => {
                const payload = response.data.data;
                context.commit(
                  "setRemainingSearches",
                  payload.remainingSearches
                );
                context.commit("setVIP", payload.VIP);
                context.commit("setBeta", payload.beta);
              });

            // if user email is NOT verified, alert them
          } else {
            this._vm.$toast.open({
              message: "Please verify your email before signing in",
              position: "is-top",
              type: "is-danger"
            });
          }
        })
        .catch(error => {
          // Close Loading Spinner
          loadingComponent.close();
          // Error Handling
          this._vm.$toast.open({
            message: error.message,
            position: "is-top",
            type: "is-danger"
          });
        });
    },
    // Sign in with provider
    signInWithSocial(context, social) {
      if (social == "google") {
        var provider = new firebase.auth.GoogleAuthProvider();
      } else if (social == "facebook") {
        var provider = new firebase.auth.FacebookAuthProvider();
      } else if (social == "twitter") {
        var provider = new firebase.auth.TwitterAuthProvider();
      } else if (social == "github") {
        var provider = new firebase.auth.GithubAuthProvider();
      } else {
        alert("provider error");
      }

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {

          Api()
            .post(
              "/user/verify",
              {},
              {
                headers: {
                  Authorization: context.getters.currUserIDToken
                }
              }
            )
            .then(response => {
              const payload = response.data.data;
              context.commit("setRemainingSearches", payload.remainingSearches);
              context.commit("setVIP", payload.VIP);
              context.commit("setBeta", payload.beta);
            });
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          // alert(errorMessage);
        });
    },
    // Sign out
    signOut() {
      firebase
        .auth()
        .signOut()
        .catch(error => {
          // Error Handling
          this._vm.$toast.open({
            message: error.message,
            position: "is-top",
            type: "is-danger"
          });
        });
    },
    // Register with email and password
    register(context, userInfo) {
      // Open Loading Spinner
      const loadingComponent = this._vm.$loading.open();

      firebase
        .auth()
        .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
        .then(result => {
          // Set user display name (in google auth)
          result.user
            .updateProfile({
              displayName: userInfo.name
            })
            .then(function() {
              // Update successful.
            })
            .catch(function(error) {
              // Close Loading Spinner
              loadingComponent.close();
              // An error happened.
              alert(`updated user error: ${error}`);
            });

          // Send verification email to users email address
          result.user
            .sendEmailVerification()
            .then(function() {
              // Close Loading Spinner
              loadingComponent.close();

              // Email sent.
              Snackbar.open({
                message: "Verification email sent to your email address!",
                position: "is-bottom-left"
              });
            })
            .catch(function(error) {
              // Close Loading Spinner
              loadingComponent.close();
              // An error happened.
              alert(`email verification error: ${error}`);
            });
        })
        .catch(error => {
          // Close Loading Spinner
          loadingComponent.close();

          this._vm.$toast.open({
            message: error.message,
            position: "is-top",
            type: "is-danger"
          });
          // Error Handling
          // alert(error.message);
        });
    },
    resetPassword(context, emailAddr) {
      // Open Loading Spinner
      const loadingComponent = this._vm.$loading.open();

      firebase
        .auth()
        .sendPasswordResetEmail(emailAddr)
        .then(function() {
          // Close Loading Spinner
          loadingComponent.close();

          // Email sent.
          Snackbar.open({
            message: "Password reset email sent to specifed email address",
            position: "is-bottom-left"
          });
        })
        .catch(function(error) {
          // Close Loading Spinner
          loadingComponent.close();
          // An error happened.
          alert(`email verification error: ${error}`);
        });
    }
  },
  plugins: [vuexLocalStorage.plugin]
});
