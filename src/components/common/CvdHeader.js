import React from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import styles from './CvdHeader.less'
import { Breadcrumb, Radio, Input, Tooltip, Tabs, Modal, Button } from 'antd'
const TabPane = Tabs.TabPane;
import classnames from 'classnames'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import lodash from 'lodash'
import Tools from '../../utils/server/common/tools'
import * as Cookie from '../../utils/server/common/Cookie'
import S from '../../utils/server/index'
import * as R from '../../services/server/index'
const RadioGroup = Radio.Group
import CvdConfirm from '../common/CvdConfirm.js'

import NoticeVoice from '../server/noticeVoice';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
const muiTheme = getMuiTheme()

import { Switch } from 'antd'
class CvdHeader extends React.Component {
  constructor (props) {
    super(props)
    const { dispatch } = props
    dispatch({ type: 'app/getUserInfo', payload: {} })
    this.state = {
      openSetPassword: false,
      confirmPassword: '',
      passwordError: '',
      newPasswordError: '',
      openSetProfile: false,
      confirmPasswordError: '',
      openResetSure: false,
      file: null,
      avatar: '',
      nick: '',
      newAvatar: '',
      newNick: '',
      newNickError: '',
      welcome: '',
      showMask: false,
      showDelete: false,  //切换模式
      newbieGuide: false  //新手引导
    }
    this._isMount = false
  }
  static childContextTypes = {
    muiTheme: React.PropTypes.object,
  };
  componentWillUnmount () {
    this._isMount = false
  }
  componentDidUpdate(){
    //新手引导
    const { app } = this.props
    const newbieGuideSwitch = app.newbieGuideSwitch
    newbieGuideSwitch && this.showNewbieGuide();
  }
  componentDidMount () {
    this._isMount = true
  }
  componentWillReceiveProps (props) {
    let userInfo = props.userInfo
    let nick = userInfo.nick
    let avatar = userInfo.face_url
    avatar = Tools.toRelativeHttp(avatar)
    let welcome = userInfo.welcome
    if (lodash.isEmpty(avatar)) {
      avatar = '//cdn.xiaoduoai.com/cvd/dist/201706011040/dist/img/def.png'
    }
    this.setState({
      nick,
      avatar,
      newNick: nick,
      newAvatar: avatar,
      welcome,
    })
  }
  getChildContext () {
    let fns = {
      muiTheme,
    }
    return fns
  }

  // 重置密码
  resetPassowrd () {
    let self = this
    let { password, newPassword, confirmPassword } = this.state
    if (password.length < 1) {
      self.setState({
        passwordError: '请输入原始密码',
      })
      return false
    }
    if (newPassword.length < 1) {
      self.setState({
        newPasswordError: '请输入新密码',
      })
      return false
    }
    if (newPassword.length < 6 || newPassword.length > 12) {
      self.setState({
        newPasswordError: '新密码只能是6~12位字符',
      })

      return false
    }
    if (newPassword !== confirmPassword) {
      self.setState({
        confirmPasswordError: '确认新密码与新密码不匹配',
      })
      return false
    }
    let params = { old_password: password, new_password: newPassword }
    R.modify_password(params).then((res) => {
      if (res && res.error_code === 0) {
        if (!self._isMount) {
          alert('修改密码成功！')
          return false
        }
        self.setState({
          openSetPassword: false,
          openResetSure: true,
        })
      } else {
        if (!self._isMount) {
          alert('修改密码失败')
          return false
        }
        Tools.showError('修改密码失败，')
      }
    })
  }
  // 获取上传到腾讯云的地址
  getUploadInfo (type) {
    let params = { img_type: type }
    let self = this
    R.upload_face(params).then((res) => {
      if (!self._isMount) {
        return false
      }
      if (res.error_code === 0) {
        let url = res.url
        url = url.replace('http:', '')
        url = url.replace('https:', '')
        self.post(url, res.sig)
      }
    })
  }
  //  上传文件是否合法判断
  uploadFile () {
    let file = this.refs.upload.files[0]
    let self = this
    let size = file.size
    let type = file.type
    type = type && type.split('/')
    type = type && type[1]
    let extension = ['jpeg', 'png', 'jpg']
    if (lodash.indexOf(extension, type) < 0) {
      Tools.showError('只支持jpg和png类型的图片')
      return false
    }
    if (size > 100000) {
      Tools.showError('图片不能超过100k')
      return false
    }
    this.getUploadInfo(type)
  }
  //  上传文件
  post (url, sig) {
    let self = this
    let formData = new window.FormData()
    let file = this.refs.upload.files[0]
    formData.append('op', 'upload')
    formData.append('filecontent', file)
    formData.append('insertOnly', 0)
    this.refs.upload.value = ''
    window.fetch(`${url}?sign=${sig}`, {
      method: 'post',
      body: formData,
    }).then((response) => {
      if (!self._isMount) {
        return false
      }
      if (response.status >= 400) {
        Tools.showError('网络连接中断，请刷新重试')
      }
      return response.json()
    }).then((res) => {
      if (res.code === 0) {
        self.setState({
          newAvatar: res.data.access_url,
        })
      } else {
        Tools.showError('上传失败')
      }
    }).catch((e) => {
      console.log(e)
    })
  }
  // 设置个人信息
  resetProfile () {
    let self = this
    let tuid = Cookie.getUid()
    let { newNick, newAvatar, welcome } = this.state
    newNick = Tools.trim(newNick)
    if (newNick.length < 1) {
      self.setState({
        newNickError: '请输入昵称',
      })
      return false
    }
    if (newNick.length > 20) {
      self.setState({
        newNickError: '昵称长度不能超过20个字',
      })
      return false
    }
    if (welcome.length > 500) {
      Tools.showError('欢迎语不能超过500字')
      return false
    }
    newAvatar = newAvatar !== '//cdn.xiaoduoai.com/cvd/dist/201706011040/dist/img/def.png' ? newAvatar : ''
    let params = { tuid, nick: newNick, face_url: newAvatar, welcome }
    this.isSending = true
    R.set_user_info(params).then((res) => {
      if (res && res.error_code === 0) {
        if (!self._isMount) {
          alert('保存成功，请刷新！')
          return false
        }
        self.setState({
          openSetProfile: false,
          avatar: newAvatar,
          nick: newNick,
          welcome,
        })
        window.onbeforeunload = null
        location.reload()
      } else {
        if (!self._isMount) {
          alert('保存失败！')
          return false
        }
        Tools.showError('保存失败！')
      }
    })
  }
  // 更新状态
  updateStatus (e) {
    let state = e.target.value
    Cookie.setUserState(`${state}`)
    Tools.trackEvent('左侧菜单', '切换状态')
    S.userStateChange(state)
    let unitId = Cookie.getUnitId()
    let self = this
    // self.context.setUserState(state)
    let params = { state, unit_id: unitId }
    params.type = 1
    R.user_stats_change(params).then((data) => {})
    R.set_account_state(params).then((data) => {
      if (self && !self._isMount) {
        return false
      }
      if (!data || data.error_code != 0) {
        Tools.showError('设置用户状态失败')
      }
    })
  }
  getServiceExpiresInfo () {
    const unitInfo = this.props.app.unitInfo
    let result = {
      expired: false,
      expireAfterDays: 0,
    }
    if (unitInfo && unitInfo.id) {
      const { cvd_version, cvd_expire_time, robot_version, robot_expire_time } = unitInfo
      // 1. 试用版 2. 体验版
      if (cvd_version === 2 && robot_version === 2) {
        result.expired = true
      } else if (cvd_version === 1 && robot_version === 1) {
        const expireTime = cvd_expire_time > robot_expire_time ? cvd_expire_time : robot_expire_time
        const now = (new Date()).getTime()
        const expireDays = parseInt((expireTime * 1000 - now) / 24 / 60 / 60 / 1000, 10) + 1
        result.expireAfterDays = expireDays
      }
    }
    return result
  }
  handleModeChangeAlert(){
    this.setState({
      showDelete:true
    })
  }
  handleModeChange = (e) => {
    const mode = this.props.manageMode ? 0 : 1;
    R.set_b_info({mode:mode}).then((res)=>{
       if( res && res.error_code == 0 ){
          if( mode == 0 ){
             window.location.reload();
          }
          dispatchServer({payload:{manageMode:mode}})
       }
    })
  }
  toggleCollapse = () => {
    const { app, dispatch } = this.props
    let collapse = !app.collapsed
    dispatch({ type: 'app/setCollapse', payload: collapse })
  }
  //新手引导
  showNewbieGuide(){
      let self = this;
      const { dispatch } = this.props
      dispatch({ type: 'app/setState', payload: {newbieGuideSwitch: false} })
      setTimeout(function(){
        self.toggleCollapse()
      },400)
      setTimeout(function(){
        self.setState({
           newbieGuide : true
        })
      },900)
  }
  render () {
    const { app, dispatch, routes, location, manageMode } = this.props
    //新手引导
    const newbieGuide = this.state.newbieGuide;

    // cause Breadcrumb's defautl itemRender not support browserhistory
    const itemRender = (route, params, routes, paths) => {
    	const last = routes.indexOf(route) === routes.length - 1
    	return last ? <span>{route.breadcrumbName}</span> : <Link to={{ pathname: `/${paths.join('/')}`, query: { account: location.query.account } }}>{route.breadcrumbName}</Link>
    }
    // remove indexRoute which has no path attribute
    let routeList = routes.filter((item) => { return item.path })
    // remove '/'
    routeList.splice(0, 1)
    function logout () {
      dispatch({ type: 'app/logout', payload: {} })
    }

    let { noticeSound, userState } = this.props
    userState = parseInt(userState)
    let url = `/admin?account=${window.only_tid_mes}`,
      userInfo = this.props.userInfo,
      type = userInfo.type;
    const radioStyle = {
      display: 'block',
      height: '50px',
      lineHeight: '30px',
    }

    const profileBtn = [
      <FlatButton
        label="取消"
        primary
        style={styleCancel}
        className="btn cancel"
        onTouchTap={() => {
          this.setState({
            openSetProfile: false,
          })
        }}
      />,
      <FlatButton
        label="保存"
        primary
        style={styleSure}
        className="btn save"
        onTouchTap={() => {
          this.resetProfile()
        }}
      />,
    ]

    const styleCancel = {
      backgroundColor: '#bdbdbd',
      color: '#ffffff',
      width: '64px',
      height: '32px',
      lineHeight: '32px',
      minWidth: '64px',
      marginRight: '8px',

    }
    const styleSure = {
      backgroundColor: '#2196f3',
      color: '#ffffff',
      width: '64px',
      height: '32px',
      lineHeight: '32px',
      minWidth: '64px',

    }
    const actions = [
      <FlatButton
        label="取消"
        primary
        style={styleCancel}
        className="btn cancel"
        onTouchTap={() => {
          this.setState({
            openSetPassword: false,
          })
        }}
      />,
      <FlatButton
        label="确定"
        primary
        className="btn save"
        style={styleSure}
        onTouchTap={() => {
          this.setState({
            openSetPassword: true,
          })
          this.resetPassowrd()
        }}
      />,
    ]
    const sureBtn = [
      <FlatButton
        label="确认"
        primary
        style={styleSure}
        className="btn save"
        onTouchTap={() => {
          S.offline()
        }}
      />,
    ]
                    // <div className="dropdown-wraper">
                    //   <div className="dropdown">
                    //     <a href="https://cvd.xiaoduotech.com/admin/#/company/info" className="list-item">账户信息<span className="icon-item ion-chevron-right"></span></a>
                    //     <a href="https://cvd.xiaoduotech.com/admin/#/company/modify-password" className="list-item">修改密码<span className="icon-item ion-chevron-right"></span></a>
                    //     <span onClick={logout} className="list-item logout">退出登录<span className="icon-item ion-power"></span></span>
                    //   </div>
                    // </div>
    const { face_url } = app.userInfo
    const { expired, expireAfterDays } = this.getServiceExpiresInfo()
    const permiss = window.platFrom.permiss
    const {mixHeader, unitInfo } = app
    return (
      <div id="main_header" style={mixHeader ? {"borderBottom":'none'} : null} className="main_header__sdJd0 clearfix">
        <div className="top_line">
          <span className="fa fa-bars" onClick={this.toggleCollapse} />
          <Breadcrumb routes={routeList} itemRender={itemRender} />
          <div className="u-info">
            {(expired || !!expireAfterDays) && !!permiss.overduePrompt && <Tooltip overlayClassName="m-header-tooltip-expire" title="官方客服联系电话：400-028-8810"><span className={`serviceExpiredTip ${expired ? 'expired' : ''}`}>{expired ? '当前版本已到期' : <span>试用还有<span style={{fontWeight: 600 }}>&nbsp;{expireAfterDays}&nbsp;</span>天到期</span>}</span></Tooltip>}
            <Tooltip title="帮助文档"><a target="_blank" className="fa fa-question-circle" href="http://cdn.xiaoduoai.com/cvd/help.pdf"></a></Tooltip>
            <Tooltip title="官方客服"><a target="_blank" href={`/?src=15&channel_id=278&key=5aad95823d62936a9dd5052c9a82a8909671643ec1ac08bff2761ae91e16d422${unitInfo.name ? '&nick=' + encodeURIComponent(unitInfo.name) : ''}`} className="ion-chatbubble-working" /></Tooltip>
            <div className="user">
              <img className="face-url" src={face_url || '//cdn.xiaoduoai.com/cvd/dist/fixed/img/def.png'} />
              {manageMode == 0 ? <span className={userState == 1 ? 'onlineState' : (userState == 3 ? 'onlineState onlineStateBusy' : 'onlineState onlineStateUN') } /> : null}
              <div className="dropdown-wraper">
                <div className="dropdown">
                  {type == 2 ?
                  <div className="modeSetting" >
                    <Radio.Group onChange={this.handleModeChangeAlert.bind(this)} value={manageMode}>
                      <Radio.Button value={1}>管理员模式</Radio.Button>
                      <Radio.Button value={0}>客服模式</Radio.Button>
                    </Radio.Group>
                    <p className="modeNotice">{manageMode == 1 ? '当前模式下不进行客服接待' : '当前模式下可进行客服接待'}</p>
                  </div>
                  : null }
                  {manageMode == 0 ? <div className="list-item">切换服务状态</div> : null }
                  {manageMode == 0 ? <div className="userState">
                    <RadioGroup onChange={this.updateStatus} value={userState}>
                      <Radio style={radioStyle} value={1}>在线 <div className="isOnline" /><p className="notice">正常服务中</p></Radio>
                      <Radio style={radioStyle} value={3}>忙碌 <div className="UnOnline" /><p className="notice">新到访客优先分配给其他客服</p></Radio>
                    </RadioGroup>
                  </div> : null }
                  <div className="list-item newMsgNotice">当前对话新消息提示音<Switch checked={noticeSound} onChange={(checked) => {
                    window.dispatchServer({ type: 'save', payload: { noticeSound: checked } })
                  }}
                  /></div>
                  <a className="list-item" onClick={() => {
                            /* this.setState({
                               openSetting: false,
                               openSetProfile: true
                            });*/
                    Tools.trackEvent('左侧菜单', '修改个人信息')
                    this.props.router.push({ pathname: '/setting/user', query: this.props.location.query })
                  }}
                  >个人信息<span className="icon-item ion-chevron-right" /></a>
                  {!!permiss.modifyPassword &&
                  <a className="list-item" onClick={() => {
                    Tools.trackEvent('左侧菜单', '修改密码')
                    this.props.router.push({pathname: '/setting/password', query: this.props.location.query})
                    /* this.setState({
                     openSetting: false,
                     openSetPassword: true
                     });*/
                  }}
                  >修改密码<span className="icon-item ion-chevron-right"/></a>
                  }

                  <span onClick={() => {
                    S.offline()
                  }} className="list-item logout"
                  >退出登录<span className="icon-item ion-power" /></span>
                </div>
              </div>

            </div>

          </div>
        </div>
        {
            app.discription &&
            <div className="discription" dangerouslySetInnerHTML={{ __html: app.discription }}>
            </div>
          }

        <Dialog
          title="修改密码"
          actions={actions}
          modal
          open={this.state.openSetPassword}
          contentClassName="modal-dialog"
          titleClassName="modal-title"
          actionsContainerClassName="modal-footer"
        >
          <div className="form">
            <div className="row clearfix">
              <div className="label">原密码</div>
              <div className="input-wrap">
                <input className="input" type="password" ref="password" value={this.state.password} onChange={(evt) => {
                  this.setState({
                    password: evt.target.value,
                  })
                }}
                />
                { this.state.passwordError ? <div className="hint" onClick={() => {
                  this.setState({
                    passwordError: '',
                  })
                  this.refs.password.focus()
                }}
                >{this.state.passwordError} <i className="ion-android-cancel icon" onClick={() => {
                  this.setState({
                    password: '',
                  })
                  this.refs.password.focus()
                }}
                /> </div> : null}
              </div>
            </div>
            <div className="row clearfix">
              <div className="label">新密码</div>
              <div className="input-wrap">
                <input className="input" ref="newPassword" type="password" placeholder="请输入6~12位字符" value={this.state.newPassword} onChange={(evt) => {
                  this.setState({
                    newPassword: evt.target.value,
                  })
                }}
                />
                { this.state.newPasswordError ? <div className="hint" onClick={() => {
                  this.setState({
                    newPasswordError: '',
                  })
                  this.refs.newPassword.focus()
                }}
                >{this.state.newPasswordError} <i className="ion-android-cancel icon" onClick={() => {
                  this.setState({
                    newPassword: '',
                  })
                  this.refs.newPassword.focus()
                }}
                /> </div> : null}
              </div>
            </div>
            <div className="row clearfix">
              <div className="label">确认新密码</div>
              <div className="input-wrap">
                <input className="input" ref="confirmPassword" type="password" placeholder="请再次输入" value={this.state.confirmPassword} onChange={(evt) => {
                  this.setState({
                    confirmPassword: evt.target.value,
                  })
                }}
                />
                { this.state.confirmPasswordError ? <div className="hint" onClick={() => {
                  this.setState({
                    confirmPasswordError: '',
                  })
                  this.refs.confirmPassword.focus()
                }}
                >{this.state.confirmPasswordError} <i className="ion-android-cancel icon" onClick={() => {
                  this.setState({
                    confirmPassword: '',
                  })
                  this.refs.confirmPassword.focus()
                }}
                /> </div> : null}
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog
          title="个人信息"
          actions={profileBtn}
          modal
          open={this.state.openSetProfile}
          titleClassName="modal-title"
          contentClassName="modal-dialog"
          actionsContainerClassName="modal-footer"
        >
          <div className="form">
            <div className="row clearfix">
              <div className="label">昵称</div>
              <div className="input-wrap">
                <input className="input" type="text" maxLength="20" value={this.state.newNick} onChange={(evt) => {
                  this.setState({
                    newNick: evt.target.value,
                  })
                }}
                />
                { this.state.newNickError ? <div className="hint" onClick={() => {
                  this.setState({
                    newNickError: '',
                  })
                }}
                >{this.state.newNickError} <i className="ion-android-cancel icon" /> </div> : null}
              </div>
            </div>
            <div className="row clearfix">
              <div className="label">欢迎语</div>
              <div className="input-wrap">
                <textarea className="textarea" placeholder="请输入欢迎语" value={this.state.welcome} onChange={(evt) => {
                  this.setState({
                    welcome: evt.target.value,
                  })
                }}
                />
              </div>
            </div>
            <div className="row clearfix">
              <div className="label">头像</div>
              <div className="input-wrap">
                <div className="upload-avatar" onMouseEnter={() => {
                  this.setState({
                    showMask: true,
                  })
                }}
                  onMouseLeave={() => {
                    this.setState({
                      showMask: false,
                    })
                  }}
                >
                  <img className="avatar" src={this.state.newAvatar} />
                  { this.state.showMask ?
                    <div className="mask">
                      <i className="ion-android-person icon" />
                    </div> : null}
                  <input type="file" className="select-img" id="upload" ref="upload" contentEditable="false" onChange={(evt) => {
                    let url = evt.target.value
                    if (url.length) {
                      this.uploadFile()
                    }
                  }}
                  />
                </div>
                <div className="upload-avatar-hint">上传100x100的图片，支持jpg、png格式，大小不能超过100k</div>
              </div>

            </div>
          </div>
        </Dialog>
        <Dialog
          title="提示"
          actions={sureBtn}
          modal
          open={this.state.openResetSure}
          titleClassName="modal-title"
          contentClassName="modal-dialog"
          actionsContainerClassName="modal-footer"
        >
          <div>修改密码成功！</div>
        </Dialog>
        <NoticeVoice />
        <CvdConfirm visible={this.state.showDelete} showHeader={false} okText="确认切换" cancelText="取消" onCancel={() => {
          this.setState({ showDelete: false })
        }} onOk={() => {
          this.setState({ showDelete: false })
          this.handleModeChange()
        }}
        >
          <p style={{ textAlign: 'center', fontWeight: 600, fontSize: 16, lineHeight: '24px' }}>{!manageMode ? '请确保您的当前会话已结束' : '请准备好进行客服接待'}</p>
          <p style={{ textAlign: 'center', color: 'e2e2e2', fontSize: 12, lineHeight: '24px' }}>{!manageMode ? '切换为管理员模式后，将不再接收对话消息' : '切换为客服模式，将开始接收对话消息'}</p>
        </CvdConfirm>
        <Modal
          className="m-modal-newbieGuide-content"
          visible={newbieGuide}
          maskClosable={false}
          wrapClassName="vertical-center-modal"
          width={900}
          footer={null}
        >
          <div className="m-show-newbieGuide-modal">
            <div className="content">
              <p className="title">
                  <label>3步开启智能客服时代</label>
              </p>
              <img src={require('../../assets/img/newbieGuide.png')}/>
            </div>
            <div className="footer">
                <Button onClick={()=>{
                   this.setState({newbieGuide:false})
                }}>开始使用</Button>
                <a className="help" href="http://cdn.xiaoduoai.com/cvd/help.pdf" target="_blank">查看帮助文档</a>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps ({ app, Server }) {
  let { noticeSound, userState, manageMode } = Server
  let { userInfo, unitInfo } = app
  return { app, noticeSound, userState, userInfo, manageMode, unitInfo }
}
export default connect(mapStateToProps)(CvdHeader)

