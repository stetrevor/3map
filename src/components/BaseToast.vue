<template>
  <div class="base-toast" v-if="toast.show">
    {{ toast.message }}
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: mapGetters(["toast"])
};
</script>

<style lang="scss">
.base-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 16px;
  min-width: 320px;
  height: 48px;
  border-radius: 4px;
  color: white;
  background-color: #2c3e50;
  box-shadow: 0 2px 6px rgba(#2c3e50, 0.5);
  display: flex;
  line-height: 48px;
}
</style>
