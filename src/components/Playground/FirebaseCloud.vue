<template>
  <div class="firebase-cloud">
    <input type="file" multiple @change="uploadFiles($event.target.files)" />

    <h3>Uploading {{ ongoingUploads }} files</h3>

    <div v-for="p in progress" :key="p.refPath">
      <h4>{{ p.refPath }}</h4>
      <progress max="1" :value="p.progress" />
      <a :href="p.downloadURL" v-if="p.downloadURL">{{ p.downloadURL }}</a>
    </div>
  </div>
</template>

<script>
import { Subject, interval } from "rxjs";
import {
  flatMap,
  switchMap,
  groupBy,
  tap,
  map,
  take,
  filter
} from "rxjs/operators";

import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "firebase-cloud",

  computed: {
    ...mapState({
      ongoingUploads: state => state.sync.ongoingUploads
    }),
    ...mapGetters(["progress"])
  },

  methods: {
    ...mapActions(["uploadFiles"]),
    sendNext() {
      this.subject.next({ id: this.id });
    }
  },

  data() {
    return {
      id: 0
    };
  },

  created() {
    const subject = new Subject();
    this.subject = subject;

    let c1 = 0;
    let c2 = 0;
    const values = [
      { id: 0, value: 0 },
      { id: 1, value: 1 },
      { id: 2, value: 2 },
      { id: 0, value: 10 },
      { id: 0, value: 20 },
      { id: 0, value: 30 },
      { id: 0, value: 40 }
    ];
    const source$ = interval(2000).pipe(
      take(7),
      map(i => values[i])
    );

    source$
      .pipe(
        tap(() => ++c1),
        tap(() => console.log("c1", c1)),
        groupBy(v => v.id),
        tap(() => ++c2),
        tap(() => console.log("c2", c2)),
        flatMap(group$ =>
          group$.pipe(
            switchMap(v =>
              interval(1000).pipe(
                map(i => ({ value: v.value, index: i })),
                take(10)
              )
            )
          )
        ),
        tap(v => console.log("got value", v.index)),
        filter(v => v.index === 9),
        tap(() => --c2),
        tap(() => console.log("c2 later", c2))
      )
      .subscribe();
  }
};
</script>

<style lang="scss"></style>
