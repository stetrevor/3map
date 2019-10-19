<template>
  <div class="firebase-cloud">
    <input type="file" multiple @change="uploadFiles($event.target.files)" />

    <h3>Uploading {{ ongoingUploads }} files</h3>

    <div v-for="p in progress" :key="p.refPath">
      <h4>{{ p.refPath }}</h4>
      <progress max="100" :value="p.progress" />
      <a :href="p.downloadURL" v-if="p.downloadURL">{{ p.downloadURL }}</a>
  </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "firebase-cloud",

  computed: mapState({ ongoingUploads: state => state.sync.ongoingUploads }),

  methods: mapActions(["uploadFiles"])
};
</script>

<style lang="scss"></style>
