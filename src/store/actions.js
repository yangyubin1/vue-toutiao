import axios from 'axios'
import jsonp from 'jsonp'

import * as type from './mutation-types.js'

export default {
    getNews({            //首页的数据请求
                commit,
                state
            }, pay) {
        if (pay.kind && pay.flag) {

            axios.get('http://localhost:9234/api/' + pay.kind).then(res => {
                console.log("新闻获取内容:",res)
                commit(type.GET_NEWSLIST, {
                    data: res.data.result.data,
                    kind: pay.kind
                });
                commit(type.CHANGE_LOADING_STATE, false);
                if (res.data.result.data) {
                    commit(type.RETURN, true);
                } else {
                    commit(type.RETURN, false);
                }
            }).catch(e => {
                console.log("请求第三方数据失败:", e)
            })

            // jsonp('http://m.toutiao.com/list/?tag=' + pay.kind + '&ac=wap&count=20&format=json_raw&as=A125A8CEDCF8987&cp=58EC18F948F79E1&min_behot_time=' + parseInt((new Date().getTime()) / 1000),
            //     function (err, res) {
            //
            //     })
        }
    },
    pulldownloadmore({    //下拉点击后加载数据
                         commit,
                         state
                     }, payload) {
        if (payload.flag && payload.kind) {
            commit(type.PULLDOWNBTN, false);
            jsonp('http://m.toutiao.com/list/?tag=' + payload.kind + '&ac=wap&count=20&format=json_raw&as=A125A8CEDCF8987&cp=58EC18F948F79E1&min_behot_time=' + parseInt((new Date().getTime()) / 1000),
                function (err, res) {
                    commit(type.GET_NEWSLIST, {
                        data: res.data,
                        kind: payload.kind
                    });
                });
        }
    },
    setUserInfo({         //登录操作
                    commit,
                    state
                }, res) {
        localStorage.setItem('userName', JSON.stringify(res));
        localStorage.setItem('logined', true);
        commit(type.GETUSERDATA, res)
        commit(type.LOGINING, true);
    },
    setSignOut({          //退出登录操作
                   commit
               }) {
        localStorage.removeItem('userName');
        localStorage.setItem('logined', false);
        commit(type.LOGINING, false);
        commit(type.LOGOFF, false);
    },
}
