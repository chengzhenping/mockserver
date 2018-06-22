import React from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import styles from './RightSider.less';
import {Progress,Tooltip} from 'antd';
import ImportQuestion from './ImportQuestion';
import {downloadTemplate} from '../../services/qa/index'
class RightSider extends React.Component{
    static defaultProps = {
        callback(){}
    }
    constructor(props) {
        super(props);
    }
    componentWillMount(){
        const {init} = this.props;
        init();   
    }
    render() {
        const {
            location,category_ids,
            common_rightsider,
            showImportModal,

            //import modal
            onOk,
            onCancel,
            changeFile
        } = this.props
        const {intelligence,importModalVisible,formData,file} = common_rightsider
        const {
            total_questions,
            trained_questions,
            training_questions,
            train_proportion,
            train_level,
            contrast_last_week 
        } = intelligence
        const {account} = location.query

        const importModalProps = {
            onCancel,
            onOk,
            importModalVisible,
            changeFile,
            file,
            formData
        }
      return (
        <div className="right-sider_skdE7">
            <h3 className="sub-tit">添加问答</h3>

            <div className="sub-content add-qa">
                <Link to={{pathname:"/robot/knowledge/custom",query:{account,category_ids:category_ids.join(',')}}} className="cvd-g-btn1"><span className="ion-android-add"></span>添加自定义问答</Link>
                <Link to={{pathname:"/robot/industry_semantic",query:{account}}} className="cvd-g-btn1"><span className="ion-android-add"></span>从行业语义库添加</Link>
                <div className="cvd-g-btn1 center" onClick={showImportModal}>批量导入问答</div>
                <div className="download">
                    <a href={downloadTemplate()} className="download-link">下载导入摸板</a>
                </div>
                
            </div>
            <h3 className="sub-tit">其他管理</h3>
            <div className="sub-content">
                <Link to={{pathname:"/robot/set",query:{account}}}  className="t1-link-item">机器人设置  <span className="fa fa-angle-right"></span></Link>
                <Link to={{pathname:"/robot/unsolvedquestion",query:{account}}}  className="t1-link-item">未识别问题管理   <span className="fa fa-angle-right"></span></Link>
                <Link to={{pathname:"/robot/hotquestion",query:{account}}}  className="t1-link-item last">常见问题管理<span className="fa fa-angle-right"></span></Link>
            </div>
            <h3 className="sub-tit">机器人智能度</h3>

            <div className="sub-content robot-level">
                <div className="count-bar">
                    <div className="count-item">
                        <p className="count">{total_questions}</p>
                        <p className="lb">问答总数</p>
                    </div>
                    <div className="count-item">
                        <p className="count">{trained_questions}</p>
                        <p className="lb">已学习</p>
                    </div>
                    <div className="count-item">
                        <p className="count">{training_questions}</p>
                        <p className="lb">待学习</p>
                    </div>
                </div>

                <div className="progress-item learn-percent">
                    <p className="lb">学习比例:</p>
                    <div className="clearfix">
                        <Progress percent={Math.round(train_proportion*100*1000)/1000} strokeWidth={4} status="active" />
                    </div>
                </div>
                <div className="progress-item robot-inteligence">
                    <p className="lb">整体智能度:</p>
                    {
                        contrast_last_week > 0 ?
                        <Tooltip 
                        placement="bottomRight" 
                        title={
                            <div className="robot-inteligence-tooltip">相比上周智能度： 
                                <span className="count">{Math.round(contrast_last_week*100*1000)/1000}% 
                                </span> 
                                <span className="ion-ios-arrow-thin-up"></span>
                            </div>
                        }>
                            <div className="clearfix">
                                <Progress percent={ Math.round(train_level*100*1000)/1000} strokeWidth={4} status="active" />
                                {contrast_last_week > 0}
                                    <span className="ion-ios-arrow-thin-up"></span>
                            </div>
                        </Tooltip>:
                        <div className="clearfix">
                            <Progress percent={Math.round(train_level*100*1000)/1000} strokeWidth={4} status="active" />
                            {contrast_last_week > 0}
                            {contrast_last_week > 0 && <span className="ion-ios-arrow-thin-up"></span>}
                        </div>

                    }
                    
                </div>
                <p className="extra">持续学习中...</p>
                
            </div>

            <ImportQuestion  {...importModalProps}/>
        </div>
        );
    }
}


const mapStateToProps = ({common_rightsider}) => {
    return ({
      common_rightsider
    });
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    init() {
      dispatch({ type: 'common_rightsider/resetState',payload:{}})
      dispatch({ type: 'common_rightsider/getIntelligenceLevel',payload:{}})
    },
    showImportModal(){
        dispatch({ type: 'common_rightsider/setState',payload:{importModalVisible:true}})
    },

    //import modal dispatch
    onOk(){
        const {callback} = ownProps
        dispatch({ type: 'common_rightsider/uploadQA',payload:{callback}})
    },
    onCancel(){
        dispatch({ type: 'common_rightsider/setState',payload:{importModalVisible:false,file:''}})
    },
    changeFile(file){
        dispatch({ type: 'common_rightsider/setState',payload:{file}})
    }
   

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(RightSider);