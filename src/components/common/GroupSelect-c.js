import React from 'react';
import {connect} from 'dva';
import GroupSelect from './GroupSelect';


const mapStateToProps = ({common_groupSelect,robot_official,loading}) => {
    return ({common_groupSelect,robot_official,loading});
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    init(){
        dispatch({ type: 'common_groupSelect/fetchCategary',payload:{}});
    },
    handleSelect(category_id){
      dispatch({ type: 'common_groupSelect/setState',payload:{category_id,confirmCategoryId:category_id}});
    },
    onChangeType(selectType){
      dispatch({ type: 'common_groupSelect/setState',payload:{selectType}});
    },
    onChangeName(newCategory){
      dispatch({ type: 'common_groupSelect/setState',payload:{newCategory}});
    },
    onSubmit({selectType,category_id,newCategory,onOk}){
      if(selectType === 0){
        //confirmCategoryId is not ready
        onOk();
      }else{
        dispatch({type:'common_groupSelect/createCategory',payload:{
          name: newCategory,
          id: category_id,
          callback: onOk
        }});
      }
      
    },
    onTab(parent,child){
      dispatch({ type: 'common_groupSelect/onTab',payload:{parent,child}});
    }
    
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(GroupSelect);
