<template>
  <div class="playground">
    <h1>This is the playground page</h1>
    <router-link to="layout-algorithm">Layout Algorithm</router-link> |
    <router-link to="idb-api">indexeddb</router-link> |
    <router-link to="firebase-cloud-storage"
      >Firebase Cloud Storage</router-link
    >
    |
    <router-link to="cloud-api">Cloud API</router-link>

    <router-view />
  </div>
</template>

<script>
export default {
  name: "playground"
};
</script>

<style lang="scss">
.playground a.router-link-active {
  color: #3eaf7c;
}
</style>
