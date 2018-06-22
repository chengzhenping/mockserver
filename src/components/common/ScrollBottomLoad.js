import React from 'react';
import styles from './ScrollBottomLoad.less';
class ScrollBottomLoad extends React.Component{
  static defaultProps = {
    height:200,
    onLoad:()=>{}
  }
  constructor(props) {
    super(props);
    this.onScroll = this.onScroll.bind(this)
  }
  componentWillMount(){

  }
  onScroll(){
    const {onLoad} = this.props
    const {el} = this.refs
    const {scrollHeight,scrollTop,offsetHeight} = el
    const range = 0
    if(scrollTop + offsetHeight + range >= scrollHeight){
      onLoad()
    }
  }
  render() {
    const {children,height} = this.props
    const {onScroll} = this
    return (
      <div style={{height}} className="g-scroll-bottom-root" ref="el" onScroll={onScroll}>
        {children}
      </div>
    );
  }
}
export default ScrollBottomLoad;
