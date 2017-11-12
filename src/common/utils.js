import axios from 'axios'


//获取课程信息
export function getCourse() {
  const url = '/h5shareapi/course'

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    console.log("getCourseErr:" + e)
  })
}

// 获取参与人数领取数量
export function getReceivePeopleAndNum() {
  const url = '/h5shareapi/receivePeopleAndNum'

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    console.log("getReceivePeopleAndNum:" + e)
  })
}

//获取个人信息
export function getUserInfo(id) {
  const url = '/h5shareapi/getUserInfo'

  const data = Object.assign({}, {
    id: id
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    console.log("getUserInfo : " + e)
  })
}

// 获取openId,因为跨域问题
export function getOpenId(appid,secret,code) {
  const url = '/h5shareapi/getOpenId'

  const data = Object.assign({}, {
    appId: appid,
    appSecret: secret,
    code: code,
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    console.log("getUserInfo : " + e)
  })
}

export function hasUser(userId) {
  const url = '/h5shareapi/hasUser'
  const data = Object.assign({}, {
    userId:userId,
  })

  axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  }).catch((e) => {

  })

}

// export function showOnNode(content) {
//   const url = '/h5shareapi/showOnNode'
//   const data = Object.assign({}, {
//     content:content,
//   })
//
//   axios.get(url, {
//     params: data
//   }).then((res) => {
//
//   }).catch((e) => {
//
//   })
// }

// 获取 JsapiTicket,因为跨域问题
export function getJsapiTicket(appId,appSecret) {
  const url = '/h5shareapi/getJsapiTicket'

  const data = Object.assign({}, {
    appId:appId,
    appSecret:appSecret
  })

  return axios.get(url, {
    params: data
  }).then((res) => {

    return Promise.resolve(res.data)
  }).catch((e) => {
    console.log("getUserInfo : " + e)
  })
}

//

//获取课程链接
export function getCourseLink(name) {
  const url = '/h5shareapi/getCourseLink'

  const data = Object.assign({}, {
    name: name
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    console.log("getUserInfo : " + e)
  })
}

//上报分享成功
export function shareScuuess(userId) {
  const url = '/h5shareapi/shareScuuess'

  console.log("userId:" + userId)

  const data = Object.assign({}, {
    userId: userId
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    console.log("shareScuuess : " + e)
  })
}

// 添加课程到已领取
export function notifyCourse(courseArr, userId) {
  const url = '/h5shareapi/notifyCourse'

  const data = Object.assign({}, {
    courseArr: courseArr,
    userId: userId
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    console.log("notifyCourse : " + e)
  })
}

// 新建用户
export function createUserInfo(userId) {
  const url = '/h5shareapi/createUserInfo'

  return axios.get(url, {
    params: {"userId": userId}
  }).then((res) => {
    return Promise.resolve(res.data)
  }).catch((e) => {
    console.log("getUserInfo : " + e)
  })
}

// export function getTest() {
//
//   const url = '/h5shareapi/test'
//
//   const data = Object.assign({}, {
//     id: '1013204821'
//   })
//
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     return Promise.resolve(res.data)
//   }).catch((e)=>{
//     console.log("error ------------- 1 "+e)
//   })
// }
