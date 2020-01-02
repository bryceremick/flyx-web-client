/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import router from "./src/router/index";
import { verifyNewUser } from "./src/services/Api";
import {
  signInProvider,
  signInEmailPass,
  registerEmailPass,
  signOut,
  resetPassword,
  updateDisplayName,
  sendVerificationEmail,
  getAUTHidToken
} from "./src/authentication/firebaseConn";
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
    isInit: false
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
    },
    setInitState(state, b) {
      state.isInit = b;
    },
    clearState(state) {
      state.USER = null;
      state.remainingSearches = null;
      state.isVIP = null;
      state.isBeta = null;
      state.isInit = false;
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
    },
    isStateInit(state) {
      return state.isInit;
    }
  },
  actions: {
    // Sign in with email and password
    async signIn(context, userInfo) {
      try {
        let loading = this._vm.$loading.open();
        const user = await signInEmailPass(userInfo);

        if (user.emailVerified) {
          const idToken = await getAUTHidToken();
          verifyNewUser(idToken).then(response => {
            const payload = response.data.data;
            let userInfo = {
              user: user,
              remainingSearches: payload.remainingSearches,
              VIP: payload.VIP,
              beta: payload.beta,
              idToken: idToken
            };
            context.dispatch("initState", userInfo);
            loading.close();
            router.push("/app");
            context.dispatch("printState");
          });
        } else {
          context.dispatch("signOut");
          loading.close();
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    },
    // Sign in with provider
    async signInWithSocial(context, social) {
      try {
        const user = await signInProvider(social);
        let loading = this._vm.$loading.open();
        const idToken = await getAUTHidToken();
        verifyNewUser(idToken).then(response => {
          const payload = response.data.data;
          let userInfo = {
            user: user,
            remainingSearches: payload.remainingSearches,
            VIP: payload.VIP,
            beta: payload.beta,
            idToken: idToken
          };
          context.dispatch("initState", userInfo);
          loading.close();
          router.push("/app");
          context.dispatch("printState");
        });
      } catch (error) {
        console.log(error);
      }
    },
    // Sign out
    async signOut(context) {
      signOut()
        .then(() => {
          context.commit("clearState");
          router.push("/");
        })
        .catch(error => {
          console.log(error);
        });
    },
    // Register w/ email and password
    async register(context, userInfo) {
      let loading = this._vm.$loading.open();
      try {
        const user = await registerEmailPass(userInfo);
        await updateDisplayName(user, userInfo.name);
        await sendVerificationEmail(user);
        context.dispatch("signOut");
        loading.close();
      } catch (error) {
        console.log(error);
        loading.close();
      }
    },
    // Reset password
    resetPassword(context, emailAddr) {
      resetPassword(emailAddr).catch(error => {
        console.log(error);
      });
    },
    // Initialize the state (and local storage)
    initState(context, userInfo) {
      context.commit("initUser", userInfo.user);
      context.commit("setRemainingSearches", userInfo.remainingSearches);
      context.commit("setVIP", userInfo.VIP);
      context.commit("setBeta", userInfo.beta);
      context.commit("setIDToken", userInfo.idToken);
      context.commit("setInitState", true);
    },
    // print the current content of state to console
    printState(context) {
      console.log(`
        Email:                ${context.getters.currUser.email}
        Remaining Searches:   ${context.getters.currUserRemainingSearches}
        isVIP:                ${context.getters.currUserIsVIP}
        isBeta:               ${context.getters.currUserIsBeta}
      `);
    }
  },
  plugins: [vuexLocalStorage.plugin]
});
