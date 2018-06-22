import React from 'react';
import { connect } from 'dva';
import { Modal,Dropdown,Menu,Checkbox,Select,Radio} from 'antd';
import styles from './GroupSelect.less';
const RadioGroup = Radio.Group;
const Option = Select.Option;

class GroupSelect extends React.Component{
  static defaultProps = {
    onCancel:()=>{},
    onOk:()=>{},
    visible:true,
  }
  constructor(props) {
      super(props);
      const {init} = props;
      init()
  }
  componentWillReceiveProps(props){
    //if(props.category_id && !category_id){
      // /this.setState({newCategory:props.newCategory})
    //}
  }
  render() {
    const {common_groupSelect,robot_official,visible,onCancel,onOk,
      handleSelect,
      onChangeType,
      onChangeName,
      onSubmit,
      onTab
    } = this.props
    const {selectType,category_id,categoryList,newCategory} = common_groupSelect;
    const {selectedNum} = robot_official
    let moveCategory = categoryList.map(item=>{
        if(!item.sub) return;
        const sub = item.sub.filter(i=>!i.default)
        if(sub.length > 0){
            return item
        }
    });
    moveCategory = moveCategory.filter(item=>item)//remove undefined item
    return (
      <Modal 
        width={520}
        cancelText="取消"
        title="分类选择"
        okText="添加"
        onOk={()=>{onSubmit({selectType,category_id,newCategory,onOk})}}
        onCancel={onCancel} 
        visible={visible}
        children={
            <div className="children">
              <div className="t-lb">共选择{selectedNum}条行业语义问题，请选择分类添加</div>
              <RadioGroup onChange={(e)=>{onChangeType(e.target.value)}} value={selectType}>
                <div className="categorys block-item">
                  <div className="c-left">
                      <Radio value={0}>已有分类：</Radio>
                  </div>
                  <div className="category-list c-right">
                      {
                          moveCategory.map(item=>{
                              return item.sub && item.sub.length > 0 &&
                                  <div className="category-item" key={item.id}>
                                      <span className="lb-left">{item.name}：</span>
                                      <div className="sub-list">
                                          {
                                              item.sub.map(i=>{
                                                  return <span 
                                                  key={i.id} 
                                                  className={"cvd-w-btn2 " + (item.current_id == i.id ? 'active': '')}
                                                  onClick={()=>{onTab(item,i)}}
                                                  >{i.name}</span>
                                              })
                                          }
                                      </div>
                                  </div>
                              
                          })
                      }
                  </div>
                </div>
                <div className="new-category block-item">
                  <div className="c-left">
                    <Radio value={1}>新建分类：</Radio>
                  </div>
                  <div className="c-right clearfix">
                    <Select
                      showSearch
                      disabled={selectType === 0}
                      placeholder="选择分类"
                      optionFilterProp="children"
                      onChange={handleSelect}
                      value={category_id}
                    >
                        {categoryList.map((item)=>{
                          return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                        })}
                    </Select>
                    <input disabled={selectType === 0} ref={(s)=>{this.newIpt = s;}} 
                    onChange={(e)=>{onChangeName(e.target.value)}} 
                    value={newCategory}  
                    className="cvd-input2"/>
                  </div>
                </div>
              </RadioGroup>
            </div>
           
        }
        className="confirm_modal group_select_root"
        maskClosable={false}
      />
    
      
    );
  }
}

export default GroupSelect;
