import React from 'react';
import {connect} from 'dva';
import { Modal} from 'antd';
import styles from './GroupModal.less';
import keycode from 'keycode';
import {message,loading} from '../../utils/index';
class GroupModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            onAddingGroup:false
        }
        const {dispatch,categoryList,usePropData} = props;

        this.changeStatus = this.changeStatus.bind(this)
        this.changeName = this.changeName.bind(this)
        this.delCategoryItem = this.delCategoryItem.bind(this)
    }   
    componentWillReceiveProps(props){
       
    }
    addGroupStatus(status){
        const {dispatch} = this.props;
        this.setState({onAddingGroup:status})
        if(status){
            setTimeout(()=>{
                this.nameCreateIpt.focus();
            },0);
        }
    }
    //change item status
    changeName(item,e,parentCategory){
        const {dispatch,changeItem,updateCategory,updateSubCategory} = this.props;
        const {changeStatus} = this
        let val = e.currentTarget.value;
        let limitLength = 6;
        if(parentCategory){
            limitLength = 10
        }
        if(val === '') return;
        if(val.length > limitLength){
            e.target.value = item.name
            return message.error('分类长度不能超过'+limitLength+'个字符')
        }
        if(val === item.name) return changeStatus(item,0,parentCategory);
        if(parentCategory){
            let newItem = {...parentCategory}
            let subItem = newItem.sub.find(i=>i.id === item.id)

            subItem.name = val
            subItem.editStatus = 0

            changeItem(newItem)
        }else{
            let newItem = {...item,name:val,editStatus:0};
            changeItem(newItem);
        }
        
        if(parentCategory){
            updateSubCategory({name:val,id:item.id,parentCategory})
        }else{
            updateCategory({name:val,id:item.id})
        }
    }
    delCategoryItem(item,e,parentCategory){
        const {deleteItem,deleteSubItem} = this.props;
        if(parentCategory){
            deleteSubItem({id:item.id,parentCategory})
        }else{
            deleteItem({id:item.id})
        }
        
    }
    changeStatus(item,editStatus,parentCategory){
        const {changeItem} = this.props
        if(parentCategory){
            let newItem = {...parentCategory}
            let subItem = newItem.sub.find(i=>i.id === item.id)
            subItem.editStatus = editStatus
            changeItem(newItem)
            //...
        }else{
            item = {...item,editStatus};
            changeItem(item)
        }
    }
    ItemRender({data , className,parentCategory,list}){
        let item = null;
        const {onTab,changeItem} = this.props
        const {changeStatus,changeName,delCategoryItem} = this
        switch (data.editStatus){
            case 0:
                item = (
                    <div 
                    className={"group-item status0 clearfix " + (className || '')}
                    onClick={()=>{
                        if(!parentCategory){
                            onTab(data.id)
                        }
                    }}
                    >
                        <span className="group-name">{data.name}</span>
                        <div className="edit-area">
                            <span className="fa fa-pencil-square-o" onClick={(e)=>{
                                changeStatus(data,1,parentCategory)
                                setTimeout(()=>{
                                    this['ipt_'+data.id].focus()
                                },500)
                                e.stopPropagation()
                            }}></span>
                            {
                                (parentCategory || list.length > 1) && 
                                <span className="ion-android-remove-circle" onClick={(e)=>{
                                   changeStatus(data,2,parentCategory) 
                                   e.stopPropagation()
                                }}></span>
                            }
                            
                        </div>
                    </div>
                );
                break;
            case 1:
                item = (
                    <div className={"group-item status1 clearfix " + className}>
                      <input
                        ref={(input) => { this['ipt_'+data.id] = input; }}
                        onKeyDown={(e)=>{
                            if(keycode(e.which) == 'enter'){
                                changeName(data,e,parentCategory)
                            }
                        }}  
                        className="cvd-input" defaultValue={data.name} 
                        onBlur={(e)=>{
                            changeName(data,e,parentCategory)
                        }} 
                        placeholder="分类名称" />
                    </div>
                );
                break;
            case 2:
                item = (
                    <div className={"group-item status2 clearfix " + className}>
                        <div className="name-ipt">
                            <span className="group-name">{data.name}</span>
                            <div className="btn-area">
                                <span className="del" onClick={(e)=>{
                                    delCategoryItem(data,e,parentCategory)
                                    e.stopPropagation()
                                }}>删除</span>
                                <span className="cancel" onClick={(e)=>{
                                    changeStatus(data,0,parentCategory)
                                    e.stopPropagation()
                                }}>取消</span>
                            </div>
                        </div>
                    </div>
                );
                break;
            default:break;
        }
        return item;
    }
    render(){
        const {
            dispatch,
            robot_admin,
            onCancel,


            showIpt,
            createCategory,
            createSubCategory
        } = this.props;
        const {
            groupVisible,
            categoryList,
            currentCategoryId,
            showLeftCreateIpt
        } = robot_admin;
        const ItemRender = this.ItemRender.bind(this);
        const {onAddingGroup} = this.state;

        const currentCategory = categoryList.find(i=>i.id === currentCategoryId)

        return (
        <Modal 
            className="group_modal__kdfF6"
            title="分类管理" 
            visible={groupVisible} 
            onCancel={onCancel} 
            footer={null}
            maskClosable={false}
        >
            <div className="custom_main clearfix">
                <div className="category-left">
                    <div className="top-add-area">
                        <div className="lb-name">
                            <span className="name">分类维度</span>
                            <span onClick={()=>{
                                if(!showLeftCreateIpt){
                                    showIpt()
                                    setTimeout(()=>{
                                        this.createDimentionIpt.focus()
                                    },500)
                                }
                            }} className="fa fa-plus-square"></span>
                        </div>
                        {
                            showLeftCreateIpt &&
                            <input 
                            placeholder="请输入维度名称"
                            className="cvd-input"
                            onKeyDown={(e)=>{
                                if(keycode(e.which) == 'enter'){
                                    createCategory(e)
                                }
                            }}  
                            ref={(input) => { this.createDimentionIpt = input; }}  
                            onBlur={(e)=>{
                                createCategory(e)
                            }} 
                            />
                        }
                        
                    </div>
                    {categoryList.map((item)=>{
                        return <ItemRender list={categoryList} key={item.id} data={item} className={(currentCategory && currentCategory.id === item.id) ? 'active': ''}/>;
                    })}
                </div>
                {
                    currentCategory &&
                    <div className="category-right">
                        <div className="lb-name">
                            基本分类
                        </div>
                        {
                            currentCategory.sub && currentCategory.sub.length > 0 &&
                            currentCategory.sub.filter(item=>!item.default).map((item)=>{
                                return <ItemRender  list={currentCategory.sub}  parentCategory={currentCategory} key={item.id} data={item}/>;
                            })
                        }
                    </div>
                }
                {
                    currentCategory &&
                    <div className="custom_footer">
                        {
                            onAddingGroup ?
                            <div className="add-btn-wrap clearfix">
                                <div className="gname-ipt-wrap">
                                    <input className="gname-ipt" onKeyDown={(e)=>{
                                        if(keycode(e.which) == 'enter'){
                                            createSubCategory(e.target.value,currentCategory)
                                            this.nameCreateIpt.value = '';
                                        }
                                    }} ref={(input) => { this.nameCreateIpt = input;}}   placeholder="分类名称"/>
                                </div>
                                <div className="add-btn cvd-y-btn1 cvd-btn-lg" onClick={(e)=>{
                                    createSubCategory(this.nameCreateIpt.value,currentCategory)
                                    this.nameCreateIpt.value = '';
                                }}>添加</div>
                            </div>:
                            <div  className="cvd-g-btn2 add-group-btn cvd-btn-lg" onClick={this.addGroupStatus.bind(this,true)}>
                                <span className="ion-android-add"></span>添加分类
                            </div>
                        }
                    </div>
                }
                
            </div>
            
            
        </Modal>
        );
    }
  
}
const mapStateToProps = ({robot_admin}) => {
    return ({robot_admin});
};
const mapDispatchToProps = (dispatch, ownProps) => {

  return {
    init(category_ids){
        dispatch({ type: 'robot_admin/resetState',payload:{}});
        dispatch({ type: 'robot_admin/init',payload:{category_ids}});
    },
    onTab(id){
        dispatch({type:'robot_admin/setState',payload:{currentCategoryId:id}});
    },
    showIpt(){
        dispatch({type:'robot_admin/setState',payload:{showLeftCreateIpt:true}});
    },
    createCategory(e){
        let val = e.currentTarget.value;
        if(val === '') return dispatch({type:'robot_admin/setState',payload:{showLeftCreateIpt:false}});
        if(val.length > 6){
            return message.error('分类长度不能超过6个字符')
        }
        e.target.value = '';
        dispatch({type:'robot_admin/createCategory',payload:val});
        dispatch({type:'robot_admin/setState',payload:{showLeftCreateIpt:false}});
    },
    createSubCategory(val,parentCategory){
        if(val === '') return;
        if(val.length > 10){
            return message.error('分类长度不能超过10个字符')
        }
        dispatch({type:'robot_admin/createSubCategory',payload:{name:val,parentCategory}});
    },

    onCancel(){
        dispatch({type:'robot_admin/setState',payload:{groupVisible:false}});
    },
    onAddGroup(opt){
        dispatch({type:'robot_admin/createCategory',payload:opt});
    },
    changeItem(item){
        dispatch({type:'robot_admin/setCListItem',payload:item});
    },
    updateCategory({name,id}){
        dispatch({type:'robot_admin/updateCategory',payload:{name,id}});
    },
    deleteItem({id}){
        dispatch({type:'robot_admin/deleteItem',payload:{id}});
        dispatch({ type: 'common_rightsider/getIntelligenceLevel',payload:{}})
    },
    updateSubCategory({name,id,parentCategory}){
        
        dispatch({type:'robot_admin/updateSubCategory',payload:{name,id}});

    },
    deleteSubItem(opt){
        dispatch({type:'robot_admin/deleteSubItem',payload:opt});
        dispatch({ type: 'common_rightsider/getIntelligenceLevel',payload:{}})
    },
    

  }
}
export default connect(mapStateToProps,mapDispatchToProps)(GroupModal);
