<template>
  <div class="status-main">
    <left-list/>
    <door-open-list/>
  </div>
</template>

<script>
import LeftList from "@/pages/doorControl/views/doorStatus/LeftList";
import DoorOpenList from "@/pages/doorControl/views/doorStatus/DoorOpenList";

export default {
  components: {
    LeftList,
    DoorOpenList
  },
  props: {},
  data () {
    return {
    };
  },
  created () {},
  mounted () {},
  methods: {},
  watch: {},
  destroyed () {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.status-main {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
