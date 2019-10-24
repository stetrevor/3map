<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <template v-if="NODE_ENV === 'development'">
        | <router-link to="/playground/">Playground</router-link>
      </template>
    </div>
    <router-view />

    <base-toast />
  </div>
</template>

<script>
import BaseToast from "@/components/BaseToast";

export default {
  components: { BaseToast },

  data() {
    return {
      NODE_ENV: process.env.NODE_ENV
    };
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  margin-top: 24px;

  #nav {
    margin-bottom: 48px;
  }

  a.router-link-active {
    color: #3eaf7c;
  }
}
</style>
