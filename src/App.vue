<template>
  <div id="app">
    <h1>Michael's MindMap</h1>

    <div id="nav">
      <router-link to="/">Home</router-link>
      <template v-if="NODE_ENV === 'development'">
        | <router-link to="/playground/">Playground</router-link>
      </template>
    </div>

    <router-view />

    <base-toast />

    <upgrade-dialog v-if="prompt" @upgrade="upgrade" />
  </div>
</template>

<script>
import BaseToast from "@/components/BaseToast";
import UpgradeDialog from "@/components/UpgradeDialog";

export default {
  components: { BaseToast, UpgradeDialog },

  created() {
    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        this.prompt = true;
      });
    }
  },

  methods: {
    upgrade() {
      this.prompt = false;
      this.$workbox.messageSW({ type: "SKIP_WAITING" });
    }
  },

  data() {
    return {
      NODE_ENV: process.env.NODE_ENV,
      prompt: false
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
