import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Dropdown, Button, Checkbox } from 'antd'

import Tools from '../../utils/server/common/tools';
import * as utils from '../../utils'
import './MultiSelect.less'

class MultiSelect extends React.Component {
  static propTypes = {
    dataList: PropTypes.array, // 数据列表，例如 [{id: 1, txt: '选择一', checked: false}, {id: 2, txt: '选择二', checked: true }]
    keyField: PropTypes.string, // 主键，比如说id; 数据中主键对应的值只能是可以转化成字符串的普通值
    textField: PropTypes.string, // 文本键，比如说txt
    onChange: PropTypes.func, // 点击确定并有改动时触发事件
    className: PropTypes.string, // 选择框添加class
    disabled: PropTypes.bool,
    showAllCheck: PropTypes.bool,
    allCheckText: PropTypes.string,
  }
  constructor (props) {
    super(props)
    this.state = {
      showDropDown: false, // 下拉框显示状态
      tempDataList: [], // 临时改变的数据列表
    }
  }
  onSelect = (select) => {
  }
  onCheckChange (item, e) {
    let newItem = { ...item, checked: e.target.checked }
    let tempDataList = this.state.tempDataList
    let index = tempDataList.indexOf(item)
    tempDataList.splice(index, 1, newItem)
    this.setState({ tempDataList })
  }
  toggleAllChecked (allChecked) {
    const { dataList, keyField = 'id', textField = 'txt', className, disabled = false, showAllCheck = false, allCheckText = '全选' } = this.props
    let list = this.state.tempDataList
    this.setState({
      tempDataList: list.map((item) => {
        item.checked = allChecked
        return item
      }),
    })
  }
  isAllChecked (list = this.state.tempDataList) {
    let allChecked = true
    for (let i = 0; i < list.length; i++) {
      if (list[i].checked !== true) {
        allChecked = false
        break
      }
    }
    return allChecked
  }
  getDropDownList () {
    const { dataList, keyField = 'id', textField = 'txt', className, disabled = false, showAllCheck = false, allCheckText = '全选' } = this.props
    let list = this.state.tempDataList
    let result = list.map((item) => {
      return (
        <li key={item[keyField]}>
          <Checkbox checked={item.checked} onChange={this.onCheckChange.bind(this, item)} ><span dangerouslySetInnerHTML={{ __html: Tools.wxEmojiNick(item[textField]) }}></span></Checkbox>
        </li>
      )
    })
    if (showAllCheck) {
      let allChecked = this.isAllChecked()
      result.unshift(
        (
          <li key="allCheck_key">
            <Checkbox checked={allChecked} onChange={this.toggleAllChecked.bind(this, !allChecked)}>{allCheckText}</Checkbox>
          </li>
        )
      )
    }
    return result
  }
  showDropDown = () => {
    if (this.state.showDropDown) return
    let tempDataList = []
    for (let item of this.props.dataList) {
      tempDataList.push({ ...item })
    }
    this.setState({
      showDropDown: true,
      tempDataList,
    })
  }
  hideDropDown = () => {
    this.setState({
      showDropDown: false,
    })
  }
  onOk = () => {
    const { dataList, keyField = 'id', textField = 'txt', className, disabled = false } = this.props
    let oldChecked = this.props.dataList.filter(item => item.checked)
    let newChecked = this.state.tempDataList.filter(item => item.checked)
    let changed = oldChecked.length !== newChecked.length
    if (!changed) {
      for (let i = 0; i < oldChecked.length; i++) {
        let oldItem = oldChecked[i]
        let newItem = newChecked[i]
        if (oldItem[keyField] !== newItem[keyField] || oldItem.checked !== newItem.checked) {
          changed = true
          break
        }
      }
    }
    if (changed && this.props.onChange) {
      this.props.onChange(this.state.tempDataList)
      console.log('on change:', this.state.tempDataList)
    }
    this.hideDropDown()
  }
  render () {
    const { dataList, keyField = 'id', textField = 'txt', className, disabled = false, allCheckText = '全选', showAllCheck = false } = this.props
    let valueText = dataList.filter(item => item.checked).map(item => item[textField]).join(',')
    if (showAllCheck && this.isAllChecked(dataList)) valueText = allCheckText
    return (
      <div className={`m-custom-multi-select ${this.state.showDropDown ? 'triggered' : 'not-triggered'} ${className || ''}`}>
        <div className={`select-header ${disabled ? 'disabled' : ''}`} onClick={this.showDropDown}>
          <span className="title" dangerouslySetInnerHTML={{ __html: valueText }} />
          <span className="fa fa-caret-down" />
        </div>
        {this.state.showDropDown &&
        <div className="dropDownBox">
          <ul>
            {this.getDropDownList()}
          </ul>
          <div className="op">
            <Button className="btn-cancel cvd-gray-btn1 cvd-btn-lg" onClick={this.hideDropDown}>取消</Button>
            <Button className="btn-ok cvd-y-btn1 cvd-btn-lg" onClick={this.onOk}>确定</Button>
          </div>
        </div>
        }
      </div>
    )
  }
}
export default MultiSelect
