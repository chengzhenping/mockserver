import request, { requestNoAuth, requestNoCheckRes } from '../utils/request'
import * as utils from '../utils'

export async function getNav () {
  return request('/api/getNav')
}
export async function logout () {
  return request('/v1/auth/logout')
}
export async function getUserInfo () {
  return requestNoAuth('/v1/unit/get_user_info')
}
export async function getUnitInfo () {
  return requestNoAuth('/v1/unit/get_unit_info')
}
export async function setUnitInfo (payload) {
  return requestNoAuth('/v1/unit/set_unit_info', payload)
}
export async function getCoAccessToken (param) {
  let coDomain = utils.getCoDomain()
  return requestNoCheckRes(`https://${coDomain}/api/platform/authorize`, param, 'post', true)
}

export async function dialog_msg_write (param) {
  return requestNoAuth('/v1/log/dialog_msg_write', param, 'post')
}

export async function log_write (param) {
  return requestNoAuth('/v1/log/log_write', param, 'post')
}


// index page -------------------


//获取api列表
export async function getApiList () {
  return request('/api/list',{})
}
export async function addApi ({uri}) {
  return request('/api/add',{uri},'post')
}
export async function delApi ({uri}) {
  return request('/api/del',{uri},"post")
}
export async function getApiDetail ({uri}) {
  return request('/api/detail',{uri})
}
export async function saveApiDetail ({uri,GET,POST}) {
  return request('/api/detail',{uri,GET,POST},'post',true)
}
