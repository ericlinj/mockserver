受众工具接口文档
============
前后端接口文档

#1.任务管理#
##1.1 新建任务###

>**输入**
>
>     {
>        "task_name" : "保健行业" ,//任务名称
>        "task_descp" : "test任务描述" ,//任务描述
>        "task_type" : 1 ,//任务类型 ：1-词受众分析;2-网站访问分析
>        "task_time_type" : 1 ,//任务周期:1-单次（默认）;7-一周;14-二周;30-30天(月）
>        "task_begin_time" : "2014-08-04 00:00:00" ,//任务开始时间 yyyy-MM-dd hh:mm:ss
>        "querys":"[{
>                     "query_name":"保健"，
>                     "query":["大保健秘籍","保健2","保健3"]
>                 },{
>                     "query_name":"保健2"，
>                     "query":["大保健秘籍","保健2","保健3"]
>                 },{
>                     "query_name":"保健3"，
>                     "query":["大保健秘籍","保健2","保健3"]
>                 }]",       //兴趣点数组的json, 序列化成字符串提交
>        "feature_ids":"1,2,3,4" //任务关联特征id集合，用半角逗号","分隔
>     }
>
>
>
>
>   **输出**
>
>     {
>         "status": 1, // 1成功 500失败
>         "data": {
>         },
>         "errors": []
>     }
>
>   **接口**
>
>     /task/manage/add
>
>   **备注**
>
>


##1.2 特征查询（弹框使用）###

>**输入**
>
>    无
>
>
>   **输出**
>
>     {
>         "status": 1, // 1成功 500失败
>         "data": {
>           list:[
>             {
>                 "id":1,//特征id
>                 "feature_name":"特征名字1" //特征名称
>             },
>             {},
>             {},
>             ......
>           ]
>         },
>         "errors": []
>     }
>
>   **接口**
>
>     /feature/manage/listiAllSimple
>
>   **备注**
>
>








##1.3 任务查询##


>**输入**
>
>     {
>        "task_name" : "大保健", //查询任务名称
>        "pageNo" : 1, //页码，1-base
>        "pageSize" : 10, //页面查询数量
>     }
>
>
>
>
>   **输出**
>
>     {
>         "status": 1, // 1成功 500失败
>         "data": {
>           list:[
>           {
>             "id" : 1 ,//任务id
>             "task_name" : "保健行业" ,//任务名称
>             "task_descp" : "test任务描述" ,//任务描述
>             "task_status" : 0 ,//任务状态：0-排队中（默认）；2
>             "task_status_showStr" : "排队中" ,//任务状态显示字符串
>             "creater" : "ligang@sogou-inc.com" ,//创建人
>             "task_type" : 0 ,//任务类型 ：1-词受众分析;2-网站访问分析
>             "create_time" : "2014-08-05 10:10:11" //创建时间
>             "task_time_type" : 1 ,//任务周期:1-单次（默认）;7-一周;14-二周;30-30天(月）
>             "task_time_type_showStr" : "单次" ,//任务周期显示字符串
>             "task_begin_time" : "2014-08-04 00:00:00" //（采样开始时间）任务开始时间 yyyy-MM-dd hh:mm:ss
>
>           },
>           {},
>           {},
>           ......
>           ],
>           "total" : 20,//总条数
>         },
>         "errors": []
>     }
>
>   **接口**
>
>     /task/manage/list
>
>   **备注**
>
>

##1.4 查看兴趣点##


>**输入**
>
>     {
>        "task_id" : 1 //任务id
>     }
>
>
>
>
>   **输出**
>
>     {
>         "status": 1, // 1成功 500失败
>         "data": {
>            "task_name" : "保健行业" ,//任务名称
>            "task_descp" : "test任务描述" ,//任务描述
>            "task_type" : 0 ,//任务类型 ：1-词受众分析;2-网站访问分析
>            "task_time_type" : 1 ,//任务周期:1-单次（默认）;7-一周;14-二周;30-30天(月）
>            "task_time_type_showStr" : "单次" ,
>            "task_type_showStr" : "词受众分析" ,//任务类型
>            "task_status_showStr" : "排队中" ,//任务状态
>            "create_time_showStr" : "2014-08-04 00:00:00" ,//提交日期
>            "creater" : "lilili@sogou-inc.com" ,//创建人
>            "task_begin_time" : "2014-08-04 00:00:00" ,//任务开始时间 yyyy-MM-dd hh:mm:ss
>            "task_begin_time_showStr" : "2014-08-04 00:00:00" ,//任务开始时间 yyyy-MM-dd hh:mm:ss
>            "tTaskQueries":[{
>                         "query_name":"保健"，
>                         "query":["大保健秘籍","保健2","保健3"]
>                     },{
>                         "query_name":"保健2"，
>                         "query":["大保健秘籍","保健2","保健3"]
>                     },{
>                         "query_name":"保健3"，
>                         "query":["大保健秘籍","保健2","保健3"]
>                     }],       //兴趣点
>            "feature_ids":"1,2,3,4" //任务关联特征id集合，用半角逗号","分隔
>         },
>         "errors": []
>     }
>
>   **接口**
>
>     /task/manage/listQuery
>
>   **备注**
>
>



##1.5 任务状态流转##
###1.5.1 任务终止
>**输入**
>
>     {
>        "task_id" : 1 //任务id
>     }
>
>
>
>
>   **输出**
>
>     {
>         "status": 1, // 1成功 500失败
>         "data": {
>               “id” : 1 ,//任务id
>              “task_name” : “保健行业” ,//任务名称
>              “task_descp” : “test任务描述” ,//任务描述
>              “task_status” : 0 ,//任务状态：0-排队中（默认）；2
>              “task_status_showStr” : “排队中” ,//任务状态显示字符串
>              “creater” : “ligang@sogou-inc.com” ,//创建人
>              “task_type” : 0 ,//任务类型 ：1-词受众分析;2-网站访问分析
>              “create_time” : “2014-08-05 10:10:11” //创建时间
>              “task_time_type” : 1 ,//任务周期:1-单次（默认）;7-一周;14-二周;30-30天(月）
>              “task_time_type_showStr” : “单次” ,//任务周期显示字符串
>              “task_begin_time” : “2014-08-04 00:00:00” //（采样开始时间）任务开始时间 yyyy-MM-dd h:mm:ss>
>             },
>        "errors": []
>     }
>
>   **接口**
>
>     /task/manage/terminate
>
>   **备注**
>   任务终止操作可以传入特定状态
>





#2.受众特征查询#


##2.1 特征查询##
>**输入**
>
>     {
>        "feature_name" : “特征” //特征名字
>        "feature_type" : 1 //特征类型
>     }
>
>
>
>
>   **输出**
>
>     {
>         "status": 1, // 1成功 500失败
>         "data": {
>           list:[
>           {
>             "feature_name" : "特征名称" ,
>             "feature_descp" : "特征描述" ,
>             "feature_type" : 0 ,
>             "feature_type_showStr" : "特征类型" ,
>             "feature_status" : 0 ,
>             "feature_status_showStr" : "持续积累" ,
>             "audience_num" : "受众数量" ,
>             "count":20//特征数量
>           },
>           {},
>           {},
>           ......
>           ]
>         },
>         "errors": []
>     }
>
>   **接口**
>
>     /feature/manage/list
>
>   **备注**
>
>

##2.2 特征明细查询##
>**输入**
>
>     {
>        "id" : 1 //特征id
>     }
>
>
>
>
>   **输出**
>
>     {
>         "status": 1, // 1成功 500失败
>         "data": {
>             "feature_name" : "特征名称" ,
>             "feature_descp" : "特征描述" ,
>             "feature_type" : 0 ,
>             "feature_type_showStr" : "特征类型" ,
>             "feature_status" : 0 ,
>             "feature_status_showStr" : "持续积累" ,
>             "audience_num" : "受众数量" ,
>             "count":20,//特征数量,
>             "detail":["特征1","特征1","特征1","特征1","特征1","特征1","特征1"]//特征明细
>         },
>         "errors": []
>     }
>
>   **接口**
>
>     /feature/manage/detail
>
>   **备注**
>
>

#3.报表数据#



##3.1 受众人口属性##
>**输入**
>
>     {
>        "task_id" : 1 //任务id,其中0代表全体网民
>        "isForAll" : 0//0-非全体网民（兴趣点覆盖网民）；1-全体网民
>     }
>
>
>
>
>   **输出**
>
>     {
>         "status": 1, // 1成功 500失败
>         "echartsData": {
>             "legend_data" : ['直达','营销广告','搜索引擎','邮件营销',百度','谷歌','必应','其他'] ,
>             "seriesList" : [
>                                {
>                                    "name": "男女比例",
>                                    "data": [
>                                        {
>                                            "value": "335", "name": "男"
>                                        },
>                                        {
>                                            "value": "1548", "name": "女"
>                                        }
>                                    ]
>                                },
>                                {
>                                    "name": "男女比例",
>                                    "data": [
>                                        {
>                                            "value": "335", "name": "男"
>                                        },
>                                        {
>                                            "value": "1548", "name": "女"
>                                        }
>                                    ]
>                                }
>                            ]
>         },
>         "errors": []
>     }
>
>   **接口**
>
>     /report/echarts/getPeoplePieReport
>
>   **备注**
>
>
##3.2 受众地域分布##
>**输入**
>
>     {
>        "task_id" : 1 //任务id,其中0代表全体网民
>        "isForAll" : 0//0-非全体网民（兴趣点覆盖网民）；1-全体网民
>     }
>
>
>
>
>   **输出**
>
>     {
>         "status": 1, // 1成功 500失败
>         "echartsData": {
>             "legend_data" : ['直达','营销广告','搜索引擎','邮件营销',百度','谷歌','必应','其他'] ,
>             "dataRangeMaxVal" : 200,//数据范围最大值，地图报表使用（渐进效果）
>             "seriesList" : [
>                                {
>                                    "name": "男女比例",
>                                    "data": [
>                                        {
>                                            "value": "335", "name": "男"
>                                        },
>                                        {
>                                            "value": "1548", "name": "女"
>                                        }
>                                    ]
>                                },
>                                {
>                                    "name": "男女比例",
>                                    "data": [
>                                        {
>                                            "value": "335", "name": "男"
>                                        },
>                                        {
>                                            "value": "1548", "name": "女"
>                                        }
>                                    ]
>                                }
>                            ]
>         },
>         "errors": []
>     }
>
>   **接口**
>
>     /report/echarts/getAreaMapPieReport
>
>   **备注**
>
>
