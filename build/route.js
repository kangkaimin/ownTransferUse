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
    console.log(response.data.results[0].course)
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

// 创建个人信息
router.get('/createUserInfo', function (req, res) {

  var url = 'https://api.bmob.cn/1/classes/H5User';

  console.log(req.query)

  axios.post(url, {
    "userId": req.query.userId,
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

    console.log(response.data)

    axios.put(urlPut, {
      "shareCount": response.data.results[0].shareCount + 1
    }, {
      headers: theHeaders,
    }).then((response) => {

      console.log(response.data)
      res.send("success")
    })
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

    if (courseCanUsedArr && courseCanUsedArr.length > 0) {

      res.json(courseCanUsedArr[courseCanUsedIndex])

      axios.put(baseUrl + "/" + courseCanUsedArr[courseCanUsedIndex].objectId, {
        "isUsed": true
      }, {
        headers: theHeaders,
      }).then((response) => {
        res.json(response.data)
      }).catch((err) => {
        console.log(err)
      })

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

//添加课程到已领取
router.get('/notifyCourse', function (req, res) {

  axios.put('https://api.bmob.cn/1/classes/H5User/' + req.query.userId, {
    course: {"__op": "AddUnique", "objects": req.query.courseArr},
  }, {
    headers: theHeaders,
  }).then((response) => {
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