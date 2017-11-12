<template>
  <div id="app">
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

      var id = this.getUrlKey("id");

      if (id != null){
        shareScuuess(this.getUrlKey("id"));
      }

      var fromurl = "http://m.enaotu.com/ad";

      alert(fromurl)
      alert(location.href)
      var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4d337ae696167c6&redirect_uri=' + encodeURIComponent(fromurl) + '&response_type=code&scope=snsapi_base&state=' + id + '#wechat_redirect';
      location.href = url;

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
