import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Dropdown } from 'antd'

import * as utils from '../../utils'
import './Select.less'

class Select extends React.Component {
  static propTypes = {
    dataList: PropTypes.array, // 数据列表，例如 [{id: 1, txt: '选择一'}, {id: 2, txt: '选择二'}]
    keyField: PropTypes.string, // 主键，比如说id; 数据中主键对应的值只能是可以转化成字符串的普通值
    textField: PropTypes.string, // 文本键，比如说txt
    onSelect: PropTypes.func, // 选择事件
    onChange: PropTypes.func, // 选择事件
    className: PropTypes.string, // 选择框添加class
    menuClassName: PropTypes.string,  // 下拉选框添加class
    menuItemClassName: PropTypes.string, // 下拉选框项添加class
    value: PropTypes.any, // 选中值，要注意此组件是受控组件。  可以是主键值，也可以是包含相同主键值的对象
    trigger: PropTypes.string, // 'click' or 'hover' 触发下拉的行为
    disabled: PropTypes.bool,
    onVisibleChange: PropTypes.func, // 下拉框显示状态改变时触发
  }
  constructor (props) {
    super(props)
    this.state = {
      selecting: false, // 下拉框显示状态
    }
  }
  onSelect = (select) => {
    const key = select.key
    let selectedItem
    this.props.dataList.forEach((item) => {
      if (`${item[this.props.keyField]}` === key) {
        selectedItem = item
      }
    })
    this.props.onSelect && this.props.onSelect(selectedItem)
    this.props.onChange && this.props.onChange(selectedItem)
  }

  findSelect (list, key, value) {
    if (typeof value === 'object') value = value[key]
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (`${item[key]}` === `${value}`) {
        return item
      }
    }
  }
  onVisibleChange = (visible) => {
    // console.log('on visible change ', visible)
    // if (visible === this.state.selecting) return
    this.setState({ selecting: visible })
    this.props.onVisibleChange && this.props.onVisibleChange(visible)
  }
  render () {
    const { custom, dataList, keyField, textField, className, menuClassName, menuItemClassName, value, trigger = 'hover', disabled = false } = this.props
    let selectedItem = this.findSelect(dataList, keyField, value)
    if (!selectedItem) {
      if (dataList.length) {
        setTimeout(() => {
          this.props.onSelect && this.props.onSelect(dataList[0])
          this.props.onChange && this.props.onChange(dataList[0])
        })
      }
      return <span />
    }
    const menu = (
      <Menu onClick={this.onVisibleChange.bind(this, false)} className={`m-custom-select-menu ${menuClassName || ''}`} onSelect={this.onSelect} selectedKeys={[`${selectedItem[keyField]}`]}>
        {dataList.map((item, i) => {
          return <Menu.Item className={`m-custom-select-menu-item ${menuItemClassName || ''}`} key={`${item[keyField]}`}><span dangerouslySetInnerHTML={{ __html: item[textField] }} /></Menu.Item>
        })}
      </Menu>
    )
    return (
      <div className={`m-custom-select ${this.state.selecting ? 'm-custom-select-selecting' : ''}`}>
        <Dropdown onVisibleChange={this.onVisibleChange} overlay={disabled ? <span /> : menu} trigger={[trigger]}>
          <div className={`select-header ${disabled ? 'disabled' : ''} ${className || ''} ${custom ? 'custom' : ''}`}>
            <span dangerouslySetInnerHTML={{ __html: selectedItem[textField] }} />
            <span className="fa fa-caret-down" />
          </div>
        </Dropdown>
      </div>
    )
  }
}
export default Select
