import React from 'react';
import styles from './Addvar.less';

function Addvar(props) {
  const {onAddVar} = props
  return (
    <div className="knowledge-addvar-root">
      <div className="addvar-item answer-analysis">
        <div className="add-top clearfix">
          <span className="var-icon"></span>
          <div className="m-h">
            <h3 className="var-name">答案分枝变量</h3>
            <p className="discript">同一问题下不同变量对应不同的回答</p>
          </div>
          <span className="add-btn cvd-g-btn2" onClick={() => onAddVar('enum')}><i className="ion-android-add" />添加</span>
        </div>
        <div className="add-demo">
          <p className="lb">示例说明:</p>
          <div className="th">
            <span className="th-item">问题</span>
            <span className="th-item s">变量</span>
            <span className="th-item last">回答</span>
          </div>
          <div className="tr">
            <span className="round-q q">如何办理流量套餐？</span>
            <span className="cvd-icon cvd-icon_jiantou"></span>
            <div className="td-2">
              <span className="r-lb-item lb-item">20M</span>
              <span className="g-lb-item lb-item">50M</span>
              <span className="b-lb-item lb-item last">100M</span>
            </div>
            <div className="arrow-group">
              <span className="arrow-item"></span>
              <span className="arrow-item"></span>
              <span className="arrow-item last"></span>
            </div>
            <div className="td-3">
              <div className="r-an-item an-item">回答1</div>
              <div className="g-an-item an-item">回答2</div>
              <div className="b-an-item an-item last">回答3</div>
            </div>
          </div>
        </div>
      </div>
      <div className="addvar-item api">
        <div className="add-top clearfix">
          <span className="var-icon"></span>
          <div className="m-h">
            <h3 className="var-name">第三方接口变量</h3>
            <p className="discript">传输参数至第三方接口获取变量值</p>
          </div>
          <span className="add-btn cvd-g-btn2" onClick={() => onAddVar('api')}><i className="ion-android-add" />添加</span>
        </div>
        <div className="add-demo">
          <p className="lb">示例说明:</p>
          <div className="th">
            <span className="th-item">问题</span>
            <span className="th-item s">变量</span>
            <span className="th-item last">回答</span>
          </div>
          <div className="tr">
            <span className="squre-q">帮我查下我的退款进度</span>
            <div className="arrow-group a-1">
              <span className="arrow-item"></span>
            </div>
            <div className="td-2 a-2">
              <span className="g-lb-item lb-item">退款进度</span>
            </div>
            <div className="arrow-group a-3">
              <span className="arrow-item"></span>
            </div>
            <div className="api-an">
              <div className="api-an-item">调用退款进度查询接口</div>
              <span className="arrow-item down"></span>
              <div className="api-an-item">查询结果</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Addvar;
