<template>
  <div id="div" ref="bodydiv">
    <div id="header" ref="header">
      <div id="header_bg_green">
        <p id="header_title">活动页</p>
      </div>
      <img id="header_banner" src="../assets/photo.png"/>
    </div>

    <p style="font-size: 18px;padding: 0px;margin-top:0px;margin-bottom:0px;margin-right:20px;margin-left: 20px">还可以免费领取<span style="color: #15ccad;">2</span>套</p>
    <div id="content" ref="content">
      <ul style="padding: 0px;margin: 0px;">
        <li v-for="(item, index) in items" style="list-style-type:none;">
          <courseitem :index="index" :title="item.title" :courseState="item.courseState"></courseitem>
        </li>
      </ul>
    </div>

    <div id="footer" ref="footer">
      <p style="color: #15ccad; margin:5px auto;"><b>如何获得更多？</b></p>
      <p style="color: #858585; margin:5px auto;">分享这份清单给你的学俄语的好友（群、朋友圈，或者直接发给好友），每两个人打开清单并成功领取，你就可以解锁一套新的资料。</p>
      <p style="color: #000;width: 100%;text-align: center"><b>目前已有<span style="color: #15ccad;">0</span>人领取，共解锁<span
        style="color: #15ccad;">0</span>套</b></p>
    </div>
  </div>
</template>

<script>
  import courseitem from "./CourseItem"

  export default {
    data() {
      return {
        screenHeight: window.innerHeight,
        items:[
          {
            title:"课程一",
            courseState:1
          },{
            title:"课程2",
            courseState:0
          },{
            title:"课程3",
            courseState:2
          },{
            title:"课程3",
            courseState:2
          },{
            title:"课程3",
            courseState:2
          },{
            title:"课程3",
            courseState:2
          },{
            title:"课程3",
            courseState:2
          },{
            title:"课程3",
            courseState:2
          }
        ]
      }
    },
    name: 'app',
    beforeCreate() {
//      this.screenHeight = window.innerHeight;
    },
    mounted() {
      let bodydivHeight = this.$refs.bodydiv.offsetHeight;
      let headerHeight = this.$refs.header.offsetHeight;
      let footerHeight = this.$refs.footer.offsetHeight;

      this.$refs.bodydiv.style.height = this.screenHeight + 'px';
      this.$refs.content.style.height = (this.screenHeight - headerHeight - footerHeight) + 'px';
      console.log(this.screenHeight)
      console.log(headerHeight)
      console.log(footerHeight)
      console.log(this.screenHeight - headerHeight - footerHeight)
    },
    components: {
      courseitem
    }
  }
</script>

<style>

  #div {
    position: relative;
    height: 0px;
    /*font-size:0;*/
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  #header_bg_green {
    position: relative;
    width: 100%;
    height: 60px;
    background-color: #15ccad;
    -moz-box-shadow: 0px 2px 5px #15ccad;
    -webkit-box-shadow: 0px 2px 5px #15ccad;
    box-shadow: 0px 2px 5px #15ccad;
  }

  #header_title {
    width: 100%;
    margin: 0px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 18px;
    color: white;
  }

  #header_banner {
    width: 100%;
  }

  #content {
    width: 100%;
    overflow: scroll;
  }

  #footer {
    margin-top: 5px;
    margin-bottom: 0px;
    margin-left: 20px;
    margin-right: 20px;
  }

  #footer p {
    line-height: 18px;
    font-size: 13px;
  }

</style>
