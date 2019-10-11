<template>
  <div class="playground">
    <h1>This is the playground page</h1>
    <router-link to="layout-algorithm">Layout Algorithm</router-link>

    <router-view />
  </div>
</template>

<script>
export default {
  name: "playground"
};
</script>
