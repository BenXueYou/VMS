<template>
	<div class="fellow">
		<div class="fellow-info">
			<car-detail-item :item="item" />
		</div>
		<div class="split-line"></div>
		<div class="fellow-capture">
			<template v-for="(detailItem, index) in item.vePerceptRcdDTOList">
				<car-fellow-capture-item
					:key="index"
					:detailItem="detailItem"
					@onClickOpenDetail="onClickOpenDetail"
				/>
			</template>
		</div>
	</div>
</template>

<script>
import CarDetailItem from "@/pages/faceModule/views/carFellow/view/CarDetailItem";
import CarFellowCaptureItem from "@/pages/faceModule/views/carFellow/view/CarFellowCaptureItem";

export default {
  components: {
    CarDetailItem,
    CarFellowCaptureItem
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
  methods: {
    onClickOpenDetail(vehicleuuid) {
      this.$emit("onClickOpenDetail", vehicleuuid);
    }
  },
  watch: {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.fellow {
	display: flex;
	flex-direction: row;
	.split-line {
		border-color: #303336;
		border-width: 0 0 0 2px;
		border-style: dashed;
		margin: 0px 2%;
	}
	.fellow-capture {
		width: 86%;
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
	}
}
</style>
