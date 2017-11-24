<template>
  <div id="coursediv">
    <div><p style="color:#666666">{{index + 1}}.{{title}}</p></div>
    <div :class="{state0:state0Boolean,state1:state1Boolean,state2:state2Boolean}"><p id="getp" ref="getp"
                                                                                      style="text-align: center;"
                                                                                      @click="click">
      {{courseStateTxt}}</p>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">

  export default {
    data() {
      return {
//        courseStateTxt: '点击领取',
//        state0Boolean: false,
//        state1Boolean: false,
//        state2Boolean: false,
//        divColor:"color:'#666666';"
      }
    },
//    computs:{
//      state0Boolean:function () {
//        return courseState==0
//      },
//      state1Boolean:function () {
//        return true
//      },
//      state1Boolean:function () {
//        return courseState==0
//      }
//    },
    props: {
      index: Number,
      title: String,
      courseState: Number,   // 0:点击领取，1:成功领取，2:等待解锁
    },
    mounted() {
//      if (this.courseState == 0) {
//        this.$refs.getp.style.color = '#666666';
//        this.courseStateTxt = '点击领取';
//        this.state0Boolean = true;
//      } else if (this.courseState == 1) {
//        this.$refs.getp.style.css
//        this.$refs.getp.style.color = '#15cda9';
//        this.courseStateTxt = '成功领取'
//        this.state1Boolean = true;
//      } else if (this.courseState == 2) {
//        this.$refs.getp.style.color = '#99cdf5';
//        this.courseStateTxt = '等待解锁'
//        this.state2Boolean = true;
//      }

    },
    computed: {
      courseStateTxt: function () {
        return this.courseState == 0 ? '点击领取' : this.courseState == 1 ? '成功领取' : '等待解锁'
      },
      state0Boolean: function () {
        return this.courseState == 0
      },
      state1Boolean: function () {
        return this.courseState == 1
      },
      state2Boolean: function () {
        return this.courseState == 2
      },
      divColor:function () {
        return this.courseState == 0 ? '#666666' : this.courseState == 1 ? '#15cda9' : '#99cdf5'
      }

    },
    methods: {
      click: function () {
        this.$emit("itemClick", this.index)
      }
    }
  }

</script>

<style scoped>

  #coursediv {
    margin-right: 20px;
    margin-left: 20px;
    padding-bottom: 10px;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #dedede;
  }

  #coursediv div {
    margin: 0 0;
    width: 110px;
    height: 33px;
  }

  #coursediv p {
    margin: 0 0;
    line-height: 33px;
    /*background-color: red;*/
  }

  #getp {
    margin-right: -12px;
    /*background-attachment: fixed;*/
    line-height: 33px;
  }

  .state0 {
    background-image: url('../assets/kuang1.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: #666666;
  }

  .state1 {
    background-image: url('../assets/kuang2.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: #15cda9;
  }

  .state2 {
    background-image: url('../assets/kuang3.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: #99cdf5;
  }

</style>
