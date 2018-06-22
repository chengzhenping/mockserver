import React from 'react'
import d3Cloud from 'd3-cloud';
import styles from './WordCloud.less';

class Cloud extends React.Component  {
  static defaultProps = {
    fontName: 'Sans-Serif',
    //fontSizes: [13, 16, 20, 26, 35, 49],
    height: 180,
    topics: [],
    length:0,
    onSelectTopic(){}
  }
  constructor(props) {
    super(props);
    this.state = {
      cloudDimensions: [],
      selectedTopic: null,
      tipsShow:false,
      tipsLeft:'',
      tipsTop:'',

      range: '',
      maxCount: '',

      onHover: false,
      width: 500
    };

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.enrichTopics = this.enrichTopics.bind(this)
    this.resizeWidth = this.resizeWidth.bind(this)
  }
  componentDidMount () {
    addEventListener('resize', this.resizeWidth, false)
    this.resizeWidth()
    this.componentWillReceiveProps(this.props)
  }
  componentWillUnmount () {
    removeEventListener('resize', this.resizeWidth, false)
  }
  resizeWidth(){
    this.setState({width:this.refs.container.clientWidth})
  }
  enrichTopics(topics) {
    const maxCount = topics[topics.length - 1].count
    const minCount = topics[0].count
    let range = Math.floor(maxCount/5)
    const morethan5 = maxCount > 5
    this.setState({range,maxCount})
    const sizes = [12,14,16,20,24]
    if(!morethan5){
      range = maxCount
    }
    const topicsWithFont = topics.map((topic,index) => {
      const count = topic.count
      let stage, fontSize
      if(morethan5){
        if(count <= range) {
          fontSize = sizes[0]
          stage = 1
        }else if(count <= range*2){
          fontSize = sizes[1]
          stage = 2
        }else if(count <= range*3){
          fontSize = sizes[2]
          stage = 3
        }else if( count <= range*4){
          fontSize = sizes[3]
          stage = 4
        }else {
          fontSize = sizes[4]
          stage = 5
        }
      }else{
        fontSize = sizes[0]
        stage = 1
      }

      return {...topic,fontSize, className:"stage_"+stage}
    });

    return topicsWithFont
  }
  componentWillReceiveProps (props) {
    if (props.topics.length === 0) {
      return;
    }
    const {
      fontName,
      fontSizes,
      height,
      topics,
    } = props;
    const {width} = this.state

    let sortedTopics = topics.sort((a,b)=>(a.count-b.count))
    const {enrichTopics} = this
    /** Start calculation of cloud */
    d3Cloud()
      .size([width, height])
      .words(enrichTopics(sortedTopics))
      .padding(10)
      .font(fontName)
      .text((d) => d.label)
      .fontSize((d) => d.fontSize)
      .random(() => 0.5)
      .rotate(() => 0)
      .on('end', (cloudDimensions) => { 
        this.setState({ cloudDimensions }); 
      })
      .start();
  }
  onMouseEnter(e,item){
    const {clientX,clientY} = e
    this.setState({tipsShow:true,selectedTopic:item})
    setTimeout(()=>{
      this.setState({tipsLeft:clientX,tipsTop:clientY + 20})
    },0)
  }
  onMouseLeave(e,item){
    this.setState({tipsShow:false})
  }
  /**
   * Render cloud as svg
   * @return {ReactElement} [description]
   */
  render() {
    const {
      fontName,
      height,
      onSelectTopic,
      topics,
    } = this.props;
    const {cloudDimensions, selectedTopic,tipsShow,tipsLeft,tipsTop, range,maxCount, onHover,width} = this.state
    const {onMouseEnter,onMouseLeave} = this
    const getClassNames = (item) => {
      let classNames = 'wordcloud__cloud_label  ';
      classNames += item.className
      if (
        selectedTopic !== null
        && selectedTopic.hasOwnProperty('id')
        && selectedTopic.id === item.id
      ) {
        classNames += ' wordcloud__cloud_label--is-active';
      }
      return classNames;
    };
    const hoverClass = onHover ? ('stage_'+ onHover) : ''

    const morethan5 = maxCount > 5
    return (
      <div  ref="container">
        {
          topics.length > 0 && 
          <div className="wordcloud__container_cloud clearfix">
            <div className={"wordcloud__cloud " + hoverClass}>
              <svg width={width} height={height}>
                <g transform={`translate(${width / 2}, ${height / 2})`}>
                  {cloudDimensions.map(item =>
                    <text
                      className={getClassNames(item)}
                      key={item.id}
                      onClick={() => onSelectTopic(item)}
                      onMouseEnter={(e)=>{onMouseEnter(e,item)}}
                      onMouseLeave={(e)=>{onMouseLeave(e,item)}}
                      style={{
                        fontSize: item.size
                      }}
                      textAnchor="middle"
                      transform={`translate(${item.x} , ${item.y} )`}
                    >{item.text}</text>
                  )}
                </g>
              </svg>
            </div>
            {topics.length > cloudDimensions.length ? <p className="worcloud__hint"></p> : ''}

            {
              (tipsShow && selectedTopic) &&
              <div ref="tips" className="cloud-tips" style={{left:tipsLeft,top:tipsTop}}>
                {selectedTopic.label}： {selectedTopic.count}
              </div>
            }

            <div className="stage-list">
              {Array.from({ length: morethan5 ? 5 : 1 }).map((i,index)=>{
                return <span 
                className={"stage-item stage_" + (index+1)} 
                key={index} 
                onMouseEnter={(e)=>{this.setState({onHover: index+1})}}
                onMouseLeave={(e)=>{this.setState({onHover: false})}}>
                  <span className="round"></span>
                  {
                    morethan5 ?
                    <span className="range">{index*range}~{index === 4 ? maxCount : (index+1)*range}</span>:
                    <span className="range">{0}~{maxCount}</span>
                  }
                  
                </span>
              })}
              
              
            </div>
          </div>
        }
      </div>
    );
  }
}


export default Cloud;
