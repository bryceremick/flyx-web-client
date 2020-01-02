<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { AUTH } from "./authentication/firebaseConn";

export default {
  name: "App",
  mounted() {
    // On auth state change...
    AUTH().onAuthStateChanged(user => {
      // if user is logged in
      if (user) {
        console.log(`${user.email} is logged in`);
      } else {
        console.log("user is logged out");
      }
    });
  }
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Fredoka+One");
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700");
@import url("https://fonts.googleapis.com/css?family=Nunito:300,400,600,700");
@import "~bulma/sass/utilities/_all";

// Set your colors
// $primary: #2ED199;
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #6487a5;
$primary-invert: findColorInvert($primary);

$secondary: #2ed199;
$secondary-invert: findColorInvert($secondary);

$dark: #4a4a4a;
$dark-invert: findColorInvert($dark);

$accent: #22b4de;
$accent-invert: findColorInvert($accent);

$danger: #ff6b6b;
$danger-invert: findColorInvert($danger);

$google: #4688f1;
$google-invert: findColorInvert($google);

$facebook: #466bae;
$facebook-invert: findColorInvert($facebook);

$twitter: #33a4ec;
$twitter-invert: findColorInvert($twitter);

$github: #3f4347;
$github-invert: findColorInvert($github);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
  "accent": (
    $accent,
    $accent-invert
  ),
  "white": (
    $white,
    $black
  ),
  "black": (
    $black,
    $white
  ),
  "light": (
    $light,
    $light-invert
  ),
  "dark": (
    $dark,
    $dark-invert
  ),
  "primary": (
    $primary,
    $primary-invert
  ),
  "secondary": (
    $secondary,
    $secondary-invert
  ),
  "info": (
    $info,
    $info-invert
  ),
  "success": (
    $success,
    $success-invert
  ),
  "warning": (
    $warning,
    $warning-invert
  ),
  "danger": (
    $danger,
    $danger-invert
  ),
  "google": (
    $google,
    $google-invert
  ),
  "facebook": (
    $facebook,
    $facebook-invert
  ),
  "twitter": (
    $twitter,
    $twitter-invert
  ),
  "github": (
    $github,
    $github-invert
  )
);

@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
