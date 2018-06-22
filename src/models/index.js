import * as API from '../services/app';
import {message} from '../utils/index';
import _ from 'lodash';
import jsonFormat from '../assets/js/jsonformat'
function defaultState(){
  return {
    apiList: [],
    currentApi: null,
    currentDetail: {"GET":'',"POST":''},
    addModalVisible: false,
    newApi: '',
    addType: 2,  //1目录，2api

    relItem: null,
    delPopVisible: false ,
    deleteItem: null,

    method: 'GET' //GET,POST

  }
}

function findItemById(arr,id){
  for(let i = 0,len = arr.length; i < len; i++){
    if(arr[i].id === id){
      return arr[i]
    }else if(arr[i].children && arr[i].children.length){
      let foundItem =  findItemById(arr[i].children,id)
      if(foundItem){ 
        return foundItem
      }
    }
  }
}
function findParentById(item,id){
    let children = item.children
    if(children){
      if(children.find(i => i.id === id)){
        return item
      }else{
        let foundItem = null
        for(let i = 0,len = children.length; i < len; i++){
          foundItem = findParentById(children[i],id)
          if(foundItem){
            return foundItem
          }
        }
      }
    }
   
}
export default {
  namespace: 'index',
  state: defaultState(),
  reducers: {
    setState(state,action){ 
      return {...state,...action.payload};
    },
    resetState(state,action){ 
      return {...state,...defaultState()};
    },
    changeGet(state,action){ 
      const newDetail = {...state.currentDetail,"GET":action.payload}
      return {...state,currentDetail:newDetail};
    },
    changePost(state,action){ 
      const newDetail = {...state.currentDetail,"POST":action.payload}
      return {...state,currentDetail:newDetail};
    },
  },
  effects: {
    *getApiList({ payload }, { call, put ,select}) {
      /*const index = yield select(state => state.index);
      const {} = index;*/
      let data = yield call(API.getApiList, {});
      yield put({
        type:"setState",
        payload:{
          apiList:[data]
        }
      })
            
    },
    *getApiDetail({ payload:{uri} }, { call, put ,select}) {
      const index = yield select(state => state.index);
      let {apiList,method} = index;
      const findItem = findItemById(apiList,uri)
      //if(findItem.children) return; //目录不做处理
      let data = yield call(API.getApiDetail, {uri});

      if(data.GET){
        data.GET = jsonFormat(JSON.parse(data.GET),'\t')
        if(data.GET.length > 5){
          method = 'GET'
        }
        
      }
      if(data.POST){
        data.POST = jsonFormat(JSON.parse(data.POST),'\t')
        if(data.POST.length > 5){
          method = 'POST'
        }
      }
      
      
      yield put({
        type:"setState",
        payload:{
          method,
          currentApi:findItem,
          currentDetail:data
        }
      })
    },
    *addApi({ payload }, { call, put ,select}) {
      const index = yield select(state => state.index);
      const {addType,newApi,relItem,apiList} = index;
      yield put({
        type:'setState',
        payload:{
          addModalVisible:false
        }
      })
      let data = yield call(API.addApi, {uri: relItem.id + '/'  + newApi});
      message.success('添加成功')

      let newApiList = _.cloneDeep(apiList)
      let findItem = findItemById(newApiList,relItem.id)
      if(findItem.children){
        findItem.children.push(data)
      }else{
        findItem.children = [data]
      }
      
      yield put({
        type:'setState',
        payload:{
          newApi:'',
          apiList:newApiList
        }
      })
    },
    *delApi({ payload:{uri} }, { call, put ,select}) {
      const index = yield select(state => state.index);
      const {addType,newApi,relItem,apiList} = index;
      let data = yield call(API.delApi, {uri});

      message.success('删除成功')

      let newApiList = _.cloneDeep(apiList)
      let findItem = findParentById(newApiList[0],uri)
      findItem.children = findItem.children.filter(item => item.id !== uri)
      if(findItem.children.length === 0) {
        findItem.children = null;
      }
      yield put({
        type:'setState',
        payload:{
          newApi:'',
          apiList:newApiList
        }
      })
    },
    *saveApiDetail({ payload }, { call, put ,select}) {
      const index = yield select(state => state.index);
      const {addType,relItem,currentApi,currentDetail} = index;

      let getData = currentDetail.GET
      let postData = currentDetail.POST
      if(currentDetail.GET){
        try{
          getData = JSON.parse(getData)
        }catch(e){
          message.error('GET数据 不是合法的json')
          return false;
        }

      }
      if(currentDetail.POST){
        try{
          postData = JSON.parse(postData)
        }catch(e){
          message.error('POST数据 不是合法的json')
          return false;
        }
      }


      let data = yield call(API.saveApiDetail, {
        uri:currentApi.id,
        GET:JSON.stringify(getData),
        POST:JSON.stringify(postData)
      },'post');
      message.success('保存成功')
            
    }
  },
  subscriptions: {

  },
};
