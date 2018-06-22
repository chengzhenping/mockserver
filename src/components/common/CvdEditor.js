import React from 'react';
import {Upload,message} from 'antd';
import draftCss from 'draft-js/dist/Draft.css';
import styles from './CvdEditor.less';
import CvdConfirm from './CvdConfirm';
import CvdFileUpload from './CvdFileUpload';
import {Editor, EditorState,AtomicBlockUtils,convertToRaw,Modifier,RichUtils,Entity} from 'draft-js';
import {decorator} from '../../utils/decorator';
import {blockRenderer} from '../../utils/blockRenderer';
import {Map} from 'immutable';
class CvdEditor extends React.Component{
  static defaultProps = {
    placeholder:'请输入问题回答',
    editorState: EditorState.createEmpty(),
    onEditorChange(state){
    },
    editorEl(el){

    },
    className:''
  }
  constructor(props) {
      super(props);
      this.state = {
        insertLinkVisible:false,
        linkDescript:'',
        linkUrl:'',
        insertLinkMode: 1 // 1 toggle, 2 add
      };
      this.focus = () => this.refs.editor.focus();
      this.onInsertLink = this.onInsertLink.bind(this);
      this.confirmLink = this.confirmLink.bind(this);
      this.onInsertImg = this.onInsertImg.bind(this);
      this.onUpload = this.onUpload.bind(this);
      this.toggleLink = this.toggleLink.bind(this);

  }
  addLink(){
    const {onEditorChange,editorState} = this.props;
    const {linkDescript,linkUrl} = this.state
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const entityKey = Entity.create('LINK', 'IMMUTABLE', {url:linkUrl});
    const textWithEntity = Modifier.insertText(
      contentState,
      selection,
      linkDescript,
      null,//inlineStyle?: DraftInlineStyle,
      entityKey
    )
    const newEditorState = EditorState.push(editorState, textWithEntity, 'insert-characters')
    
    onEditorChange(newEditorState)
    this.setState({linkDescript:'',linkUrl:''})
    
  }
  toggleLink(tag=true){
    const {onEditorChange,editorState} = this.props;
    const {linkUrl} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: linkUrl}  
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    onEditorChange(RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      tag ? entityKey : null
    ))
    this.setState({linkDescript:'',linkUrl:''})
  }
  onInsertLink(){
    const {onEditorChange,editorState} = this.props;
    const {linkDescript,linkUrl} = this.state;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const anchorKey = selection.getAnchorKey();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const endOffset = selection.getEndOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
     //const currentContentBlock = contentState.getBlockForKey(anchorKey);
    const isCollapsed = selection.isCollapsed()
    this.setState({insertLinkMode: isCollapsed ? 2 : 1})
    if (!isCollapsed) {
      //selected text,  toggle link
      let url = '';
      const selectedText = blockWithLinkAtBeginning.getText().slice(startOffset, endOffset);
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }
      if(linkKey){
        this.toggleLink(false)
      }else{
        this.setState({insertLinkVisible:true,linkDescript:selectedText})
      }
    }else{
      //unselect text  , add link
      this.setState({insertLinkVisible:true})
      //Modifier.insertText(contentState,selection,) 
    }
    
  }
  confirmLink() {
    const {insertLinkMode,linkUrl} = this.state
    //先自动补全url
    if(linkUrl.indexOf('http') < 0){
      this.setState({
        linkUrl: 'http://' + linkUrl
      })
    }
    setTimeout(()=>{
      if(insertLinkMode === 1){
        this.toggleLink()
      }else{
        this.addLink()
      }
      
      this.setState({insertLinkVisible:false});
    },0)
  }
  onInsertImg(url){
    const {onEditorChange,editorState} = this.props;
    const {linkDescript,linkUrl} = this.state;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      {src: url}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );


    onEditorChange(AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
    ))
    setTimeout(() => this.focus(), 0);
  }
  onUpload(data){
    this.onInsertImg(data.access_url)
  }
  render() {
    const {editorState,placeholder,onEditorChange,className,editorEl} = this.props
    const {insertLinkVisible,linkDescript,linkUrl} = this.state
    
    const {onUpload,onInsertLink,confirmLink} = this
    return (
     <div className={"cvd-editor-container " + className}>
        <div className="tools clearfix">
          <span className="add-img btn-item"  role="button">
            <CvdFileUpload onUpload={onUpload}>
              <span className="icon-item ion-image"></span>图片
            </CvdFileUpload>
            
          </span>
          <span className="add-link  btn-item" onClick={onInsertLink}><span className="icon-item ion-link"></span>链接</span>
        </div>
        <Editor 
        ref={editorEl}
        blockRendererFn={blockRenderer}
        placeholder={placeholder} 
        editorState={editorState} 
        onChange={(newState)=>{onEditorChange(newState)}} />
        
        <CvdConfirm 
        extraClass="insert-link-pop"
        title="插入连接"
        width={520} 
        visible={insertLinkVisible} 
        onCancel={(e)=>{this.setState({insertLinkVisible:false})}} 
        onOk={confirmLink} 
        children={
          <div className="link-content">
            <label>链接描述：
              <input type="text" 
              value={linkDescript} 
              onChange={(e)=>{this.setState({linkDescript:e.target.value})}} 
              className="ipt"/>
            </label>
            <label>链接地址：
              <input type="text" 
              value={linkUrl}  
              onKeyDown={(e)=>{
                if (e.keyCode === 13) {
                  confirmLink()
                }
              }}
              onChange={(e)=>{this.setState({linkUrl:e.target.value})}}  
              className="ipt"
              />
            </label>
          </div>
        }
        />
     </div>
    );
  }
}

export default CvdEditor;