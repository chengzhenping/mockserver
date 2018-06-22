import React from 'react'
import { connect } from 'dva'
import { withRouter, Link } from 'dva/router'
import classnames from 'classnames'
import { Spin, Modal } from 'antd'
import PropTypes from 'prop-types'
import Cookie from 'js-cookie'

import './Default.less'
import CvdLeftNav from '../common/CvdLeftNav'
import CvdHeader from '../common/CvdHeader'
import CvdTips from '../common/CvdTips'

class Default extends React.Component {
  static propTypes = {
    app: PropTypes.object,
    location: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      showServiceExpiredTip: false,
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.app && nextProps.app.unitInfo && nextProps.app.unitInfo.id && !this.hasPayTipChecked) {
      this.hasPayTipChecked = true
      /* 权限控制 */
      if (window.platFrom.permiss && !window.platFrom.permiss.overduePrompt) return
      const query = this.props.location.query || {}
      const cookieField = `${query.account}_serviceExpiredTipShowed`
      // 一天之内最多显示一次提示
      if (Cookie.get(cookieField)) return
      const unitInfo = nextProps.app.unitInfo
      if (unitInfo.cvd_version === 2 && unitInfo.robot_version === 2) {
        this.setState({ showServiceExpiredTip: true })
        // 一天之内最多显示一次提示
        Cookie.set(cookieField, 'true', { expires: 1 })
      }
    }
  }
  render () {
    const { app, children, dispatch, history, location, routes, router } = this.props
    const navProps = {
      app,
      location,
      dispatch,
    }
    let routeList = routes.filter(item => item.path)
    // remove '/'
    routeList.splice(0, 1)
    // set title
    routeList = routeList.map(item => item.breadcrumbName)
    document.title = routeList.join('-')
    const headerProps = {
      app,
      routes,
      location,
      dispatch,
      router,
    }

    const { isLoading, discription, collapsed } = app
    return (
      <div className="main_layout__aHds4">
        <CvdLeftNav {...navProps} />
        <div className={classnames({ main_content: true, collapsed, has_descript: discription })}>
          <CvdHeader {...headerProps} />
          <div className="main_container">
            {children}
          </div>
        </div>
        <CvdTips />
        { isLoading &&
        <div className="g-loading ant-spin-blur">
          <Spin spinning={isLoading} tip="Loading" />
        </div>
        }
        <Modal
          className="m-modal-only-content"
          visible={this.state.showServiceExpiredTip}
          maskClosable={false}
          wrapClassName="vertical-center-modal"
          width={380}
        >
          <div className="m-show-service-expired-modal">
            <div className="header">
              <i className="ion-android-close" onClick={() => {
                this.setState({ showServiceExpiredTip: false })
              }}
              />
            </div>
            <div className="content">
              <p>您的当前版本已到期</p>
              <p className="phone"><i className="fa fa-phone" />服务升级电话 400-028-8810</p>
            </div>
            <div className="footer">
              <Link onClick={() => {
                this.setState({ showServiceExpiredTip: false })
              }} to={`/setting${window.location.search}#priceBox`}
              >查看收费标准&nbsp;&gt;</Link>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}


const mapStateToProps = ({ app }) => {
  return ({ app })
}

export default connect(mapStateToProps)(withRouter(Default))
