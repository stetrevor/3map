<template>
  <div class="idb-api">
    <h2>idb api as window.idbapi</h2>
  </div>
</template>

<script>
import api from "@/api/local-storage";

export default {
  name: "idb-api",

  created() {
    window.idbapi = api;
  }
};
</script>

<style></style>
