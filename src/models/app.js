import * as API from '../services/app'
import {message} from '../utils/index';
import _ from 'lodash'

const delay = ms => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

export default {
  namespace: 'app',
  state: {
    // new messages notive
    menuSwitchMesNotice: false,
    // current user info
    userInfo: {},
    title: '', // page title

    unitInfo: {}, // 企业信息

    navList: [],
    discription: '',
    collapsed: true,
    mixHeader: false, 
    mix_main: null, // when mixHeader true, got the main scroll el

    cvdTipsType: 3, // 0,1,2,3  warn,success,info,error
    cvdTipsContent: '', // 提示内容
    cvdTipsShow: false,

    coAccessToken: '', // 淘宝服务平台授权token
    coAccessTokenLoading: false, // 淘宝服务平台授权token请求中

    isLoading: false, // global-loading

    newbieGuideSwitch: false,  //新手引导

    caculateHeight: {
      json_editor: 0
    }
  },
  reducers: {
    setState (state, action) {
      return { ...state, ...action.payload }
    },
    setUserInfo (state, action) {
      return { ...state, userInfo: action.payload }
    },

    setDiscription (state, action) {
      return { ...state, discription: action.payload }
    },
    setNavList (state, action) {
      return { ...state, navList: action.payload.data }
    },
    setCollapse (state, action) {
      return { ...state, collapsed: action.payload }
    },
    setLoading (state, action) {
      return { ...state, isLoading: !!action.payload }
    },
    setEditorHeight (state, action) {
      const newCaculateHeight = {...state.caculateHeight,json_editor:action.payload}
      return { ...state, caculateHeight: newCaculateHeight }
    },
  },
  effects: {
    * getUnitInfo (action, { call, put }) {
      let res = yield call(API.getUnitInfo)
      yield put({ type: 'setState', payload: { unitInfo: res } })
    },
    * setUnitInfo ({ payload }, { call, put }) {
      console.log(payload)
      let res = yield call(API.setUnitInfo, payload)
      if( res && res.error_code == 0 ){
         yield put({ type: 'setState', payload: { unitInfo: payload } })
         message.success('保存成功!',1000);
      }else{
         message.error('保存失败请重试!',1000);
      }
    },
    * showTips ({ payload }, { call, put }) {
      const { cvdTipsType } = payload
      yield put({
        type: 'setState',
        payload,
      })
      const time = payload.time ? payload.time : 3000
      // if(cvdTipsType === 3){
      yield new Promise((resolve, reject) => {
        setTimeout(resolve, time)
      })
      yield put({
        type: 'setState',
        payload: {
          cvdTipsShow: false,
        },
      })
      // }
    },
    * getCoAccessToken (action, { call, put, select }) {
      let app = yield select(state => state.app)
      if (!app.coAccessToken && !app.coAccessTokenLoading) {
        yield put({
          type: 'setState',
          payload: {
            coAccessTokenLoading: true,
          },
        })
        const res = yield call(API.getCoAccessToken, {
          platform: 'cvd',
          employee_id: app.userInfo.uid,
          employee_name: app.userInfo.nick,
        })
        // console.log(res)
        yield put({
          type: 'setState',
          payload: {
            coAccessTokenLoading: false,
            coAccessToken: res.access_token,
          },
        })
        // token过期时，重新获取
        yield call(delay, res.expires_in * 1000)
        yield put({
          type: 'getCoAccessToken',
        })
      }
    },
    * getUserInfo ({ payload: {} }, { call, put, select }) {
      const data = yield call(API.getUserInfo, {})
      yield put({
        type: 'setUserInfo',
        payload: data,
      })
      yield put({
        type: 'getCoAccessToken',
      })
      if(!data.new_guide ) {
        R.update_user_new_guide_info({step:1})
        yield put({
          type: 'setState',
          payload: {newbieGuideSwitch:true},
        })
      }
    },
    * fetch ({ payload: {} }, { call, put }) {
      const data = yield call(API.getNav, {})
      yield put({
        type: 'setNavList',
        payload: data,
      })
    },
    * logout ({ payload: {} }, { call, put }) {
      const data = yield call(API.logout, {})
      location.href = `/passport/#/user/login?redirect_uri=${encodeURIComponent(location.href)}`
    },
    * msgWrite ({ payload }, { call, put }) {
      if(payload.body.sess) delete payload.body.sess;
      payload.from = parseInt(payload.from)
      payload.body = JSON.stringify(payload.body)
      API.dialog_msg_write(payload)
    },
    * errorWrite ({ payload }, { call, put }) {
      API.log_write(payload)
    },

  },
  subscriptions: {
    setup ({ dispatch, history }) {
      window.onresize = _.throttle(resizeJob,1000) //一秒钟最多执行一次
      caculateHeight()
      function caculateHeight (){
        const innerHeight = window.innerHeight
        dispatch({
          type: 'setEditorHeight',
          payload: innerHeight - 150
        })
      }
      function resizeJob(){
        //task 1
        caculateHeight()
      }
    }
  },
}
