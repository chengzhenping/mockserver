import React from 'react';
import {connect} from 'dva';
import RelateModal from './RelateModal';
import {message} from '../../utils/index';


const mapStateToProps = ({common_addHotQuestion,loading}) => {
     return ({
      model: common_addHotQuestion,
      loading,
      okText: '确定',
      title: '添加常见问题'
    });
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleMenuSelect({id,key,item}){
      if(item.sub){
          dispatch({ type: 'common_addHotQuestion/setState',payload:{category_id_v1:key,category_id_v2:item.sub[0].id}});
      }else{
        dispatch({ type: 'common_addHotQuestion/setState',payload:{category_id_v2:key}});
      }
      
      dispatch({ type: 'common_addHotQuestion/fetchQalist',payload:{}});
    },
    changeChecked(item){
        let checked = !item.checked;
        const newItem =  {...item,checked};
        dispatch({type:'common_addHotQuestion/updateQItem',payload:newItem});
    },
    onSearch({keyword,category_id}){
        dispatch({type:'common_addHotQuestion/setState',payload:{keyword}});
        dispatch({type:'common_addHotQuestion/fetchQalist',payload:{keyword}});
    },
    onCancel(){
      dispatch({ type: 'common_addHotQuestion/setState',payload:{relateModalVisible:false}});
    },

    
    onOk(checkedItems){
        const ids = checkedItems.map(item=>item.id)
        const {onOkCallback} =ownProps
        if(ids && ids.length > 0){
            dispatch({'type':'common_addHotQuestion/setState',payload:{relateModalVisible:false}});
            dispatch({type:'common_addHotQuestion/addHot',payload:{ids,onOkCallback}});
        }else{
            message.error('请选择问题后进行添加')
        }
      
    },
    
   

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(RelateModal);
