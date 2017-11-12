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
      <p style="color: #000;width: 100%;text-align: center"><b>目前已有<span
        style="color: #15ccad;">{{receivePeople}}</span>人领取，共解锁<span
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
  import axios from "axios"
  import crypto from "crypto"

  import {
    notifyCourse,
    createUserInfo,
    getUserInfo,
    getCourse,
    getCourseLink,
    getReceivePeopleAndNum,
    getOpenId,
    getJsapiTicket
  } from "../common/utils"

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
        receivePeople: 0,
        receiveCourse: 0,
        openId: ''
      }
    },
    name: 'app',
    beforeCreate() {
//      this.screenHeight = window.innerHeight;
    },
    created() {

      let that = this

      //获取openID
      var appId = 'wxb4d337ae696167c6';
      var appSecret = '4ecd990e4a9373110d2ea8bd2f85f7ea';
      var code = this.getUrlKey("code");

      alert(this.getUrlKey("code") + "   000")

      var urlTran = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appId + '&secret=' + appSecret + '&code=' + code + '&grant_type=authorization_code';

      getOpenId(appId, appSecret, code).then((res) => {
        alert("1201");

        that.openId = res.openid
        getJsapiTicket(res.access_token).then((res) => {

          alert(res);
          alert(location.href);

          var ret = {
            jsapi_ticket: "jsapi_ticket",
            nonceStr: Math.random().toString(36).substr(2, 16),
            timestamp: parseInt(new Date().getTime() / 1000) + '',
            url: encodeURIComponent(location.href.split('#')[0]),
            signature: ''
          };

          var string1 = "jsapi_ticket=" + ret.jsapi_ticket +
            "&noncestr=" + ret.nonceStr +
            "&timestamp=" + ret.timestamp +
            "&url=" + ret.url;

          var sha1 = crypto.createHash('sha1');
          sha1.update(string1);
          ret.nonceStr = sha1.digest('hex');

          alert(string1);

          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wxb4d337ae696167c6', // 必填，公众号的唯一标识
            timestamp: ret.timestamp,// 必填，生成签名的时间戳
            nonceStr: ret.nonceStr, // 必填，生成签名的随机串
            signature: ret.signature,// 必填，签名，见附录1
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });

          //根据 openid 获取信息

          alert("-0-0-0-0-0-0")

          //获取个人信息asd
          getUserInfo(that.openId).then((response) => {

            alert("-0-0-0-0-0-0    2")
            if (response.results.length > 0) {
              that.course = response.results[0].course
              that.shareCount = response.results[0].shareCount
              that.objectId = response.results[0].objectId
            } else {
              createUserInfo(that.openId)
            }
          }).catch((err) => {
            console.log(err)
          }).finally(function () {
            //获取课程信息
            getCourse().then((response) => {

              alert("-0-0-0-0-0-0    3")

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
            response.results.map((item) => {
              if (item.course && item.course.length > 0) {
                peopleNum = peopleNum + 1;
                courseNum = courseNum + item.course.length;
              }
            })

            alert("-0-0-0-0-0-0    4")

            that.receivePeople = peopleNum
            that.receiveCourse = courseNum
          }).catch((err) => {
            console.log(err)
          })
        })

      }).catch((e) => {
        alert("-------- 1")
        alert(e)
        alert("-------- 2")
      })

      wx.ready(function () {

        alert("微信设置成功")

        var title = '俄语练习';
        var link = 'http://m.enaotu.com/ad?id=' + that.openId;
        var imgUrl = 'http://m.enaotu.com/test.jpg';
        var desc = "一起学习俄语"

        //分享到朋友圈
        wx.onMenuShareTimeline({
          title: title, // 分享标题
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });

        //分享到朋友
        wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });

        //denxiangdao QQ
        wx.onMenuShareQQ({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接
          imgUrl: imgUrl, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });

        wx.onMenuShareQZone({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接
          imgUrl: imgUrl, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });

      });

      wx.error(function (res) {
        alert("微信设置shibai")
      });

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
      getUrlKey(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
      },
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
            }).catch((err) => {
              console.log(err)
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
