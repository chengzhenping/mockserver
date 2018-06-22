import React from 'react';
import styles from './ImportQuestion.less';
import Confirm from './CvdConfirm';
import {message} from '../../utils/index';
import {downloadTemplate} from '../../services/qa/index'
class ImportQuestion extends React.Component{
  static defaultProps = {
    allowTypes:['xlsl', 'xls','xlsb','xlsx'],
    allowSize:1000000,//1M
    title:'导入问答',
    warnTips:false,
    importModalVisible:false,
    downloadUrl:downloadTemplate(),
    comment:[
      '导入文件中问题和回答栏不能为空',
      '导入文件中的问题分类名称为空时会被归为未分类',
      '若导入问题已存在，则会进行替换',
      '单次导入问答数量不超过500条',
      '回答中仅支持添加a标签和img标签'
    ]
  }
  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
  }
  onFileChange(e){
    const {allowTypes,allowSize,changeFile} = this.props;
    let file = e.target.files[0];

    if(!file) return ;
    let { size, type,name } = file;
    //type = type.split('/')[1];
    let lastIndex = name.lastIndexOf('.')
    type = name.slice(lastIndex+1);
    
    //清空输入框,否则不可重复上传同一个文件
    e.target.value = '';
    if (allowTypes.indexOf(type) === -1) {
      message.error("只能上传"+allowTypes.join(',')+"格式")
      return false
    }
    if (size > allowSize) {
      message.error("上传文件不能超过1M")
      return false
    }
  
    changeFile(file)
  }
  render() {
    const {importModalVisible,onCancel,onOk,file,comment,downloadUrl,warnTips,title} = this.props
    const {onFileChange} = this
    const filename = file && file.name

    return (
      <Confirm 
        title={title} 
        visible={importModalVisible} 
        onCancel={onCancel} 
        width={574}
        okText="导入"
        onOk={onOk}
        extraClass="import_qa_modal"
        okBtnDisabled={!filename}
      >
          {
            warnTips &&
            <div className="warns-txt">{warnTips}</div>
          }
          <div className="import-bar">
            <span className="lb">导入文件</span>
            <div className="import-area ">
              <input className="cvd-input2" value={filename} readOnly/>
              <div className="cvd-file-upload">
                <input onChange={onFileChange} accept className="file-upload-ipt" type="file"/>
                <span className="cvd-g-btn2">选择文件</span>
              </div>
              <a href={downloadUrl} className="download-template route-link">下载摸板</a>
            </div>
          </div>
          <div className="comment">
              <p className="tt">注：</p>
              {
                comment.map((item,i) => {
                  return <p key={i} className="comment-item">{i+1}. {item}</p>
                })
              }
          </div>
      </Confirm>
    );
  }
}

export default ImportQuestion;
