import React from 'react';
import {connect} from 'dva';
import IndexPage from '../components/Index';
import {message} from '../utils/index';
import jsonFormat from '../assets/js/jsonformat'

const mapStateToProps = ({index,app}) => {
    return ({index,app});
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    init(){
      dispatch({type:"index/resetState",payload:{}});
      dispatch({ type: 'index/getApiList',payload:{}});
    },
    onOkModal(){
      //dispatch({type:"index/setState",payload:{addModalVisible:false}});
      dispatch({type:"index/addApi",payload:{}});
    },
    onCancelModal(){
      dispatch({type:"index/setState",payload:{addModalVisible:false}});
    },
    onOkDelPop(deleteItem){
      dispatch({type:"index/setState",payload:{delPopVisible:false}});
      dispatch({type:"index/delApi",payload:{uri:deleteItem.id}});
    },
    onCancelDelPop(){
      dispatch({type:"index/setState",payload:{delPopVisible:false}});
    },
    showModal(item,type){
      dispatch({type:"index/setState",payload:{addModalVisible:true,addType:type,relItem:item}});
    },
    showDelModal(item){
      dispatch({type:"index/setState",payload:{delPopVisible:true,deleteItem:item}});
    },
    onChangeAddIpt(e){
      dispatch({type:"index/setState",payload:{newApi:e.target.value}});
    },
    onSelectItem(selectedKeys){
      if(!selectedKeys[0]) return;
      dispatch({type:"index/getApiDetail",payload:{uri:selectedKeys[0]}});
    },
    onRadioChange(e){
      dispatch({type:"index/setState",payload:{method:e.target.value}});
    },
    onChangeGet(value){
      
      dispatch({type:"index/changeGet",payload:value});
    },
    onChangePost(value){
      dispatch({type:"index/changePost",payload:value});
    },
    saveApiDetail(){
      dispatch({type:"index/saveApiDetail",payload:{}});
    }
    

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(IndexPage);
