import React from 'react';
import styles from './Index.less';
import { Modal,Dropdown,Menu,Checkbox, Radio,Icon,Tooltip,Tree } from 'antd';
import Confirm from './common/CvdConfirm';
import keycode from 'keycode';
import CvdTips from './common/CvdTips'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;
/*import Form from "react-jsonschema-form";*/
import {Controlled  as CodeMirror} from 'react-codemirror2'
import jsonFormat from '../assets/js/jsonformat'


require("!style!css!codemirror/lib/codemirror.css")
require("!style!css!codemirror/theme/material.css")
require("!style!css!codemirror/theme/dracula.css")
require("!style!css!codemirror/theme/blackboard.css")
require("!style!css!codemirror/theme/mbo.css")
require("!style!css!codemirror/theme/ttcn.css")

require("!style!css!codemirror/theme/solarized.css")
require("!style!css!codemirror/theme/monokai.css")
require("!style!css!codemirror/theme/eclipse.css")

require("!style!css!codemirror/theme/material.css")

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');


const cmOptions = {
  theme: "blackboard",
  height: "auto",
  viewportMargin: Infinity,
  mode: {
    name: "javascript",
    json: true,
    statementIndent: 2,
  },
  lineNumbers: true,
  lineWrapping: true,
  indentWithTabs: false,
  tabSize: 2,
};

class Index extends React.Component{
  constructor(props) {
    super(props);
    this.renderMenuTree = this.renderMenuTree.bind(this)
  }
  componentDidMount(){
    const {location,init} = this.props;
    init()
  }

  renderMenuTree(data){
    const {showModal,showDelModal} = this.props
    const {renderMenuTree} = this
    return data.map(item => {
        return (
          <TreeNode  key={item.id} title={
            <span>{item.name}  
              <span className="op-list">
                <Tooltip title="添加api"><Icon type="file-add"  onClick={()=>{showModal(item)}}/></Tooltip>
                {
                  item.id !== '/' &&
                  <Tooltip title="删除api"><Icon type="delete"  onClick={()=>{showDelModal(item)}}/></Tooltip>
                }
              </span>
            </span>
          }>
            {
              item.children &&
              renderMenuTree(item.children)
            }
          </TreeNode>
          
        )
      })
    
  }
  render() {
    const {index,app,onOkModal,onCancelModal,onChangeAddIpt,
      onCancelDelPop,onOkDelPop,showDelModal,onSelectItem,onRadioChange,
      onChangeGet,onChangePost,
      saveApiDetail
    } = this.props
    const {apiList,addModalVisible,newApi,currentApi,delPopVisible,deleteItem,method,currentDetail} = index
    const {caculateHeight} = app
    const {json_editor} = caculateHeight
    const {renderMenuTree} = this

   
    const {log} = console
    return (
      <div className="index-root">
        <div className="menu-wraper">
            <Tree
              showLine
              defaultExpandedKeys={['/']}
              onSelect={(prop)=>{
                onSelectItem(prop)
              }}
            >
              {renderMenuTree(apiList)}
              
            </Tree>
        </div>
        {
          currentApi &&
          <div className="detail-wraper">
            <h3 className="tt">mock数据： {currentApi.id}</h3>
            <RadioGroup onChange={onRadioChange} value={method}>
              <Radio value="GET">GET</Radio>
              <Radio value="POST">POST</Radio>
            </RadioGroup>
            <div className="editor_wraper" style={{height:json_editor}}>

            {
              method === 'GET' ?
              <CodeMirror
              value={currentDetail.GET}
              options={cmOptions}
              onBeforeChange={(editor, data, value) => {
                onChangeGet(value)
              }}
            />:
            <CodeMirror
              value={currentDetail.POST}
              options={cmOptions}
              onBeforeChange={(editor, data, value) => {
                onChangePost(value)
              }}
            />
            }
            </div>
            <div className="bottom">
              <button className="cvd-g-btn1" onClick={saveApiDetail}>保存</button>
            </div>
          </div>
        }
        

        <Confirm
          title="创建API" 
          visible={addModalVisible} 
          onCancel={onCancelModal} 
          width={380}
          okText="创建"
          onOk={onOkModal}
          extraClass="folder-add"
        >
          <input onChange={onChangeAddIpt} 
          onKeyDown={(e)=>{
            if(keycode(e.which) == 'enter'){
              onOkModal()
            }
          }}   
          className="cvd-input2" value={newApi}/>
        </Confirm>
        <Confirm
          title="删除确认" 
          visible={delPopVisible} 
          onCancel={onCancelDelPop} 
          width={380}
          okText="确认"
          onOk={()=>{onOkDelPop(deleteItem)}}
          extraClass="folder-add"
        >
          {
            deleteItem &&
            <div className="d">
              <p className="d">确认删除 {deleteItem.name} 吗?</p>
              {
                deleteItem.children &&
                <p className="d">该目录下的所有api都会一并删除</p>
              }
            </div>
          }
        </Confirm>
        <CvdTips />
      </div>
    );
  }
}
export default Index;
