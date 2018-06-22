import React from 'react';
import styles1 from './CvdSearch.less';
import styles2 from './CvdSearchSelect.less';
import { Button,Tabs,Pagination,Dropdown,Menu,Modal,Checkbox,Tooltip ,Spin,Progress} from 'antd';
class CvdSearchSelect extends React.Component{
  static defaultProps = {
    onSearch(key){

    },
    onSelect(){

    },
    data:[]
  }
  constructor(props) {
    super(props);
    this.state = {
      isShowDropDown:false
    }
    this.onSearchCheck = this.onSearchCheck.bind(this)
  }
  onSearchCheck(key){
    const {onSearch} = this.props
    this.setState({isShowDropDown:Boolean(key)})
    onSearch(key)
  }
  render() {
    const {onSearchCheck,state,props,refs} = this
    const {isShowDropDown} = state
    const {onSearch,data,onSelect} = props
    const {searchInput} = refs

    const menu = (<Menu 
    onSelect={(prop)=>{
      this.setState({isShowDropDown:false})
      onSelect(prop)
    }}>
      {
        data.map((item,i) => {
          return <Menu.Item key={item.id}>{item.question}</Menu.Item>
        })
      }
    </Menu>)
    
    return (
      <Dropdown overlay={menu} trigger={[]} visible={isShowDropDown && data.length > 0} placement="topLeft">
      <div className="cvd-search-bar">
        <input 
        ref="searchInput"
        className="cvd-search-ipt" 
        placeholder="输入关键词搜索已存在的相关问题"
        onChange={(e)=>{
          const key = e.target.value;
          onSearchCheck(key)
        }}  
        />
        <span className="fa fa-search"
        onClick={()=>{
          onSearchCheck(searchInput.value);
        }}>
        </span>

        
      </div>
      </Dropdown>
    );
  }
}
export default CvdSearchSelect;
