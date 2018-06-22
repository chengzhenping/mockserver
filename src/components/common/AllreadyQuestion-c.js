import React from 'react';
import {connect} from 'dva';
import RelateModal from './RelateModal';

const mapStateToProps = ({common_allreadyQuestion,loading}) => {
    return ({
      model: common_allreadyQuestion,
      loading,
      okText: '确定',
      title: '学习到已有问题',
      muti: false
    });
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    init() {
      dispatch({ type: 'common_allreadyQuestion/resetState',payload:{}})
      dispatch({ type: 'common_allreadyQuestion/init',payload:{}})
    },
    onCancel(){
      dispatch({ type: 'common_allreadyQuestion/setState',payload:{relateModalVisible:false}});
    },
    handleMenuSelect({id,key,item}){
      if(item.sub){
          dispatch({ type: 'common_allreadyQuestion/setState',payload:{category_id_v1:key,category_id_v2:item.sub[0].id}});
      }else{
        dispatch({ type: 'common_allreadyQuestion/setState',payload:{category_id_v2:key}});
      }
      
      dispatch({ type: 'common_allreadyQuestion/fetchQaList',payload:{}});
    },
   /* changeChecked(item){
      let checked = !item.checked;
      const newItem = {...item,checked}
      dispatch({type:'common_allreadyQuestion/updateQItem',payload:newItem});
    },*/
    onOk(){
      const {okCallBack} = ownProps
      dispatch({type:'common_allreadyQuestion/addToQuestion',payload:{
        callback:okCallBack
      }});
    },
    onSearch({keyword}){
      dispatch({'type':'common_allreadyQuestion/setState',payload:{keyword}});
      dispatch({type:'common_allreadyQuestion/fetchQaList',payload:{}});
    },
    onRadioChange({target}){
      dispatch({ type: 'common_allreadyQuestion/setState',payload:{selectedId:target.value}});
    }

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(RelateModal);

