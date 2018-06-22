import {
  category,createCategory,updateCategory,
  deleteCategory,createSubCategory,
  deleteSubCategory,updateSubCategory,
  changeCategory} from './mock/category/index';
import {getIntelligenceLevel} from './mock/set/index';
import {
  qalist,simpleList,industry,officialClist,
  officialQlist,addAllofficialQlist,addOfficialQlist,
  getQDetail,getRelating_questions,getSimpleQuestion,getUSQaList
} from './mock/qa/index';
import {get_user_list,get_unit_info} from './mock/history/index';

import {getReply,getHotCategory,getHotQuestion} from './mock/statistics/index';
import {createApiChannel,getRobotInfo} from './mock/set/channel';
import {getWordList,addWord,delWord} from './mock/qa/word';

import {getRobotReception} from './mock/statistics/robot';
export default {
	 "/robot_admin/api/getNav": [{url:'/robot',txt:'机器人管理',icon:'cvd-robot'},{url:'/channel',txt:'渠道设置',icon:'cvd-channel'},{url:'/accout',txt:'账号管理',icon:'cvd-user-setting'}],
    "/robot_admin/v1/unsolved_question/0/list":{total:111,data:[
      {
        "id": "1",
        "question": "别人的车挡住了路",
        "visitor": "刘看山",
        "state": "pending",
        "check_url": "https://adsfasfd", //如何跳转到客服工作台查看聊天记录还需要研究确定
        "time": 1494987052
      },
      {
        "id": "2",
        "question": "别人的车挡住了路",
        "visitor": "刘看山",
        "state": "pending",
        "check_url": "https://adsfasfd", //如何跳转到客服工作台查看聊天记录还需要研究确定
        "time": 1494987052
      }
    ]},
    "/robot_admin/v1/question/0/relating_questions":[
      {
        "id": "13241234",
        "question": "未分类",
        "type":"official", //official或customer
        "related":false
      }
    ],
    "/v1/unit/get_channel_list":{
      "error_code": 0,  
      "info": "",  
      channels:[
        {
          "id": 1,
          "unit_id": 47,
          "name": "hp-test",
          "type": 1,
          "welcome": "你好，hp",
          "tail_msg": "",
          "bind_sub_unit": 1,
          "key": "f86d22ba1ca6307e7fbdbe56e7493aac63580e3f951c4d22e5225e16dd2dccbd",
          "test_url": "",
          "no_ans_reply": 1,
          "no_ans_reply_content_option": 1,
          "no_ans_reply_content": "21",
          "no_ans_reply_fq": 1,
          "app_platform": "",
          "app_name": "",
          "fq": [
            "1"
          ]
        }
      ]
    },
    "/v1/unit/get_user_info":{  
      "error_code": 0,  
      "info": "",  
      "uid": 5,  
      "phone":"12303938333",
      "email":"test@qq.com",
      "nick":"NickName",  
      "face_url":"https://t.alipayobjects.com/images/rmsweb/T1B9hfXcdvXXXXXXXX.svg",
      "sub_unit_id":0, 
      "unit_id": 3,  
      "type": 2,  
      "serv_limit": 100,  
      "weight": 3.14,  
      "note": "",  
      "created_ts": 83273823,  
      "welcome":""  
    },
    "/v1/store/upload_file":{
      "error_code": 0,  
      "info": "",  
      "url":"web.file.myqcloud.com/files/v1/123/cvd/face/xxx.jpg",
      "sig": "vxzLR6vzMNhBMUVzMTWKUB+LMeVhPTIwMDAwMSZrPUFLSURVZkxVRVVpZ1FpWHFtN0MTY2MDQyMSZmPSZiPW5ld2J1Y2tldA==",  
      "show_url": "http://xxx.com/xxx.png",  
      "name": ""  
    },

    "/robot_admin/v1/robot/info": getRobotInfo,
    "/robot_admin/v1/robot/intelligence_level": getIntelligenceLevel,

    "/robot_admin/v1/category/list": category,
    "POST /robot_admin/v1/category/create": createCategory,
    "POST /robot_admin/v1/category/update": updateCategory,
    "POST /robot_admin/v1/category/delete": deleteCategory,
    "POST /robot_admin/v1/category/sub/create": createSubCategory,
    "POST /robot_admin/v1/category/sub/update": updateSubCategory,
    "POST /robot_admin/v1/category/sub/delete": deleteSubCategory,

    "POST /robot_admin/v1/question/change_category": changeCategory,

    "/robot_admin/v1/question/list": qalist,
    "/robot_admin/v1/question/0/simple_list": simpleList,
    "/robot_admin/v1/question_base/tree": industry,
    "/robot_admin/v1/question_base/list": officialClist,
    "/robot_admin/v1/question_base/question/list": officialQlist,
    "POST /robot_admin/v1/question_base/question/include_all": addAllofficialQlist,
    "POST /robot_admin/v1/question_base/question/include": addOfficialQlist,
    "/robot_admin/v1/question/detail": getQDetail,

    "/robot_admin/v1/question/relating_questions": getRelating_questions,
    "/robot_admin/v1/question/simple_list": getSimpleQuestion,
    "/robot_admin/v1/unsolved_question/list": getUSQaList,
    "/v1/unit/get_user_list": get_user_list,

    //统计
    "/robot_admin/v1/statistics/robot/detail": getReply,
    "/robot_admin/v1/statistics/hot_question/list": getHotCategory,
    "/robot_admin/v1/statistics/hot_question_rank/list": getHotQuestion,



    ///server 工作台
    "/v1/unit/get_unit_info": get_unit_info,


    //渠道设置
    "/v1/unit/add_channel": createApiChannel,

    //特征词
    "POST /robot_admin/v1/robot/keywords_list": getWordList,
    "POST /robot_admin/v1/robot/add_keyword": addWord,
    "POST /robot_admin/v1/robot/del_keyword": delWord,

    "/robot_admin/v1/robot/reception": getRobotReception

};
