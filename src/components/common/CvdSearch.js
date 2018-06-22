import React from 'react';
import styles from './CvdSearch.less';
import keycode from 'keycode';

class CvdSearch extends React.Component{
  static defaultProps = {
    onSearch(key){

    },
    fixed:false
  }
  constructor(props) {
    super(props);
    this.state = {
      collapsed:true,
      status:0,//0,未搜索，1搜索中
    }
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(key){
    const {onSearch} = this.props;
    const {searchInput} = this.refs;
    //searchInput.value = "";
    this.setState({collapsed:true});
    onSearch(key);
  }
  render() {
    const {collapsed,status} = this.state;
    const {onSearch,fixed} = this.props;
    const {onSubmit} = this;
    const {searchInput} = this.refs;
    return (
      <div 
      className={"cvd-search-bar " +((collapsed && !fixed) ? "collapsed":"")} 
      onMouseEnter ={
        ()=>{
          this.setState({collapsed:false});
          setTimeout(()=>{
            searchInput.focus();
          },500)
        }
      }>
          <input 
          ref="searchInput"
          className="cvd-search-ipt" 
          placeholder="请输入关键词"
          onKeyDown={(e)=>{
            const key = e.target.value;
            if(keycode(e.which) == 'enter'){
                this.setState({status:1});
                onSubmit(key);
            }
          }}  
          onBlur={(e)=>{
            const key = e.target.value;
            //onSubmit(key);
            
          }} 
          />
          {
            status == 0 ?
            <span className="fa fa-search"
            
            onClick={()=>{
                if(searchInput.value != ""){
                  this.setState({status:1});
                }
                onSubmit(searchInput.value);
            }}>
            </span>:
            <span 
            className="ion-android-cancel"
            onClick={()=>{
              searchInput.value = "";
              this.setState({status:0});
              onSubmit("");
            }}
            ></span>
          }
          
      </div>
    );
  }
}

export default CvdSearch;
