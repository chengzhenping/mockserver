import React from 'react';
import {connect} from 'dva';
import RelateModal from './RelateModal';

const mapStateToProps = ({robot_custom}) => {
    return ({model: robot_custom});
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCancel(){
      debugger
      dispatch({ type: 'robot_custom/setState',payload:{relateModalVisible:false}});
    },
    handleMenuSelect({key,item}){
      if(item.sub){
          dispatch({ type: 'robot_custom/setState',payload:{category_id_v1:key,category_id_v2:item.sub[0].id}});
      }else{
        dispatch({ type: 'robot_custom/setState',payload:{category_id_v2:key}});
      }
      
      dispatch({ type: 'robot_custom/fetchRelateQuestions',payload:{}});
    },
    changeChecked(item){
      let checked = !item.checked;
      const newItem = {...item,checked}
      dispatch({ type: 'robot_custom/updateQItem',payload:newItem});
    },
    onOk(items){
      dispatch({'type':'robot_custom/setState',payload:{relateModalVisible:false}});
      dispatch({type:'robot_custom/addRelateQuestion',payload:items});
    },
    onSearch({keyword,id}){
      dispatch({'type':'robot_custom/setState',payload:{keyword}});
      dispatch({ type: 'robot_custom/fetchRelateQuestions',payload:{question_id:id,keyword}});
    }
    ///relate modal
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(RelateModal);
