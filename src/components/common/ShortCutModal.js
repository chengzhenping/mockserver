import React from 'react';
import { Modal} from 'antd';
import keycode from 'keycode';
import styles from './ShortCutModal.less';
import PropTypes from 'prop-types';

class ShortCutModal extends React.Component{
  constructor(props) {
        super(props);
  }
  render() {
    const {
      common_ShortCutModal,
      onCancel,
      changeAddGroupStatus,
      changeNewGroupName,
      changeNewWordName,
      onTab,
      onAddGroup,
      changeGroupStatus,
      changeGroupName,
      deleteGroupItem,

      onAddWords,
      changeAddWordStatus,
      changeWordItemStatus,
      changeWordItemName,
      delWordsItem,
      onSendMsg,
      } = this.props;
    const {visible,currentGroupId,addGroupStatus,addWordStatus,shortcutList,newGroupName,newWordName} = common_ShortCutModal;

    const currentGroup = shortcutList.find((i)=>i.id === currentGroupId);
    return (
       <Modal 
          width={720}
          className="shortcut_modal"
          title="快捷语管理" 
          visible={visible} 
          onCancel={onCancel} 
          footer={null}
          maskClosable={false}
        >   
            <div className="custom-main clearfix">
              <div className="left-side">
                <div className="top-area">
                  {
                    addGroupStatus == 0 ? 
                    <button className="cvd-g-btn2" onClick={()=>{
                      changeAddGroupStatus(1);
                    }}>
                      <span className="ion-android-add"></span>
                      添加分类
                    </button> :
                    <input 
                     maxLength="10"
                      value={newGroupName}
                      onChange={(e)=>{changeNewGroupName(e.target.value)}}
                      onKeyDown={(e)=>{
                          if(keycode(e.which) == 'enter'){
                              onAddGroup(newGroupName)
                          }
                      }}  
                     onBlur={()=>{
                      onAddGroup(newGroupName);
                     }} 
                     placeholder="输入分类名" 
                     className="cvd-input "/>
                  }
                </div>
                
                <div className="group-list">
                    {
                      shortcutList.length > 0 &&
                      shortcutList.map(item=>{
                        return (
                          item.editStatus == 0 ?
                          <div key={item.id} className={"group-item status0 clearfix "+(currentGroupId == item.id ? 'current' : '')}>
                                <span className="group-name" onClick={()=>{onTab(item)}}>{item.name}</span>
                                <div className="edit-area">
                                    <span className="fa fa-pencil-square-o" onClick={()=>{changeGroupStatus(item,1)}}></span>
                                    <span className="ion-android-remove-circle" onClick={()=>{changeGroupStatus(item,2)}}></span>
                                </div>
                          </div>:
                          item.editStatus == 1 ?
                          <div key={item.id} className={"group-item status1 clearfix "+(currentGroupId == item.id ? 'current' : '')}>
                            <input 
                              maxLength="10"
                              onKeyDown={(e)=>{
                                  if(keycode(e.which) == 'enter'){
                                      changeGroupName(item,e.target.value)
                                  }
                              }}  
                              className="cvd-input" defaultValue={item.name} 
                              onBlur={(e)=>{changeGroupName(item,e.target.value)}} 
                              placeholder="分类名称" />
                          </div>:
                          <div key={item.id} className={"group-item status2 clearfix "+(currentGroupId == item.id ? 'current' : '')}>
                            <div className="name-ipt">
                                <span className="group-name">{item.name}</span>
                                <div className="btn-area">
                                    <span className="cvd-gray-btn2" onClick={()=>{changeGroupStatus(item,0)}}>取消</span>
                                    <span className="cvd-r-btn1" onClick={()=>{deleteGroupItem(item)}}>删除</span>
                                </div>
                            </div>
                        </div>
                        )
                      })
                    }
                    
                </div>
              </div>
              {
              currentGroupId &&
              <div className="right-side">
                <div className="top-area content-width">
                  {
                    addWordStatus == 0 ? 

                    <button className="cvd-g-btn2" onClick={()=>{
                      changeAddWordStatus(currentGroup,1);
                    }}>
                      <span className="ion-android-add"></span>
                      添加快捷语
                    </button> :
                    <textarea
                     maxLength="100"
                     value={newWordName}
                     onChange={(e)=>{changeNewWordName(e.target.value)}}
                     onBlur={(e)=>{
                      onAddWords(currentGroup,e.target.value);
                     }} 
                      placeholder="输入快捷语内容" className="cvd-textarea" />
                  }
                </div>
                <div className="short-words-list">
                    {
                      currentGroup  &&
                      currentGroup.words.length > 0 ?
                      currentGroup.words.map(i=>{
                        return (
                          i.editStatus == 0 ?
                          <div key={i.id} className="group-item status0">
                              <span className="group-name content-width">{i.content}</span>
                              <div className="edit-area">
                                    <span className="fa fa-pencil-square-o" onClick={()=>{changeWordItemStatus(currentGroup,i,1)}}></span>
                                    <span className="ion-android-remove-circle" onClick={()=>{changeWordItemStatus(currentGroup,i,2)}}></span>
                                </div>
                          </div>:
                          i.editStatus == 1 ?
                          <div key={i.id}  className="group-item status1">
                            <textarea 
                              maxLength="100"
                              className="cvd-textarea" 
                              defaultValue={i.content} 
                              onBlur={(e)=>{changeWordItemName(currentGroup,i,e.target.value)}} 
                              placeholder="分类名称" />
                          </div>:
                          <div key={i.id}  className="group-item status2">
                              <span className="group-name content-width">{i.content}</span>
                              <div className="btn-area">
                                  <span className="cvd-gray-btn2" onClick={()=>{changeWordItemStatus(currentGroup,i,0)}}>取消</span>
                                  <span className="cvd-r-btn1" onClick={()=>{delWordsItem(currentGroup,i)}}>删除</span>
                              </div>
                          </div>
                        )
                      }) :
                      <div className="empty">
                          <p>还没有设置快捷语</p>
                          <p>设置后，可自动匹配输入的文字快速调用</p>
                      </div>
                    }
                    
                </div>
              </div>
              }
            </div>
        </Modal>
    );
  }
}
export default ShortCutModal;
