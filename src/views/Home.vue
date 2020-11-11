<template>
    <div id="home" class="clearfix">
        <headerBar>
            <div slot="home" class="home-header-bar">
                <span class="logo">
                微信精选
            </span>

            </div>
        </headerBar>
        <ul class="homeNav">
            <li v-for="(item,index) in navbar" :key="index" class="navBarLi">
                <router-link :to="{path:item.url,query:{type:item.type}}">{{item.text}}</router-link>
            </li>
        </ul>
        <div v-show="loading" v-loading="loading" element-loading-text="拼命加载中" style="width: 100%"
             class="loading"></div>
        <el-alert v-show="!ifReturnMsg" class="newsLoadError" title="暂无更新..." type="error" description="此频道暂无更新，请先休息一下！"
                  show-icon></el-alert>
        <transition enter-active-class="bounceInLeft" leave-active-class="bounceOutRight">
            <ul class="newsContent animated" v-show="!loading&&ifReturnMsg">
                <a
                        v-for="(val,index) in listCon"
                        target="_blank"
                        :href="val.url"
                        class="newsDetaile"
                        :key="index"
                >
                    <p class="title">{{val.title}}</p>
                    <div class="pics6">
                        <div class="status3_pics">
                            <ul class="pics6_status3">
                                <li>
                                    <img class="status3-pic" alt="加载出错" v-lazy="val.thumbnail_pic_s">
                                </li>
                                <li>
                                    <img class="status3-pic" alt="加载出错" v-lazy="val.thumbnail_pic_s02 || val.thumbnail_pic_s">
                                </li>
                                <li>
                                    <img class="status3-pic" alt="加载出错" v-lazy="val.thumbnail_pic_s03 || val.thumbnail_pic_s">
                                </li>
                            </ul>

                        </div>
                        <div class="bottomInfo clearfix">
                            <Icon type="fireball" size="10" color="#d43d3d" v-show="val.hot===1"></Icon>
                            <span class="avIcon" v-show="val.label==='广告'">广告</span>
                            <span class="writer">{{val.author_name}}</span> &nbsp;&nbsp;
                            <span class="comment_count">评论&nbsp;0</span>
                            <span class="datetime">{{val.date|date}}</span>
                        </div>
                    </div>
                </a>
            </ul>
        </transition>
    </div>
</template>

<script>
    import moment from 'moment'
    import headerBar from '../components/Header-bar.vue'
    import bottomNav from '../components/Bottom-nav.vue'
    import toTop from '../components/To-top.vue'
    import * as type from '../store/mutation-types.js'
    import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex'
    import axios from 'axios'

    export default {
        components: {
            headerBar,
            bottomNav
        },
        computed: {
            ...mapGetters([
                'newsList',
                'loading',
                'list',
                'ifReturnMsg',
                'oneDetail',
                'routerChange',
                'downLoadMore'
            ]),
            listCon: function () {
                if (this.$route.query.type) {
                    return this.list[this.$route.query.type];
                } else {
                    return this.list[this.first]
                }
            },
        },
        beforeRouteUpdate(to, from, next) {
            this.$store.commit(type.PULLDOWNBTN, false);
            next();
        },
        methods: {
            ...mapActions([
                'getNews'
            ]),
            handleScroll() {
                this.top = window.document.body.scrollTop > 400;
            },
        },
        mounted() {
            this.getNews({
                kind: this.first,
                flag: this.routerChange
            });
            this.loading = true;
            const _this = this;
            window.addEventListener('scroll', this.handleScroll);
            console.log("新闻列表内容为:", this.listCon)
        },
        watch: {
            '$route': function () {
                this.getNews({
                    kind: this.$route.query.type,
                    flag: this.routerChange
                });
                if (this.routerChange) {
                    this.$store.commit(type.CHANGE_LOADING_STATE, true)
                } else {
                    this.$store.commit(type.CHANGE_LOADING_STATE, false)
                }
                this.first = window.location.search.substring(6);
                this.$store.commit(type.ROUTERCHANGE, true);
                // this.$store.commit(type.PULLDOWNBTN, false);
            },
        },
        filters: {
            date: function (input) {
                if (!input) {
                    return ''
                }
                var time = moment(input).startOf('minute').fromNow();
                // var reg = /(([1-9][0-9]{0,1})\s)minutes ago/.exec(time);
                return time;
            }
        },
        data() {
            return {
                navbar: [
                    {
                        text: '头条',
                        url: '/home/top',
                        type: 'top'
                    },
                    {
                        text: '社会',
                        url: '/home/shehui',
                        type: 'shehui'
                    },
                    {
                        text: '国内',
                        url: '/home/guonei',
                        type: 'guonei'
                    },
                    {
                        text: '国际',
                        url: '/home/guoji',
                        type: 'guoji'
                    },
                    {
                        text: '娱乐',
                        url: '/home/yule',
                        type: 'yule'
                    },
                    {
                        text: '体育',
                        url: '/home/tiyu',
                        type: 'tiyu'
                    },
                    {
                        text: '军事',
                        url: '/home/junshi',
                        type: 'junshi'
                    },
                    {
                        text: '科技',
                        url: '/home/keji',
                        type: 'keji'
                    },
                    {
                        text: '财经',
                        url: '/home/caijing',
                        type: 'caijing'
                    },
                    {
                        text: '时尚',
                        url: '/home/shishang',
                        type: 'shishang'
                    }
                ],
                top: false,
                first: window.location.search.substring(6),
            }
        },
    }
</script>

<style lang="less" scoped rel="styleheet/less">@import "../assets/css/transtion.less";
@import '../assets/css/border.less';

.home-header-bar {
    & > i {
        margin-top: 0.2rem;
    }

    .logo {
        color: #fff;
        font-size: 18px;
        vertical-align: middle;

        i {
            vertical-align: middle;
        }
    }

    .homeEmail {
        margin-left: 0.22rem;
    }

    .search {
        display: inline-block;

        .homeSearch {
            margin-right: 0.22rem;
            margin-top: 0.2rem;
        }
    }

}

.homeNav {
    width: 100%;
    overflow: hidden;
    overflow-x: auto;
    text-align: center;
    position: fixed;
    left: 0;
    font-size: 0;
    top: 1.2rem;
    background: #f4f5f6;
    font-family: '微软雅黑';
    white-space: nowrap;
    z-index: 999;

    .navBarLi {
        display: inline-block;
        height: 1rem;
        line-height: 1rem;
        width: 1.4rem;
        font-size: 16px;

        a {
            color: #000;
        }

        .router-link-active {
            color: #d43d3d;
            font-size: 17px;
            font-weight: bold;
        }
    }
}

::-webkit-scrollbar {
    display: none;
}

.newsContent {
    margin-top: 2.3rem;
    width: 100%;

    .newsDetaile {
        width: 94%;
        display: block;
        position: relative;
        margin: 0 auto;
        padding-bottom: 0.15rem;
        .borderBottom(1px, #ccc);

        .title {
            font-size: 16px;
            font-weight: bold;
            color: #000;
            padding-top: 0.2rem;
            padding-bottom: 0.15rem;
        }

        /*img {*/
        /*    width: 31.1%;*/
        /*    margin-right: 0.21rem;*/
        /*    height: 2.3rem;*/
        /*}*/
        .pics6_status3 {
            display: flex;
            display: -webkit-flex;
        }
        .pics6 .pics6_status3 li .status3-pic {
            width: 100%;
            height: 100%;
        }

        .pics6 .pics6_status3 li{
            width: 33.333%;
            height: 100%;
            text-align: center;
        }

        .bottomInfo {
            font-size: 10px;
            margin-top: 0.15rem;

            .writer {
                color: #000;
            }

            .comment_count {
                color: #000;
            }

            .datetime {
                float: right;
                color: #000;
            }

            .avIcon {
                display: inline-block;
                height: 0.4rem;
                width: 0.9rem;
                text-align: center;
                line-height: 0.4rem;
                border-radius: 4px;
                border: 1px solid #39f;
                font-size: 10px;
                margin-right: 0.1rem;
            }
        }
    }
}

.loading {
    margin-top: 3.4rem;
}

.newsLoadError {
    margin: 2.3rem auto;
    font-size: 25px;
    width: 90%;
}

.pulldownload {
    margin-bottom: 1.3rem;
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    color: #000;
    font-size: 18px;
    text-align: center;
}

.top {
    position: absolute;
    bottom: 2rem;
    right: 0.15rem;
    background: #d43d3d;
    color: #fff;
    text-align: center;
    border-radius: 50%;
}

.pulldownbtn {
    position: absolute;
    margin: 0 auto;
    left: 50%;
    top: 0.5rem;
    z-index: 1000000;
}
</style>
