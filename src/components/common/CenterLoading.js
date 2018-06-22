import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import classnames from 'classnames'
import './CenterLoading.less'
/* 功能： 直接放到容器里面，将会在容器中覆盖一个绝对定位的div，挡掉针对后面元素的操作，容器中间显示一个通用的Loading样式 */
export default function CenterLoading ({ loading }) {
  return (
    <div className={classnames({ 'm-centerLoading': true, hide: !loading })} >
      <Spin spinning={loading} tip="Loading" />
    </div>
  )
}
CenterLoading.propTypes = {
  loading: PropTypes.bool,
}
