import React from 'react'
import { Router, Route, Redirect, IndexRoute, browserHistory } from 'dva/router'

import IndexPage from './routes/Index'

// mock server
function RouterConfig ({ history }) {
  return (
    <Router history={browserHistory}>
      <Route path="/" breadcrumbName="前端mock服务" component={IndexPage} >
      </Route>
    </Router>
  );
}

export default RouterConfig

