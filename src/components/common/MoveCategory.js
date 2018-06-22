import React from 'react';
import {connect} from 'dva';
import styles from './MoveCategory.less';
import Confirm from './CvdConfirm';

function MoveCategory(props) {
  const {robot_admin,onCancel,onOk,onToggle} = props
  const {moveCategoryVisible,categoryList} = robot_admin

  let moveCategory = categoryList.map(item=>{
      if(!item.sub) return;
      const sub = item.sub.filter(i=>!i.default)
      if(sub.length > 0){
          return item
      }
  });
  moveCategory = moveCategory.filter(item=>item)//remove undefined item
  return (
    <Confirm 
            title="分类移动" 
            visible={moveCategoryVisible} 
            onCancel={onCancel} 
            okText="确认移动"
            width={520}
            onOk={onOk}
            extraClass="movecategory_modal"
        >
        <div className="category-list">
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
                                        className={"cvd-w-btn2 " + (item.checked_id === i.id ? 'active': '')}
                                        onClick={()=>{onToggle(item,i, item.checked_id === i.id)}}
                                        >{i.name}</span>
                                    })
                                }
                            </div>
                        </div>
                })
            }
        </div>
    </Confirm>
  );
}


const mapStateToProps = ({robot_admin}) => {
    return ({robot_admin});
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCancel(){
        dispatch({type:'robot_admin/setState',payload:{moveCategoryVisible:false}});
    },
    onToggle(parent,child, hasChecked){
      let newItem
      if(hasChecked){
        newItem = {...parent,checked_id:''}
      }else{
        newItem = {...parent,checked_id:child.id}
      }
      dispatch({type:'robot_admin/setCListItem',payload:newItem});
    }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(MoveCategory);