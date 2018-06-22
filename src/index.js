import 'babel-polyfill'
import dva, { connect } from 'dva'
import { Router, Route, useRouterHistory, browserHistory } from 'dva/router'
import RouterConfig from './router'
import { createHashHistory } from 'history'
import React from 'react'
import createLoading from 'dva-loading'
import lodash from 'lodash'
import { message, loading, urlAccountCheck } from './utils/index'

// 检查url中是否有account参数，尝试使用cookie中的lastCookie来修复
if (!urlAccountCheck()) {
  const app = dva({
    history: browserHistory, // useRouterHistory(createHashHistory)({ queryKey: false }),
    onError (e, dispatch) {
      let errorMessage = e.message
      //message.error(errorMessage)
      //loading.hide()
      //console && console.error && console.error(e)
    },

  })

  app.use(createLoading())

  app.model(require('./models/app'))
  app.model(require("./models/index"));


  app.router(RouterConfig)
  app.start('#root')
  window.XDGlobal = window.XDGlobal || {}
  window.XDGlobal._store = app._store
  // 暴露全局的dispatch
  window.dispatch = app._store.dispatch.bind(app._store)
}

