var axios = require('axios');

var express = require('express');
var router = express.Router();

const theHeaders = {
  'X-Bmob-Application-Id': '6d7f46e71191ce8cf8c3b5f95cac4cb1',
  'X-Bmob-REST-API-Key': '5f1ed714441840b493afcedc8b17e40b',
  'Content-Type': 'application/json'
}


// 获取个人信息
router.get('/getUserInfo', function (req, res) {
  var url = 'https://api.bmob.cn/1/classes/H5User?where={"userId":"' + req.query.id + '"}';

  axios.get(url, {
    headers: theHeaders,
  }).then((response) => {

    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

// 创建个人信息
router.get('/createUserInfo', function (req, res) {

  var url = 'https://api.bmob.cn/1/classes/H5User';


  axios.post(url, {
    "userId": req.query.userId,
    "fromWhere": req.query.fromId,
    "shareCount": 0,
    "course": {"__op": "Add", "objects": []},
  }, {
    headers: theHeaders,
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

// 分享的链接被打开
router.get('/shareScuuess', function (req, res) {

  var url = 'https://api.bmob.cn/1/classes/H5User?where={"userId":"' + req.query.userId + '"}';

  axios.get(url, {
    headers: theHeaders,
  }).then((response) => {
    if (response.data.results.length <= 0) {
      res.send("fail")
      return
    }

    var urlPut = 'https://api.bmob.cn/1/classes/H5User/' + response.data.results[0].objectId


    axios.put(urlPut, {
      "shareCount": response.data.results[0].shareCount + 1
    }, {
      headers: theHeaders,
    }).then((response) => {
      res.send("success")
    })
  })

})

// //设置推荐人
// // 获取openid
// router.get('/fromWhere', function (req, res) {
//
//   console.log("getOpenId ------------------ " + req.query.appId + "  " + req.query.appSecret + "  " + req.query.code)
//
//   var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + req.query.appId + '&secret=' + req.query.appSecret + '&code=' + req.query.code + '&grant_type=authorization_code';
//   axios.get(url).then((response) => {
//     console.log(response.data)
//     res.send(response.data)
//   })
//
// })

// 获取openid
router.get('/getOpenId', function (req, res) {

  console.log("getOpenId ------------------ " + req.query.appId + "  " + req.query.appSecret + "  " + req.query.code)

  var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + req.query.appId + '&secret=' + req.query.appSecret + '&code=' + req.query.code + '&grant_type=authorization_code';
  axios.get(url).then((response) => {
    console.log(response.data)
    res.send(response.data)
  })

})

// show on node
router.get('/showOnNode', function (req, res) {

  console.log("getOpenId ------------------ " + req.query.conent)


})


var ticketData;
var accessTokenData;
var startTime;

router.get('/getJsapiTicket', function (req, res) {
  if (ticketData == null) {
    startTime = new Date().getTime();
  }

  var dur = new Date().getTime() - startTime

  console.log("------------------------------------------------------------------------------------")
  console.log("new Date().getTime():" + new Date().getTime())
  console.log("   startTime:" + startTime)
  console.log("  ticketData:" + ticketData)
  console.log("  dur / 1000 < 7000:" + (dur / 1000 < 7000))
  console.log("------------------------------------------------------------------------------------")

  if (ticketData != null && dur / 1000 < 7000) {
    res.send(ticketData)
    console.log("ticketData : " + ticketData)
    console.log(ticketData)
  } else {

    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + req.query.appId + '&secret=' + req.query.appSecret;
    axios.get(url).then((response) => {
      console.log("access_token : ")
      console.log(response.data)
      var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + response.data.access_token + '&type=jsapi';
      axios.get(url).then((response) => {
        res.send(response.data)
        startTime = new Date().getTime();
        ticketData = response.data
        console.log("ticketData : ")
        console.log(ticketData)
      })
    })
  }

})

//用户是否存在
router.get('/hasUser', function (req, res) {
  console.log("router:" + req.query.userId)
  var url = 'https://api.bmob.cn/1/classes/H5User' + '?where={"userId":' + req.query.userId + '}';

  axios.get(url, {
    headers: theHeaders,
  }).then((response) => {
    if (response.data.results.length > 0) {
      res.send("true")
    } else {
      res.send("false")
    }
  })
})


var courseCanUsedMap = new Map();
// var courseCanUsed = new Array();
// var courseCanUsedIndex = 0;

//获取课程链接 getCourseLink
router.get('/getCourseLink', function (req, res) {

  if (courseCanUsedMap && courseCanUsedMap.has(req.query.name)) {

    var courseCanUsedArr = courseCanUsedMap.get(req.query.name).arr;
    var courseCanUsedIndex = courseCanUsedMap.get(req.query.name).ind;

    if (courseCanUsedArr && courseCanUsedArr.length > courseCanUsedIndex) {

      res.json(courseCanUsedArr[courseCanUsedIndex])
      console.log("courseCanUsedArr[courseCanUsedIndex]):"+courseCanUsedIndex);
      console.log(courseCanUsedArr[courseCanUsedIndex]);

      axios.put(baseUrl + "/" + courseCanUsedArr[courseCanUsedIndex].objectId, {
        "isUsed": true
      }, {
        headers: theHeaders,
      }).then((response) => {
        // res.json(response.data)
      }).catch((err) => {
        console.log(err)
      })

      courseCanUsedIndex = courseCanUsedIndex + 1;
      courseCanUsedMap.set(req.query.name, {
        "arr": courseCanUsedArr,
        "ind": courseCanUsedIndex
      })

      return
    }
  }


  {

    var baseUrl = 'https://api.bmob.cn/1/classes/' + req.query.name;

    //是否还有链接
    var url1 = baseUrl + '?where={"isUsed":false}'
    axios.get(url1, {
      headers: theHeaders,
    }).then((response) => {
      // res.json(response.data)

      if (response.data.results.length <= 0) {
        res.send('101')
      } else {
        // res.json(response.data)

        courseCanUsedMap.set(req.query.name, {
          "arr": response.data.results,
          "ind": 1
        })

        console.log("response.data.results[0]:"+response.data.results[0]);
        console.log(response.data.results[0]);
        res.json(response.data.results[0])

        axios.put(baseUrl + "/" + response.data.results[0].objectId, {
          "isUsed": true
        }, {
          headers: theHeaders,
        }).then((response) => {
          res.json(response.data)
        }).catch((err) => {
          console.log(err)
        })
      }
    }).catch((err) => {
      console.log(err)
    })

  }
})

//添加课程到已领取  通过ObjectId
router.get('/notifyCourseByObjectId', function (req, res) {

  axios.put('https://api.bmob.cn/1/classes/H5User/' + req.query.objectId, {
    course: {"__op": "AddUnique", "objects": req.query.courseArr},
  }, {
    headers: theHeaders,
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

//添加课程到已领取  通过 OpenId
router.get('/notifyCourseByOpenId', function (req, res) {

  var url = 'https://api.bmob.cn/1/classes/H5User?where={"userId":"' + req.query.openId + '"}';

  axios.get(url, {
    headers: theHeaders,
  }).then((response) => {

    if (response.data.results.length > 0) {
      axios.put('https://api.bmob.cn/1/classes/H5User/' + response.data.results[0].objectId, {
        course: {"__op": "AddUnique", "objects": req.query.courseArr},
      }, {
        headers: theHeaders,
      }).then((response) => {
        res.json(response.data)
      }).catch((err) => {
        console.log(err)
      })

    }

    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })

})

// 获取所有课程
router.get('/course', function (req, res) {
  var url = 'https://api.bmob.cn/1/classes/Course';

  axios.get(url, {
    headers: theHeaders,
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

// 获取总计数据
router.get('/receivePeopleAndNum', function (req, res) {
  var url = 'https://api.bmob.cn/1/classes/H5User';

  axios.get(url, {
    headers: theHeaders,
  }).then((response) => {
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})


module.exports = router;
