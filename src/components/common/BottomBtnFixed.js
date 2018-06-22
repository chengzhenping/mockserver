import React from 'react';
import { connect } from 'dva';
import styles from './BottomBtnFixed.less';
class BottomBtnFixed extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      hasScroll: true
    }
    this.caculate = this.caculate.bind(this)
  }
  componentDidMount(){
    //wait until layout didmount exe
    //setTimeout(this.caculate,1000)
    //window.onresize = this.caculate      //got problem
  }
  componentWillUnmount () {
    window.onresize = null
  }
  caculate(){
    const {location,app} = this.props;
    const {mixHeader,mix_main} = app
    let body = document.body;
    if (mixHeader && mix_main) {
      body =  mix_main
    }
    const clientHeight = body.clientHeight;
    const scrollHeight = body.scrollHeight;
    const offset = 0;//bottom height
    const hasScroll = scrollHeight+offset > clientHeight;
    try{
      this.setState({
        hasScroll
      })
    }catch(e){

    }
  }
  render() {
    const {children} = this.props
    const {hasScroll} = this.state
    return (
        <div className={'cvd-bottom-fixed-wraper ' + (hasScroll ? "cvd-bottom-fixed" :"")}>
          {children}
        </div>
    );
  }
}
function mapStateToProps({app}) {
  return {app};
}
export default connect(mapStateToProps)(BottomBtnFixed);
