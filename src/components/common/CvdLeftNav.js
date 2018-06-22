import React from 'react';
import {connect} from 'dva';
import { Link} from 'dva/router';
import { Tooltip } from 'antd';
import lodash from 'lodash';

import classnames from 'classnames';
import styles from './CvdLeftNav.less';

function CvdLeftNav({app,dispatch,location}){
  const navList = lodash.cloneDeep(app.navList);
  let navListBom = [];
  for(var i = 0,l = navList.length;i<l;i++){
     if( navList[i] && navList[i].pos && navList[i].pos == 2 ){
        navListBom.push(navList[i])
        navList.splice(i,1)
        i--;
     }
  }
  let {menuSwitchMesNotice} = app;
  return (
    <div className={classnames({nav_container__azeF3:true,collapsed:app.collapsed})}>
      <h3 className="xd_logo"><span className="cvd-icon cvd-logo-txt"></span></h3>
      	{navList.map((item,index) => {
      		return (
              item.type == 1 ?
              <Link  key={index} to={{pathname:item.url,query:{account:location.query.account}}} className="nav_item" activeClassName="current">
                 {
                  app.collapsed ?
                  <Tooltip placement="right" title={item.txt}>
                    <span className={item.icon}></span>
                  </Tooltip>:
                  <span className={item.icon}></span>
                 }
                <span className="txt">{item.txt}</span>
                { ( location.pathname != '/server' && item.url == '/server' && menuSwitchMesNotice) ? <span className="menuSwitchMesNotice"></span> : null}
              </Link>:
              <a key={index} target="_blank" href={item.url} className="nav_item">
                {
                  app.collapsed ?
                  <Tooltip placement="right" title={item.txt}>
                    <span className={classnames({"cvd-icon":true,[item.icon]:true})}></span>
                  </Tooltip>:
                  <span className={classnames({"cvd-icon":true,[item.icon]:true})}></span>
                 }
                <span className="txt">{item.txt}</span>
              </a>
            );
        })}
        {navListBom.length > 0 ?
          <div className="bottom">
          {navListBom.map((item,index) => {
            return (
                item.type == 1 ?
                <Link  key={index} to={{pathname:item.url,query:{account:location.query.account}}} className="nav_item" activeClassName="current">
                   {
                    app.collapsed ?
                    <Tooltip placement="right" title={item.txt}>
                      <span className={item.icon}></span>
                    </Tooltip>:
                    <span className={item.icon}></span>
                   }
                  <span className="txt">{item.txt}</span>
                </Link>:
                <a key={index} target="_blank" href={item.url} className="nav_item">
                  {
                    app.collapsed ?
                    <Tooltip placement="right" title={item.txt}>
                      <span className={classnames({"cvd-icon":true,[item.icon]:true})}></span>
                    </Tooltip>:
                    <span className={classnames({"cvd-icon":true,[item.icon]:true})}></span>
                   }
                  <span className="txt">{item.txt}</span>
                </a>
              );
            })}
          </div>:null
        }
    </div>
  );
}
export default (CvdLeftNav);
