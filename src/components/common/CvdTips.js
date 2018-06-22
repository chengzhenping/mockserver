import React from 'react';
import {connect} from 'dva';
import styles from './CvdTips.less';
class CvdTips extends React.Component{
  constructor(props) {
      super(props);
  }
  onClose(){
    const {dispatch} = this.props;
    dispatch({
      type:"app/setState",
      payload:{
        cvdTipsShow:false
      }
    })
  }
  render() {
    const {app} = this.props;
    const {cvdTipsType,cvdTipsContent,cvdTipsShow} = app;
    const onClose=this.onClose.bind(this);
    const showClassName = cvdTipsShow ? "show" : "";
    return (
      <div className={"cvd-g-tips type"+cvdTipsType +" "+showClassName}>
        {
          cvdTipsType == 0 ?
          <span className="ion-android-alert tips-icon"></span>:
          cvdTipsType == 1 ?
          <span className="ion-checkmark-circled tips-icon"></span>:
          cvdTipsType == 2 ?
          <span className="ion-information-circled tips-icon"></span>:
          <span className="ion-android-cancel tips-icon"></span>
        }
        <span className="tips-content">
          {cvdTipsContent}
        </span>
        <span onClick={onClose} className="ion-android-close"></span>
      </div>
    );
  }
}
const mapStateToProps = ({app}) => {
    return ({app});
};
export default connect(mapStateToProps)(CvdTips);
