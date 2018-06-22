import React from 'react';
import styles from './CvdConfirm.less';
import { Modal} from 'antd';
function CvdConfirm({
    visible=false,
    title='删除问题',
    width=380,
    onCancel=()=>{},
    onOk=()=>{},
    cancelText='取消',
    okText='确定',
    children = null,
    extraClass='',
    showHeader = true,
    okBtnDisabled = false
}) {
  return (
    <Modal
        className={(showHeader === false ? 'hideHeader ' : '') + "confirm_modal  "+ extraClass}
        visible={visible}
        title={title}
        width={width}
        onOk={onOk}
        onCancel={onCancel}
        cancelText={cancelText}
        okText={okText}
        maskClosable={false}
        wrapClassName="vertical-center-modal"
        footer={null}
    >
        <div className="cvd-confirm-root">
            {children ||
            <div className="confirm-content">
                <p>是否确认删除选中问题？</p>
                <p>删除后用户提问该问题时机器人将无法识别</p>
            </div>
            }
            {
                (okText || cancelText) &&
                <div className="custom-footer">
                    {
                        cancelText &&
                        <button className="cvd-b-btn1 cvd-btn-lg" onClick={onCancel}>{cancelText}</button>
                    }
                    {
                        okText &&
                        <button className="cvd-y-btn1 cvd-btn-lg" disabled={okBtnDisabled} onClick={onOk}>{okText}</button>
                    }
                </div>
            }
            
        </div>
    </Modal>
  );
}

export default CvdConfirm;
