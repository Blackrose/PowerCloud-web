<template>
	<div id="wrapper">
		<el-container ref="containerEle">
		  <el-header height="auto">
		      <p class="logo"><i class="el-icon-menu"></i>电云系统监控平台</p>
		      <p class="status-bar">
		        <span><i class="el-icon-time"></i><i id="date"></i></span>
		        <span id="time">1234-12:123</span>
		        <span id="login-name">asdas</span>
		        <a id="btn-logout" class="btn" href="javascript:void(0)"><i class="el-icon-upload2"></i>退出</a>
		        <a id="btn-size" class="btn" href="javascript:void(0)"><i class="el-icon-setting"></i>版面设置</a>
		        <a id="btn-reload" class="btn" href="javascript:void(0)"><i class="el-icon-refresh"></i>刷新</a>
		      </p>
		  </el-header>
		  <el-main v-if="config">
		  	<!-- 第一行 -->
		  	<el-row :gutter="20" v-show="row[0].show">
		  		<!-- <transition-group name="el-zoom-in-top"> -->
			  		<el-col :key="index" class="grid" v-for="(module,index) in config" v-if="index < 3" v-show="!config[index].isHidden" :span="col[index]" >
			  			<div class="grid-content" :style="{ height: row[0].h}">
			  				<module-table v-if="module.functionName == 'table'"
				  				:moduleIndex = "index"
				  				:paramValue = "config[index].paramValue"
				  				:boxHeight = "row[0].h"
				  				:selectOption = "selectOption"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
				  			>
				  			</module-table>
			  				<module-map v-else-if="module.functionName == 'map'"
				  				:moduleIndex = "index"
				  				:boxHeight = "row[0].h"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  		</module-map>
			  				<module-video v-else-if="module.functionName == 'video'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramValue"
			  					:boxHeight = "row[0].h"
			  					:selectOption = "selectOption"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  		</module-video>
					  		<module-video v-else-if="module.functionName == 'chart'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramValue"
			  					:boxHeight = "row[0].h"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  		</module-video>
					  		<module-sys-graph v-else-if="module.functionName == 'sysGraph'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramValue"
			  					:boxHeight = "row[0].h"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  		</module-sys-graph>
	<!-- 		  				<module-table v-else
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramValue"
			  					:boxHeight = "row[0].h"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
				  			>
				  			</module-table> -->
					  	</div>
			  		</el-col>
			  	<!-- </transition-group> -->
				</el-row>
				<!-- 第二行 -->
				<el-row :gutter="20" v-show="row[1].show">
					<!-- <transition-group name="el-zoom-in-top"> -->
		  		<el-col :key="index" class="grid" v-for="(module,index) in config" v-if="index >= 3" v-show="!config[index].isHidden" :span="col[index]">
		  			<div class="grid-content" :style="{ height: row[1].h}">
				  		<module-table v-if="module.functionName == 'table'"
			  				:moduleIndex = "index"
			  				:boxHeight = "row[1].h"
			  				:paramValue = "config[index].paramValue"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
			  			>
			  			</module-table>
		  				<module-map v-else-if="module.functionName == 'map'"
			  				:moduleIndex = "index"
			  				:boxHeight = "row[1].h"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
				  		>
				  		</module-map>
		  				<module-video v-else-if="module.functionName == 'video'"
		  					:moduleIndex = "index"
		  					:paramValue = "config[index].paramValue"
		  					:boxHeight = "row[1].h"
		  					:selectOption = "selectOption"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
				  		>
				  		</module-video>
				  		<module-sys-graph v-else-if="module.functionName == 'sysGraph'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramValue"
			  					:boxHeight = "row[1].h"
			  					:selectOption = "selectOption"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  		</module-sys-graph>
		  				<!-- <module-table v-else
			  				:moduleIndex = "index"
			  				:paramValue = "config[index].paramValue"
			  				:boxHeight = "row[1].h"
			  				:selectOption = "selectOption"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
			  			>
			  			</module-table> -->
				  	</div>
		  		</el-col>
		  		<!-- </transition-group> -->
				</el-row>
		  </el-main>
		</el-container>
	</div>
</template>

<script type="text/javascript">
	import * as apiMonitor from '@/api/api_monitor' ;
	// import {fetchTreeList} from '@/api/api' ;

	import ModuleTable from './module/table/index.vue';
	import ModuleMap from './module/map/index.vue';
	import ModuleVideo from './module/video/index.vue'
	import ModuleSysGraph from './module/sysGraph/index.vue'

	export default {
		components: {
			'module-table': ModuleTable,
			'module-map': ModuleMap,
			'module-video': ModuleVideo,
			'module-sys-graph': ModuleSysGraph,
		},
		mounted () {

		},
		created () {
			//获取配置文件
			/*Promise.all([apiMonitor.getConfig(1), apiMonitor.getSelectOptions()]).then( resArr => {
				if(resArr[0]) {
					this.size = resArr[0].data.size;
	        this.config = resArr[0].data.config;
	        this.originConfg = JSON.parse(JSON.stringify(this.config));
				}
				if(resArr[1]) {
					this.selectOption = resArr[1].data;
				}
			})*/


			Promise.all([apiMonitor.getSelectOptions()]).then( resArr => {
				if(resArr[0]) {
					this.selectOption = resArr[0].data;
				}

				let res = {
					"status": 1,
					"msg": "OK",
					"succeeded": true,
					"ok": true,
					"data": {
					"size": {
						"width": 25,
						"height": 60
					},
					"config": [
						{
							"id":1,
							"regionName": "模块1",
							"functionName": "table",
							"paramValue": "{\"electricitySubstationid\":2, \"companyid\":1}",
							"isHidden": false
						},
						{
							"id":2,
							"regionName": "模块2",
							"functionName": "map",
							"paramValue": "{\"electricitySubstationid\":1}",
							"isHidden": false
						},
						{
							"id":3,
							"regionName": "模块3",
							"functionName": "transformer",
							"paramValue": "{\"electricitySubstationid\":1, \"transformerid\": 2}",
							"isHidden": false
						},
						{
							"id":4,
							"regionName": "模块4",
							"functionName": "chart",
							"paramValue": "{\"electricitySubstationid\":2}",
							"isHidden": false
						},
						{
							"id":5,
							"regionName": "模块5",
							"functionName": "sysGraph",
							"paramValue": "{\"electricitySubstationid\":1, \"companyid\":1}",
							"isHidden": false
						},
						{
							"id":6,
							"regionName": "模块6",
							"functionName": "video",
							"paramValue": "{\"companyid\":1, \"electricitySubstationid\":1, \"videoid\": 1}",
							"isHidden": false
						}
					]
					}
				}
				this.size = res.data.size;
	      this.config = res.data.config;
	      this.originConfg = JSON.parse(JSON.stringify(this.config));
			})




		},
		data () {
	    return {
	    	//第一个格子的宽、高百分比
	    	size: null,
	    	config: null,
	    	//界面刷新时，原始的配置
	    	originConfg: null,
	    	//模块全屏的index：默认情况下，6个都不是全屏
	    	fullScreenIndex: -1,
	    	selectOption: null,
			}
	  },
	  computed: {
	  	//所占的宽度 24等分
	    col: function () {
	      let col = [];

	      const total_w = 24;
	      //第一个格子的宽
	      const w_1 = Math.round((this.size.width/100)*total_w);
	      //第二个格子的宽
	      const w_2 = total_w - w_1*2;

	      //每一个格子的宽（根据相邻格子的隐藏与否，判断自己的宽度）
	      col[0] = this.config[1].isHidden && this.config[2].isHidden ?
	      				 total_w : (this.config[1].isHidden ? (w_1+w_2) : w_1)
	      col[1] = this.config[0].isHidden && this.config[2].isHidden ?
	      				 total_w : (this.config[0].isHidden || this.config[2].isHidden ? (w_1+w_2) : w_2)
	      col[2] = this.config[0].isHidden && this.config[1].isHidden ?
	               total_w : w_1;

	      col[3] = this.config[4].isHidden && this.config[5].isHidden ?
	      				 total_w : (this.config[4].isHidden ? (w_1+w_2) : w_1)
	      col[4] = this.config[3].isHidden && this.config[5].isHidden ?
	               total_w : (this.config[3].isHidden || this.config[5].isHidden ? (w_1+w_2) : w_2)
	      col[5] = this.config[3].isHidden && this.config[4].isHidden ?
	               total_w : w_1;

	      // console.log(col);
	      return col
	    },
	    //行所占的高度
	    row: function () {
	    	const total_h = 85; //全屏 80vh
	    	const h_1 = Math.round((this.size.height/100)*total_h);
	      const h_2 = total_h - h_1;
	    	let row = [
		    	{
		    		show: true,
		    		h: h_1+"vh"
		    	},
		    	{
		    		show: true,
		    		h: h_2+"vh"
		    	}
		    ]
	    	//第1行格子都没有
	    	if(this.config[0].isHidden&&this.config[1].isHidden&&this.config[2].isHidden)
	    	{
	    		row[0].show = false;
	    		row[1].h = total_h + "vh";
	    	}
	    	//第2行格子都没有
	    	if(this.config[3].isHidden&&this.config[4].isHidden&&this.config[5].isHidden)
	    	{
	    		row[1].show = false;
	    		row[0].h = total_h + "vh";
	    	}
	    	return row;
	    }
  	},
  	methods: {
  		//模块关闭
  		handleModuleClose (e) {
  			console.log(e)
  			if(this.config[e]) {
  				let _o = this.config[e];
  				_o.isHidden = true;
  				this.$set(this.config, e, _o);
  				// this.config[e].isHidden = true;
  				this.originConfg[e].isHidden = true;
  			}
  			this.handleResize();
  		},
  		//模块全屏,全屏和关闭不一样，关闭不可逆，全屏可逆
  		handleFullScreen (e) {
  			console.log(e)
  			//该模块正处于全屏状态，则应该回到初始状态
  			if(this.fullScreenIndex == e) {
  				this.config.forEach( (o,i) => {
	  				o.isHidden = this.originConfg[i].isHidden;
	  				this.$set(this.config, i, o);
	  			})
	  			this.fullScreenIndex = -1;
  			}
  			//该模块现在全屏
  			else {
  				this.fullScreenIndex = e;
  				this.config.forEach( (o,i) => {
	  				if(i != e) {
	  					o.isHidden = true;
	  					this.$set(this.config, i, o);
	  				}
	  			})
  			}
  			this.handleResize();
  		},
  		handleResize() {

  			// this.emit("module-resize")
  		}
  	}
	}
</script>



<style lang="scss" scoped>

	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed,
	figure, figcaption, footer, header, hgroup,
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		font-family: '微软雅黑';
		vertical-align: baseline;
	}

	#wrapper {
		position: fixed;
	  width: 100%;
	  height: 100vh;
	  background-color: #0f2a3d;
	}

	.btn {
		i {
			margin-right: 0.04rem;
		}
	}

	/*  .out {
		opacity: 0;
		// transition: opacity .2s ease;
	} */
	.el-header {
		padding: 0.06rem;
		z-index: 100;
		overflow: hidden;
		box-shadow: 0.04rem 0.04rem 0.133333rem rgba(128,128,128,0.3);
		background: rgba(0,0,0,0.6);

		.logo {
			margin:0;
	    color: #fff;
	    font-size: 0.1rem;
	    position: absolute;
	    top: 0.05rem;
	    i {
	    	margin-right:0.04rem;
	    }
		}
		.status-bar {
			display: flex;
			justify-content: flex-end;
			color: #fff;
			font-size: 16px;
		}
		.status-bar span,
		.status-bar a {
			margin: 0 0.05rem;
			padding: 0;
		}
	}



	#btn-logout {
		color: #fff;
		opacity: 0.6;
		display: none;
	}
	#login-name {
		display: none;
	}
	.login #btn-logout {
		display: block;
	}
	.login #login-name {
		display: block;
	}

	#login {
	  position: absolute;
	  color: #fff;
	  line-height: 30px;
	  font-size: 18px;
	  border-radius: 5px;
	  left: 50%;
	  top: 50%;
	  width: 350px;
	  height: 300px;
	  margin-left: -205px;
	  margin-top: -200px;
	  padding: 30px;
	}

	.login #login {
		display: none;
	}
	#login .title {
		position: relative;
		text-align: center;
		font-size: 50px;
		margin-bottom: 30px;
	}
	#login ul {
	}
	#login li {
		position: relative;
		line-height: 45px;
		margin:10px;
	}
	#login li input {
		position: absolute;
		left: 0;
		right: 0;
		width: calc(100% - 50px);
	  background: rgba(0,0,0,0.1);
	  line-height: 50px;
	  padding-left: 50px;
	  border: none;
	  border-bottom: 1px solid rgba(255,255,255,0.6);
	  color: #fff;
	  outline: none;
	  font-size: 16px;
	  -webkit-box-shadow: 0 0 0 1000px rgba(0,0,0,0) inset;
	}
	#btn-login {
	  width: 100%;
	  height: 50px;
	  line-height: 50px;
	  margin: 0;
	  padding: 0;
	  background: #00bcd4;
	  margin-top: 30px;
	}
	::-webkit-input-placeholder { /* WebKit browsers */
		color:rgba(255,255,255,0.8);
	}
	#login-tip {
		font-size: 14px;
		text-align: center;
		color: #00bcd4;
	}



  .el-main {
    background-color: transparent;
    color: #fff;
    text-align: center;
    padding: 0.25rem 0.1rem 0 0.1rem;
    overflow: hidden;
  }

  body  .el-container {
    margin-bottom: 40px;
    position: fixed;
	  width: 100%;
	  height: 100vh;
  }


  .el-row {
    margin-bottom: 0.2rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
    // transition: width .4s ease;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    // transition: height .4s ease;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  @media screen and (max-height: 1000px) {

  	.el-main {
  		padding: 0.2rem 0.1rem 0 0.1rem;
  	}

  }

</style>
