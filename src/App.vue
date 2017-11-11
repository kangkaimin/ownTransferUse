<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {shareScuuess} from "./common/utils"

  export default {
    name: 'app',
    created() {
      this.$router.push('/ad?id=123123')
      shareScuuess(this.getUrlKey("id"));
    },
    methods: {
      getUrlKey(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
      }
    }
  }
</script>

<style>
  #app {
  }
</style>
