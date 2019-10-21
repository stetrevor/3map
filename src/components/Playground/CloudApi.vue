<template>
  <div class="cloud-api">
    <h3>Cloud API</h3>
    <div class="cloud-api__demos">
      <div>
        <h4>Generate File Id: {{ fileId }}</h4>
        <button @click="getFileId">Generate</button>
      </div>
      <div>
        <h4>Create a map file</h4>
        <button @click="createMap">Create file</button>
        <div>
          Name: <span>{{ mapFile.name }}</span> refPath:
          <span>{{ mapFile.refPath }}</span>
        </div>
      </div>
      <button @click="uploadMap(map)">Upload a map</button>
      <button>Download a map</button>
      <button>List maps</button>
      <button>Rename a map</button>
      <button>Upload a map resource</button>
      <button>Download a map resource</button>
      <button>Delete a map resource</button>
      <button>Rename a map resource</button>
      <button>List map resources</button>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import { mapActions } from "vuex";

export default {
  name: "cloud-api",

  methods: {
    ...mapActions(["uploadMap", "new3MapFile"]),

    getFileId() {
      this.fileId = api.generateFileId();
    },

    async createMap() {
      this.mapFile = await this.new3MapFile();
    }
  },

  data() {
    return {
      map: {
        refPath: "get a refPath somewhere or set this as empty",
        filename: "a whole new map",
        string: JSON.stringify({
          id: 0,
          x: 0,
          y: 0,
          width: 100,
          height: 50,
          text: "Hello World",
          children: []
        })
      },
      fileId: null,
      mapFile: { name: "", refPath: "" }
    };
  }
};
</script>

<style lang="scss">
.cloud-api {
  &__demos {
    display: flex;
    flex-direction: column;
  }
}
</style>
