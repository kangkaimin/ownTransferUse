<template>
  <div id="app" :style="height:{{height}}px">
    <router-view/>
  </div>
</template>

<script>
  import {shareScuuess} from "./common/utils"
  import axios from "axios"

  export default {
    name: 'app',
    data(){
      return{
        height:0
      }
    },
    created() {

      this.height = document.body.clientHeight;


//      this.$router.push('/ad?id=123123')
//      return

      var access_code = this.getUrlKey('code');
      var id =  this.getUrlKey('id');

      if (access_code != null) {
//        location.href = 'http://m.enaotu.com/ad';
        return
      }

      var fromurl = "http://m.enaotu.com/ad";

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
