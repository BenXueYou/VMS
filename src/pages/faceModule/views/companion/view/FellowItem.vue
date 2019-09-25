<template>
	<div class="fellow">
		<div class="fellow-info">
			<detail-item :item="item" />
		</div>
		<div class="fellow-capture">
			<template v-for="(detailItem, index) in item.discernFaceDTOs">
				<fellow-capture-item :key="index" :item="detailItem" />
			</template>
		</div>
	</div>
</template>

<script>
import DetailItem from "@/pages/faceModule/views/companion/view/DetailItem";
import FellowCaptureItem from "@/pages/faceModule/views/companion/view/FellowCaptureItem";

export default {
  components: {
    DetailItem,
    FellowCaptureItem
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.fellow {
	display: flex;
	flex-direction: row;
	.fellow-info {
		margin-right: 62px;
	}
	.fellow-capture {
		width: 86%;
		margin-left: -15px;
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
	}
}
</style>
