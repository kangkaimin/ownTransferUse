<template>
  <div id="app">
    实打实大苏打我
    <router-view/>
  </div>
</template>

<script>
  import {shareScuuess} from "./common/utils"
  import jsSHA from "jssha"
  import axios from "axios"

  export default {
    name: 'app',
    created() {
//      script('path/to/plugin.js')


      //这里需要注意账号权限的问题，看是否有网页授权，本例子的权限是：服务号
      //获取微信授权code，可查看文档:微信网页开发--->微信网页授权,appid请修改成自己的
//      var access_code = GetQueryString('code');
//
//      if (access_code == null) {
//        //fromurl 需要urlencode编码处理
//        var fromurl = location.href;
//        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=xxxxx&redirect_uri=' + encodeURIComponent(fromurl) + '&response_type=code&scope=snsapi_base&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
//        //打开微信授权页面
//        location.href = url;
//      } else {
//        $.ajax({
//          type: 'get',
//          //url会拿到微信给的授权code，有授权code就可以获得用户信息，
//          url: 'http://xxx.xx.com/wxinfo.do',
//          data: {
//            code: access_code,
//            wxhref: location.href
//          },
//          dataType: 'jsonp',
//          jsonpCallback: 'wxinfo',
//          success: function (req) {
//            //接口返回的数据
//            console.log(req);
//          }
//        });
//      }

      var access_code = this.getUrlKey('code');

      if (access_code == null) {
        var state = this.getUrlKey("id");
        var fromurl = "http://m.enaotu.com/ad";

        alert(fromurl)
        alert(location.href)
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4d337ae696167c6&redirect_uri=' + encodeURIComponent(fromurl) + '&response_type=code&scope=snsapi_base&state=' + state + '#wechat_redirect';
        location.href = url;
      } else {
        if (this.getUrlKey("state") != null){
          shareScuuess(this.getUrlKey("id"));
        }

        var secret = 's';
        var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + wxb4d337ae696167c6 + '&secret=' + secret + '&code=' + this.getUrlKey("code") + '&grant_type=authorization_code';


        var openId = ''
        axios.get(url).then((res) => {
          alert(res);
        }).catch((e) => {
          console.log("微信access_token请求失败:" + e)
        })
      }

      return


      var ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: Math.random().toString(36).substr(2, 16),
        timestamp: parseInt(new Date().getTime() / 1000) + '',
        url: url
      };

//      var string = raw(ret);
//      jsSHA = require('jssha');
//      shaObj = new jsSHA(string, 'TEXT');
//      ret.signature = shaObj.getHash('SHA-1', 'HEX');

//      wx.config({
//        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//        appId: 'wxb4d337ae696167c6', // 必填，公众号的唯一标识
//        timestamp:,// 必填，生成签名的时间戳
//        nonceStr:, // 必填，生成签名的随机串
//        signature: '',// 必填，签名，见附录1
//        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//      });


      this.$router.push('/ad?id=123123')



    },
    methods: {
      getUrlKey(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
      },
      raw(args) {
        var keys = Object.keys(args);
        keys = keys.sort()
        var newArgs = {};
        keys.forEach(function (key) {
          newArgs[key.toLowerCase()] = args[key];
        });

        var string = '';
        for (var k in newArgs) {
          string += '&' + k + '=' + newArgs[k];
        }
        string = string.substr(1);
        return string;
      }
    }
  }
</script>

<style>
  #app {
  }
</style>
