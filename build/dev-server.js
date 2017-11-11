'use strict'
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')
var bodyParser = require("body-parser");

var axios = require('axios');
const theHeaders = {
  'X-Bmob-Application-Id': '6d7f46e71191ce8cf8c3b5f95cac4cb1',
  'X-Bmob-REST-API-Key': '5f1ed714441840b493afcedc8b17e40b',
  'Content-Type': 'application/json'
}

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// enable hot-reload and state-preserving
// compilation error display

//================================= Bmob ====================================================================
// require('bmob')
// Bmob.initialize("6d7f46e71191ce8cf8c3b5f95cac4cb1", "5f1ed714441840b493afcedc8b17e40b");

app.use(bodyParser.urlencoded({extended: false}));

var apiRoutes = require("./route")
app.use('/h5shareapi', apiRoutes)
//================================= Bmob ====================================================================
// var apiRoutes = require("./route")
// app.use('/api', apiRoutes)

app.use(hotMiddleware)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = {target: options}
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

setInterval(function () {
    var url = 'https://api.bmob.cn/1/classes/H5User';
    var url2 = 'https://api.bmob.cn/1/classes/statistic';

    axios.get(url, {
      headers: theHeaders,
    }).then((response) => {

      var courseMap = new Map();

      console.log("人数：" + response.data.results.length)

      for (var i = 0; i < response.data.results.length; i++) {
        var course = response.data.results[i].course;

        console.log("同学 " + i + " : " + response.data.results.length)

        if (course && course.length > 0) {
          for (var j = 0; j < course.length; j++) {
            var item = course[j]

            console.log("map中是否已经存在 : " + courseMap.has(item))

            if (courseMap.has(item)) {
              console.log("存在")
              courseMap.set(item, courseMap.get(item) + 1);
            } else {
              console.log("不存在")
              courseMap.set(item, 1);
            }
          }
        }
      }

      console.log("courseMap - :" + courseMap.size)
      console.log(courseMap)

      var urlstatistic = 'https://api.bmob.cn/1/classes/statistic';
      axios.get(urlstatistic, {
        headers: theHeaders,
      }).then((response) => {

        console.log(response.data.results)

        for (var iCourse = 0; iCourse < response.data.results.length; iCourse ++ ) {
          var dCourse = response.data.results[iCourse];
          if (courseMap.has(dCourse.courseName)) {
            var urlTran = 'https://api.bmob.cn/1/classes/statistic/'+dCourse.objectId;
            console.log("urlTran:"+urlTran)
            axios.put(urlTran, {
              "receiveNum": courseMap.get(dCourse.courseName),
            }, {
              headers: theHeaders,
            }).then((response) => {
              console.log("success   course:" + dCourse.courseName + "  num:" + courseMap.get(dCourse.courseName))
            }).catch((err) => {
              console.log(err)
            })
            courseMap.delete(dCourse.courseName)
          }
        }

        console.log(courseMap)
        console.log("after courseMap:" + courseMap.size)

        if (courseMap.size > 0) {
          for (var addKey of courseMap.keys()) {

            console.log("after addKey:" + addKey)

            axios.post(url2, {
              "courseName": addKey,
              "receiveNum": courseMap.get(addKey),
            }, {
              headers: theHeaders,
            }).then((response) => {
              console.log("success   course:" + addKey + "  num:" + courseMap.get(addKey))
            }).catch((err) => {
              console.log(err)
            })
          }
        }

        // console.log(courseMap)
        // for (var key in courseMap) {
        //   console.log("setInterval   key:" + key + "  "+ courseMap.get(key))
        //   axios.post(url2, {
        //     "courseName": key,
        //     "receiveNum": courseMap.get(key),
        //   }, {
        //     headers: theHeaders,
        //   }).then((response) => {
        //     console.log("success   course:" + key + "  num:"+ courseMap.get(key))
        //   }).catch((err) => {
        //     console.log(err)
        //   })
        // }

      }).catch((err) => {
        console.log(err)
      })


    }).catch((err) => {
      console.log(err)
    })

  },
  1000 * 60 * 30
  // 1000 * 10
)

// serve pure static assets
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
