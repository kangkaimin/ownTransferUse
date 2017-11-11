<template>
  <div id="div" ref="bodydiv">
    <div id="header" ref="header">
      <div id="header_bg_green">
        <p id="header_title">活动页</p>
      </div>
      <img id="header_banner" src="../assets/photo.png"/>
    </div>

    <p style="font-size: 18px;padding: 0px;margin-top:0px;margin-bottom:0px;margin-right:20px;margin-left: 20px">还可以免费领取<span
      style="color: #15ccad;">{{freeCount}}</span>套</p>
    <div id="content" ref="content">
      <ul style="padding: 0px;margin: 0px;">
        <li v-for="(item, index) in items" style="list-style-type:none;">
          <courseitem :index="index" :title="item.name" :courseState="item.courseState"
                      v-on:itemClick="itemClick"></courseitem>
        </li>
      </ul>
    </div>

    <div id="footer" ref="footer">
      <p style="color: #15ccad; margin:5px auto;"><b>如何获得更多？</b></p>
      <p style="color: #858585; margin:5px auto;">分享这份清单给你的学俄语的好友（群、朋友圈，或者直接发给好友），每两个人打开清单并成功领取，你就可以解锁一套新的资料。</p>
      <p style="color: #000;width: 100%;text-align: center"><b>目前已有<span style="color: #15ccad;">{{receivePeople}}</span>人领取，共解锁<span
        style="color: #15ccad;">{{receiveCourse}}</span>套</b></p>
    </div>

    <div id="mask" v-show="showNoCourse||showSuccess" @click="closeAllMask">

    </div>

    <div v-show="showNoCourse" id="noCourse">
      <p id="closeNoCourse" @click="closeAllMask"> × </p>
      <p id="contentNoCourse"> {{noCourseContent}} </p>
    </div>

    <div v-show="showSuccess" id="onSuccess">
      <img id="onSuccessImg" src="../assets/success.jpg"/>
      <img id="onSuccessBtn" @click="goto" src="../assets/goto.jpg"/>
    </div>

  </div>
</template>

<script>
  import courseitem from "./CourseItem"
  import {notifyCourse, createUserInfo, getUserInfo, getCourse, getCourseLink,getReceivePeopleAndNum} from "../common/utils"

  export default {
    data() {
      return {
        screenHeight: window.innerHeight,
        userId: "001",
        course: [],
        shareCount: 0,
        tranArr: [],
        items: [],
        objectId: "",
        showNoCourse: false,
        showSuccess: false,
        noCourseContent: "",
        receivePeople:0,
        receiveCourse:0
      }
    },
    name: 'app',
    beforeCreate() {
//      this.screenHeight = window.innerHeight;
    },
    created() {
      let that = this

      //获取个人信息
      getUserInfo("123123").then((response) => {
        if (response.results.length > 0) {
          that.course = response.results[0].course
          that.shareCount = response.results[0].shareCount
          that.objectId = response.results[0].objectId
        } else {
          createUserInfo("123123")
        }
      }).catch((err) => {
        console.log(err)
      }).finally(function () {
        //获取课程信息
        getCourse().then((response) => {
          that.tranArr = response.results.sort(that.sortMethod)
          that.notifyItems();
        }).catch((err) => {
          console.log(err)
        })
      })

      //获取参与人数领取数量
      getReceivePeopleAndNum().then((response) => {
        let peopleNum = 0;
        let courseNum = 0;
        response.results.map((item)=>{
          if (item.course && item.course.length > 0){
            peopleNum = peopleNum + 1;
            courseNum = courseNum + item.course.length;
          }
        })

        this.receivePeople = peopleNum
        this.receiveCourse = courseNum
      }).catch((err) => {
        console.log(err)
      })

    },
    mounted() {
      let bodydivHeight = this.$refs.bodydiv.offsetHeight;
      let headerHeight = this.$refs.header.offsetHeight;
      let footerHeight = this.$refs.footer.offsetHeight;

      this.$refs.bodydiv.style.height = this.screenHeight + 'px';
      this.$refs.content.style.height = (this.screenHeight - headerHeight - footerHeight) + 'px';

    },
    computed: {
      freeCount() {
        return parseInt((this.shareCount - this.course.length * 2 ) / 2)
      }
    },
    components: {
      courseitem
    },
    methods: {
      sortMethod(a, b) {
        return a.index - b.index
      },
      goto() {
        window.location.href = 'http://www.Baidu.com';
      },
      closeAllMask() {
        this.showNoCourse = false;
        this.showSuccess = false;
      },
      notifyItems() {
        this.items = this.tranArr.map((item) => {
          if (this.course.includes(item.tableName)) {
            item.courseState = 1
          } else {
            if (this.freeCount > 0) {
              item.courseState = 0
            } else {
              item.courseState = 2
            }
          }
          return item
        })
      },
      itemClick(index) {

        if (this.course.includes(this.items[index].tableName)) {
          this.showSuccess = true;
          return
        }

        if (this.freeCount < 1) {
          this.showNoCourse = true;
          this.noCourseContent = "没有更多领取机会了。您可以通过分享获得更多资格。";
          return
        }

        getCourseLink(this.items[index].tableName).then((response) => {

          if (!response || response == "101") {
            this.showNoCourse = true;
            this.noCourseContent = "Oops,领取的人太多了，邀请码已经用光了。。。管理员正在补充，请稍后再试一下（如果超过24h还没好，请截图该页面，并在公众号后台发送并留言索取）！";
          } else {
            this.course.push(this.items[index].tableName)
            notifyCourse(this.course, this.objectId).then((response) => {
              this.notifyItems()

              this.showSuccess = true;
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>

<style>

  #div {
    position: relative;
    height: 0px;
    width: 100%;
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

  #noCourse {
    width: 200px;
    height: 160px;
    margin: auto;
    position: absolute;
    top: -100px;
    left: 0;
    bottom: 0;
    right: 0;
    border-width: 1px;
    border-style: solid;
    border-color: #aaaaaa;
    border-radius: 5px;
    -moz-border-radius: 25px; /* Old Firefox */
    background-color: white;
  }

  #closeNoCourse {
    font-size: 30px;
    position: absolute;
    top: 0px;
    right: 0px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin: 0px;
    padding: 0px;
  }

  #mask {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #000;
    opacity: 0.4;
  }

  #contentNoCourse {
    font-size: 14px;
    margin: 10px 20px;
    position: absolute;
  }

  #onSuccess {
    width: 250px;
    height: 300px;
    margin: auto;
    position: absolute;
    top: -100px;
    left: 0;
    bottom: 0;
    right: 0;
    border-width: 1px;
    border-style: solid;
    border-color: #fff;
    border-radius: 5px;
    -moz-border-radius: 25px; /* Old Firefox */
    background-color: white;
  }

  #onSuccessImg {
    width: 250px;
    height: 300px;
    objec-fit: cover;
  }

  #onSuccessBtn {
    width: 250px;
    border-width: 1px;
    border-style: solid;
    border-color: #fff;
    border-radius: 5px;
    -moz-border-radius: 25px; /* Old Firefox */
    background-color: #06bc07;
  }

</style>
