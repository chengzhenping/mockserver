export const createApiChannel = {  
    "error_code": 0,  
    "info": "",  
    "id": 1,  
    "type": 1,  
    "name": "name",  
    "welcome": "welcome msg",  
    "bind_sub_unit": 1,  
    "test_url": "http://xxx/",  
    "invite": "邀请欢迎语",  
    "auto_invite": 1,  
    "auto_invite_time": 5,  
    "app_platform": "ios",  
    "app_name": "single dog",  
    "key": "fsahdf3984rfu93t23t09f",  
    "code": "",  
    "robot_api": "http://cvd.xxxxx.com",      // 仅创建的渠道为 机器人api 时返回
    "robot_api_secret": "fsahdf3984rfu93t23t09f" // 仅创建的渠道为 机器人api 时返回
}
export const getRobotInfo = {
    "error_code": 0,
    "info": "ok",
    "data": {
        "robot": {
            "id": "597b19ae7cccf674de602685",
            "nick": "天府通",
            "image": "https://cdn.xiaoduoai.com/cvd/xd-robot.png"
        },
        "channels": [
            {
                "id": 1709,
                "name": "dfsaf",
                "type": "PC网站",
                "welcome": "",
                "welcome_fq": false,
                "welcome_only_no_service": true,
                "no_ans_reply_content": "这个问题我不太清楚，会转交给同事处理。如若需要，请留下您的联系电话以便后续沟通。",
                "no_ans_reply_fq": false,
                "bind_sub_unit": "默认组",
                "is_opened": true,
                "robot_first": false,
                "both_robot_human": 1,
                "has_hot_questions": false,
                "is_robot_channel": false
            },
            {
                "id": 1726,
                "name": "gdfg",
                "type": "机器人API",
                "welcome": "",
                "welcome_fq": false,
                "welcome_only_no_service": true,
                "no_ans_reply_content": "这个问题我不太清楚，会转交给同事处理。如若需要，请留下您的联系电话以便后续沟通。",
                "no_ans_reply_fq": false,
                "bind_sub_unit": "默认组",
                "is_opened": true,
                "robot_first": false,
                "both_robot_human": 1,
                "has_hot_questions": false,
                "is_robot_channel": true
            }
        ]
    }
}