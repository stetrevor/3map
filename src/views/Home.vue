<template>
  <div class="home">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "home"
};
</script>

<style lang="scss">
.home {
  position: relative;
}
</style>
