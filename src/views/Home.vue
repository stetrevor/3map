<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <tree-editor />
  </div>
</template>

<script>
// @ is an alias to /src
import TreeEditor from "@/components/TreeEditor.vue";

export default {
  name: "home",
  components: {
    TreeEditor
  }
};
</script>

<style lang="scss">
.home {
  position: relative;
}
</style>
