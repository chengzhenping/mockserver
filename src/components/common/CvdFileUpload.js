import React from 'react';
import styles from './CvdFileUpload.less';
import * as UploadAPI from '../../services/upload/upload';
import {message} from '../../utils/index';
class CvdFileUpload extends React.Component{
  static defaultProps = {
    allowTypes:['jpeg', 'jpg', 'png'],
    allowSize:1000000,//1M
    onUpload(){}
  }
  constructor(props) {
    super(props);
  }
  onFileChange(e){
    const {allowTypes,allowSize,onUpload} = this.props;
    let file = e.target.files[0];
    let { size, type } = file;
    type = type.split('/')[1];
    
    const {dispatch} = XDGlobal._store;

    //清空输入框,否则不可重复上传同一个文件
    e.target.value = '';

    if (allowTypes.indexOf(type) === -1) {
      message.error("只能上传png,jpg,jpeg格式")
      return false
    }
    if (size > allowSize) {
      message.error("上传图片不能超过1M")
      return false
    }
    UploadAPI.getToken({suffix:type}).then((data)=>{
      let formData = new window.FormData()
      formData.append('op', 'upload')
      formData.append('filecontent', file)
      formData.append('insertOnly', 0)

      data.url = data.url.replace('http:','');

      UploadAPI.upload({url:data.url+'?sign='+data.sig,formData}).then((data)=>{
        const {error_code} = data
        data = data.data;
        if(error_code === 0){
          onUpload(data);
        }else{
          message.error(data.message)
        }
      })
    });
  }
  render() {
    const {children}  = this.props;
    const onFileChange = this.onFileChange.bind(this);
    return (
      <div className="cvd-file-upload">
        <input onChange={onFileChange} accept className="file-upload-ipt" type="file"/>
        {children} 
      </div>
    );
  }
}

export default CvdFileUpload;
