import React from 'react';
import styles from './TimeSelect.less';
import Confirm from './CvdConfirm';
import { DatePicker } from 'antd';
import moment from 'moment';
import  {TIME_CONST} from '../../utils/index';
const today = moment().format('YYYY-MM-DD')
function TimeSelect(props) {
  const {timeModalVisible,onCancel,onOk,onChange,startDate,endDate} = props
  const format = 'YYYY/MM/DD';
  return (
    <Confirm 
          title="选择时间段" 
          visible={timeModalVisible} 
          onCancel={onCancel} 
          width={380}
          okText="确认"
          onOk={onOk}
          extraClass="time_select_modal"
      >
      <div className="start-date select-item">
        <span className="lb-left">开始时间</span>
        <DatePicker 
        defaultValue={startDate} 
        format={format} 
        onChange={(date)=>{
          const day = date.format(format)
          let startDate
          if(day === today){
            startDate = date
          }else{
            startDate = date.hour(0).minute(0).second(0).millisecond(0)
          }
          onChange({startDate})
        }}/>
      </div>
      <div className="end-date select-item">
        <span className="lb-left">结束时间</span>
        <DatePicker 
        defaultValue={endDate} 
        format={format}  
        onChange={(date)=>{
          const day = date.format(format)
          let endDate
          if(day === today){
            endDate = date
          }else{
            endDate = date.hour(23).minute(59).second(59).millisecond(0)
          }
          onChange({endDate})
        }}/>
      </div>
      
    
  </Confirm>
  );
}

export default TimeSelect;
