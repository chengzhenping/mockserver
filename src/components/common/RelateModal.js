import React from 'react';
import {connect} from 'dva';
import { Modal,Dropdown,Menu,Checkbox, Radio } from 'antd';
import confirmStyle from  './CvdConfirm.less';
import styles from './RelateModal.less';
import ScrollArea from 'react-scrollbar';
import * as QaAPI from '../../services/qa/index';
import SearchBar from './CvdSearch';
import _ from 'lodash';

const RadioGroup = Radio.Group;
/* 用在关联问题和学习到已有问题等弹层 */
class RelateModal extends React.Component{
  static defaultProps = {
    okText: '确认添加',
    title: '关联问题',
    muti: true, //多选,false单选
    cancelText: '取消',
  }
  constructor(props) {
      super(props);
  }
  componentWillMount(){
    const {init} = this.props
    if (init && init instanceof Function) {
      init()
    }
  }
  checkedItems(){
      const {model} = this.props;
      const {questionList} = model;
      return questionList.filter((item)=>{return item.checked;})
  }
  checkedIds(){
      const checkedQa = this.checkedItems();
      return checkedQa.map((item)=>{return item.id});
  }
  render() {
    const {onCancel,model,loading,
      handleMenuSelect,
      changeChecked,
      onOk,
      onSearch,

      okText,
      title,
      cancelText,
      muti,
      onRadioChange,
    } = this.props;
    const {relateModalVisible,questionList,category_id_v1,category_id_v2,categoryList,id,keyword,selectedId} = model;

    const currentC = categoryList.find((item)=>item.id === category_id_v1);
    let currentV2
    let c1Name = currentC ? currentC.name : '未分类';
    if(currentC && currentC.sub){
      currentV2 = currentC.sub.find((item)=>item.id === category_id_v2);
    }
    let c2Name = currentV2 ? currentV2.name : '未分类'
    

    const checkedItems = this.checkedItems();

    function findItemById(arr,id){
      for(let i = 0,len = arr.length; i < len; i++){
        if(arr[i].id === id){
          return arr[i]
        }else if(arr[i].sub && arr[i].sub.length){
          let foundItem =  findItemById(arr[i].sub,id)
          if(foundItem){ 
            return foundItem
          }
        }
      }
    }
    return (
      <Modal 
        width={520}
        cancelText={cancelText}
        title={title}
        okText={okText}
        onOk={()=>{onOk(checkedItems)}}
        onCancel={onCancel} 
        visible={relateModalVisible}
        children={
          
          <div className="c-container">  
            <div className="category">
              <span className="lb">分类选择：</span>
              <Dropdown overlay={
                <Menu 
                selectedKeys={[category_id_v1]} 
                onSelect={({key})=>{
                  let item = findItemById(categoryList,key)
                  handleMenuSelect({id,key,item})
                }} 
                className="cvd-drop-down">
                    {categoryList.map((item)=>{
                      return (
                        <Menu.Item key={item.id}>{item.name}</Menu.Item>
                      )
                    })}
                </Menu>
              }>
                <div className="cvd-w-btn1">
                      {c1Name}
                      <span className="fa fa-sort-desc"></span>
                  </div>
              </Dropdown>
              <Dropdown overlay={
                <Menu selectedKeys={[category_id_v2]}
                onSelect={({key})=>{
                  let item = findItemById(categoryList,key)
                  handleMenuSelect({id,key,item})
                }} 
                className="cvd-drop-down">
                    {
                      currentC && currentC.sub && 
                      currentC.sub.map((item)=>{
                      return (
                        <Menu.Item key={item.id}>{item.name}</Menu.Item>
                      )
                    })}
                </Menu>
              }>
                <div className="cvd-w-btn1">
                      {c2Name}
                      <span className="fa fa-sort-desc"></span>
                  </div>
              </Dropdown>
              <SearchBar onSearch={(keyword)=>{onSearch({keyword,id})}} />
            </div>

            <div className="clist">
              {
                questionList.length > 0 ?
                <ScrollArea
                  speed={0.3}
                  className="area"
                  contentClassName="content"
                  horizontal={false}
                  smoothScrolling={true}
                  ref={(el) => { this.scrollArea = el;}}
                  >
                  <div className="inner-content">
                    {
                      muti ? 
                      questionList.map((item)=>{
                          return (
                            <div key={item.id} className="clist-item">
                              <Checkbox 
                              checked={item.checked} 
                              onChange={()=>{changeChecked(item)}} 
                              /*disabled={item.related}*/
                              >
                                <span className="lb">{item.question}</span>
                              </Checkbox>
                              {item.related && <span className="relate-state">已关联</span>}
                            </div>
                          )
                      }):
                      <RadioGroup onChange={onRadioChange} value={selectedId}>
                        {
                          questionList.map((item)=>{
                            return (
                              <div key={item.id} className="clist-item">
                                <Radio value={item.id}><span className="lb">{item.question}</span></Radio>
                                {item.related && <span className="relate-state">已关联</span>}
                              </div>
                            )
                          })
                        }
                      </RadioGroup>
                    }
                  </div>
                </ScrollArea>:
               <div className="empty-list">
                    <span className="ion-information-circled"></span>
                    <p className="d">
                        未找到相关数据
                    </p>
                </div>
            }
            </div>
          </div>
          
        }
        className="confirm_modal relate_modal__dfsE3"
        maskClosable={false}
      />
    
    );
  }
}
export default RelateModal;



