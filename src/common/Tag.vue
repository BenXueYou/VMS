<template>
	<div class="tagBox">
		<template v-for="( tag , index) in dynamicTags">
			<el-tag
				class="el-tag-class"
				:key="index"
				:closable="closable"
				:disable-transitions="false"
				@close="handleClose(tag,index)"
			>
				<!-- <img class="img" v-if="tag.children" src="@/assets/images/doorAccess/tag_floor.png" alt> -->
				<!-- <img class="img" v-else src="@/assets/images/doorAccess/tag_door.png" alt> -->
				<img class="img" :src="tag.icon?tag.icon:require('@/assets/images/doorAccess/tag_door.png')" alt>
        {{tag.label}}
				<!-- {{tag}} -->
				<div v-if="tag.children" :key="index" class="tag-hover-box">
					<template v-for="(item , i) in childrenTags(tag)">
						<el-tag class="el-tag-class" :key="i" :disable-transitions="false">
							<!-- <img class="img" v-if="item.children" src="@/assets/images/doorAccess/tag_floor.png" alt> -->
							<!-- <img class="img" v-else src="@/assets/images/doorAccess/tag_door.png" alt> -->
							<img class="img" :src='item.icon' alt>
							{{item.label}}
						</el-tag>
					</template>
				</div>
			</el-tag>
		</template>
	</div>
</template>
<script>
export default {
	components: {},
	props: {
		tags: {
			type: Array,
			default: () => []
		},
		closable: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			dynamicTags: []
		};
	},
	mounted() {
		console.log(this.tags);
		this.dynamicTags = this.tags;
	},
	watch: {
		tags(val) {
			this.dynamicTags = val;
			this.dynamicTags.forEach(item => {
				if (item.type === "organization") {
					item.icon = require("@/assets/images/personMange/document.png");
				} else if (item.type === "staff") {
					item.icon = require("@/assets/images/doorAccess/person_select.png");
				} else if (item.type === "tag") {
					item.icon = require("@/assets/images/equipment/sign.png");
				} else if (item.nodeType === "building") {
					item.icon = require("@/assets/images/building.png");
        } else if(item.nodeType === "floor"){
          item.icon = require("@/assets/images/resident/floor.png");
        } else {
					item.icon = require("@/assets/images/doorAccess/tag_door.png");
        }
			});
		}
	},
	methods: {
		childrenTags(children) {
			console.log(children);
			var arr = [];
			this.$common.getChildren(children.children, arr);
			return arr;
		},
		handleClose(tag, index) {
			console.log(tag, index);
			this.dynamicTags.splice(index, 1);
			this.$emit("handleClose", this.dynamicTags);
		}
	}
};
</script>
<style lang="scss" scoped>
.tagBox {
	.el-tag-class {
		margin: 15px 12px 0;
		background-color: rgb(48, 51, 55);
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #ffffff;
		border: 0;
		position: relative;
	}
	.el-tag-class .el-icon-close:hover {
		background-color: transparent;
		color: #26d39d;
	}
	.el-tag-class .el-icon-close {
		color: rgba(0, 0, 0, 0.6);
		margin-right: -12px;
		margin-top: -30px;
		background-color: rgba(245, 245, 245, 0.6);
	}
	.tag-hover-box {
		display: none;
		justify-content: flex-start;
		width: 400%;
		max-width: 320px;
		background: #2a2e31;
		box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.3);
		height: auto;
		position: absolute;
		top: 30px;
		left: 0;
		z-index: 99;
		flex-wrap: wrap;
		padding: 9px 11px;
	}
	.el-tag-class:hover .tag-hover-box {
		display: flex !important;
	}
}
</style>
