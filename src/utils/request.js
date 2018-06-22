import fetch from 'dva/fetch';
import { message } from 'antd';
import {auth} from './index';

const qs = require('qs');

const pathToRegexp = require('path-to-regexp');

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
function done(data) {
  /*if(data.hasOwnProperty('code') && !data.hasOwnProperty('error_code')){
    //兼容，腾讯上传的格式
    data.error_code = data.code
  }
  if(data.error_code === 200010 || data.error_code === 200011){//未登录
    const redirectUrl = location.href;
    // debugger
    return location.href = '/passport/#/user/login?redirect_uri='+encodeURIComponent(redirectUrl);
  }else if(data.error_code !== 0){
    const error = new Error(data.info);
    throw error;
  }*/
  return data;
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
 function createReq({url,options,type,withAuth=true,useForm=true}){
    
    let headers = {
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        //'Content-Type': 'application/json',

        'cache-control':'no-cache',
        'pragma':'no-cache',
    };
    if(type=='get'){
      url += ('?'+qs.stringify(options));
    }
    if(useForm){
      headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
      options = qs.stringify(options);
    }else{
      options = JSON.stringify(options);
    }
    let requestParams =  {
          //credentials: ,//'same-origin','include'
          headers,
          method:type,
          mode:'cors',
          body:options,
        }
    if(type == 'get'){
      delete requestParams.body;
    }

    return {url,requestParams};
 }
export default function request(url, options,type='get',useForm=true) {
  let request = createReq({url,options,type,useForm});
  return fetch(request.url,request.requestParams)
    //.then(checkStatus)
    .then(parseJSON)
    .then(done);
    // .catch(err => ({ err }));
}
export function requestNoAuth(url, options,type='get',useForm=true) {
  let request = createReq({url,options,type,withAuth:false,useForm});
  return fetch(request.url,request.requestParams)
    .then(checkStatus)
    .then(parseJSON)
    .then(done);
    // .catch(err => ({ err }));
}
export function requestNoCheckRes(url, options,type='get',useForm=true) {
  let request = createReq({url,options,type,withAuth:false,useForm});
  return fetch(request.url,request.requestParams)
    .then(checkStatus)
    .then(parseJSON)
  // .catch(err => ({ err }));
}
export function fileupload(url, formData) {
  // let req = createReq({url,options,'post',withAuth:false});
  return fetch(url, {
    method: 'post',
    body: formData,
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(done);
    // .catch(err => ({ err }));
}

