<template>
  <div class='submenu'
       v-html='html'
       @click='submenuclick'>

  </div>
</template>

<script>
export default {
  name: "SubMenu",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      html: ""
    };
  },
  mounted() {
    console.log(this.data);
    this.init();
  },
  methods: {
    getHtml(data, parent) {
      let html = "",
        ishavechildren = false;
      html += `<ul class="submenu-ul">`;
      for (var i = 0, len = data.length; i < len; i++) {
        ishavechildren = typeof data[i].children == "undefined";
        html += `
          <li class="submenu-li" parent='${parent}-${i}' 
            value='${data[i].value}'
            ishavechildren=${ishavechildren}
           index='${i}'>
            ${data[i].label}
             ${ishavechildren ? "" : "<span class='next'>></span>"} 
          </li>
        `;
      }
      html += "</ul>";
      return html;
    },
    init() {
      this.html = this.getHtml(this.data, 0);
    },
    submenuclick(e) {
      if (e.target.className.indexOf("submenu-li") == -1) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      let ishavechildren = e.target.getAttribute("ishavechildren");
      if (ishavechildren == "true") {
        let value = e.target.getAttribute("value");
        this.$emit("chooseItem", value);
        return;
      }
      let index = e.target.getAttribute("index");
      let parent = e.target.getAttribute("parent").split("-");
      let num = this.data;
      let newHtml = "";
      let dep = [0];
      for (let i = 0; i < parent.length; i++) {
        if (i == 0) {
          newHtml += this.getHtml(num, 0);
        } else {
          num = num[parent[i]].children;
          if (num) {
            dep.push(parent[i]);
            newHtml += this.getHtml(num, dep.join("-"));
          } else {
            break;
          }
        }
      }
      this.html = newHtml;
    }
  },
  watch: {
    data() {
      this.init();
    }
  }
};
</script>
<style lang="scss">
.submenu {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .submenu-ul {
    background-color: rgb(42, 46, 49);
    display: inline-block;
    position: relative;
    list-style: none;
    width: 120px;
    border-right: 1px solid grey;
    box-sizing: border-box;                     
    vertical-align: top;
    padding: 0px;
    margin: 0px;
    .submenu-li {
      line-height: 36px;
      color: #dddddd;
      font-size: 12px;  
      text-align: center;
      cursor: pointer;
      margin: 0px;
      padding: 0px;
      &:hover {
        background-color: rgba(40, 255, 187, 0.05);
      }
    }
    .divide {
      display: block;
      height: 1px;
      width: 100%;
      background-color: #000;
      margin: 5px 0px;
    }
    &:last-child {
      border-right: none;
    }
  }
}
</style>
