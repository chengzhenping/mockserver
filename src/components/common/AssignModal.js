import React from 'react';
import {connect} from 'dva';
import styles from './AssignModal.less';
import Confirm from './CvdConfirm';
import { Modal,Dropdown,Menu,Checkbox, Radio } from 'antd';
import SearchBar from './CvdSearch';
const RadioGroup = Radio.Group;

function AssignModal(props) {
  const {onCancel,onOk,onRadioChange,model,onSearch} = props
  const {assignVisible,memberList,assignId,allList} = model
  return (
    <Confirm 
            title="指派人员处理" 
            visible={assignVisible} 
            onCancel={onCancel} 
            width={520}
            okText="确认"
            onOk={onOk}
            extraClass="assign_modal"
        >
        <SearchBar onSearch={(keyword)=>{onSearch({keyword,allList})}} />
        <RadioGroup onChange={onRadioChange} value={assignId}>
          <div className="row-item">
            <span className="col">昵称</span>
            <span className="col">账号</span>
            <span className="col">备注</span>

          </div>
          {
            memberList.map(item=>{
              return <div className="row-item" key={item.id}>
                <span className="col">
                  <Radio value={item.id}><span className="lb">{item.nick}</span></Radio>
                </span>
                <span className="col">{item.phone}</span>
                <span className="col">{item.note}</span>
              </div>
            })
          }
          
        </RadioGroup>
    </Confirm>
  );
}
const mapStateToProps = ({robot_learn}) => {
    return ({model: robot_learn});
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCancel(){
      dispatch({ type: 'robot_learn/setState',payload:{assignVisible:false}});
    },
    onOk(){
      dispatch({type:'robot_learn/assignTo',payload:{}});
    },
    onRadioChange(e){
      let val = e.target.value
      dispatch({'type':'robot_learn/setState',payload:{assignId:val}});
    },
    onSearch({keyword,allList}){
      let searchResult = allList.filter(item => item.nick.indexOf(keyword) > -1)
      dispatch({ type: 'robot_learn/setState',payload:{memberList:searchResult}});
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AssignModal);
