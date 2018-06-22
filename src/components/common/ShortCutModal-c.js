import React from 'react';
import {connect} from 'dva';
import ShortCutModal from './ShortCutModal';
import {message} from '../../utils/index';
import C from '../../utils/server/channel/index';

//容器组件
const mapStateToProps = ({common_ShortCutModal,loading}) => {
    return ({
      loading,
      common_ShortCutModal,
    });
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCancel: () => {
      dispatch({type:"common_ShortCutModal/setState",payload:{visible:false}});
    },
    changeAddGroupStatus(s){
      //编辑状态时 先收起其他的
      if(s == 1){
        dispatch({type:"common_ShortCutModal/updateGroupField",payload:{editStatus:0}});
      }

      dispatch({type:"common_ShortCutModal/setState",payload:{addGroupStatus:s}});
    },
    changeGroupStatus(item,s){
      //编辑状态时 ,先收起其他的
      if(s == 1){
        dispatch({type:"common_ShortCutModal/setState",payload:{addGroupStatus:0}});
        dispatch({type:"common_ShortCutModal/updateGroupField",payload:{editStatus:0}});
      }
      
      dispatch({type:"common_ShortCutModal/updateGroupItem",payload:{id:item.id,newItem:{...item,editStatus:s}}});
    },
    changeAddWordStatus(groupItem,s){
      //编辑状态时 先收起其他的
      let packupWords = groupItem.words.map(i=>{return {...i,editStatus:0}});
      if(s == 1){
        dispatch({type:"common_ShortCutModal/updateGroupItem",payload:{id:groupItem.id,newItem:{...groupItem,words:packupWords}}});

      }
      
      dispatch({type:"common_ShortCutModal/setState",payload:{addWordStatus:s}});
    },
    changeWordItemStatus(groupItem,wordItem,s){
      //编辑状态时  先收起其他的
      let packupWords = groupItem.words;
      if(s == 1){
        packupWords = groupItem.words.map(i=>{return {...i,editStatus:0}});
        dispatch({type:"common_ShortCutModal/setState",payload:{addWordStatus:0}});
        dispatch({type:"common_ShortCutModal/updateGroupItem",payload:{id:groupItem.id,newItem:{...groupItem,words:packupWords}}});
      }
      let newWords = packupWords.map(i=>{
        if(i.id == wordItem.id){
          return {...i,editStatus:s};
        }
        return i;
      })

      //再展开
      dispatch({type:"common_ShortCutModal/updateGroupItem",payload:{id:groupItem.id,newItem:{...groupItem,words:newWords}}});
    },

    changeNewGroupName(name){
      dispatch({type:"common_ShortCutModal/setState",payload:{newGroupName:name}});
    },
    changeNewWordName(name){
      dispatch({type:"common_ShortCutModal/setState",payload:{newWordName:name}});
    },
    onAddGroup(name){
      if(name === ''){
        return dispatch({type:"common_ShortCutModal/setState",payload:{addGroupStatus:0}});
      } 
      dispatch({type:"common_ShortCutModal/addGroup",payload:{name}});
    },
    onTab(item){
      dispatch({type:"common_ShortCutModal/setState",payload:{currentGroupId:item.id}});
    },
    
    changeGroupName(item,name){
      dispatch({type:"common_ShortCutModal/updateGroup",payload:{item,name}});
    },
    deleteGroupItem(item){
      dispatch({type:"common_ShortCutModal/delGroup",payload:item});
    },
    changeWordItemName(groupItem,wordItem,content){
      if(content.length > 600){
        return message.error('不能超过600个字符');
      }
      dispatch({type:"common_ShortCutModal/updateWords",payload:{groupItem,wordItem,content}});
    },
    delWordsItem(groupItem,wordItem){
      dispatch({type:"common_ShortCutModal/delWord",payload:{groupItem,wordItem}});
    },
    onAddWords(group,content){
      if(content.length > 600){
        return message.error('不能超过600个字符');
      }

      dispatch({type:"common_ShortCutModal/setState",payload:{addWordStatus:0}});
      if(content === ''){
        return false;
      } 
      dispatch({type:"common_ShortCutModal/addWords",payload:{group,content}});
    },
    onSendMsg(msg){
      C.onSendMsg(msg);
    }

  }
}
                
export default connect(mapStateToProps,mapDispatchToProps)(ShortCutModal);