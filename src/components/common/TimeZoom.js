import React from 'react';
import {connect} from 'dva';
import styles from './TimeZoom.less';
import TimeSelect from './TimeSelect';
import moment from 'moment';
import {TIME_CONST} from '../../utils/index';

function TimeZoom(props) {
  const {onSelect,showSelectTimeModal,currentDateTab} = props
  return (
    <div className="time-zoom-root">
      <span className={"cvd-b-btn1 " + (currentDateTab === 0 ? 'active': '')} onClick={()=>{onSelect({start_time:TIME_CONST.todayStartSec,end_time:TIME_CONST.tomorrowStartSec-1,tab:0})}}>今天</span>
      <span className={"cvd-b-btn1 " + (currentDateTab === 1 ? 'active': '')} onClick={()=>{onSelect({start_time:TIME_CONST.yesterdayStartSec,end_time:TIME_CONST.todayStartSec-1,tab:1})}}>昨天</span>
      <span className={"cvd-b-btn1 " + (currentDateTab === 2 ? 'active': '')} onClick={()=>{onSelect({start_time:TIME_CONST.weekStartSec,end_time:TIME_CONST.tomorrowStartSec-1,tab:2})}}>7天</span>
      <span className={"cvd-b-btn1 " + (currentDateTab === 3 ? 'active': '')} onClick={()=>{onSelect({start_time:TIME_CONST.monthStartSec,end_time:TIME_CONST.tomorrowStartSec-1,tab:3})}}>30天</span>
      <span className={"cvd-b-btn1 " + (currentDateTab === 4 ? 'active': '')} onClick={showSelectTimeModal}>自定义时间段</span>
      <TimeSelect {...props} />

    </div>
  );
}

export default TimeZoom;
