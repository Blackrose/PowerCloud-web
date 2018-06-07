<template>
	<div id="wrapper">
		<el-container ref="containerEle">
		  <el-header height="auto">
		      <p class="logo"><i class="el-icon-menu"></i>电云系统监控平台</p>
		      <p class="status-bar">
		        <i class="el-icon-time"></i>
		        <span id="time">{{timestamp | filterTime}}&nbsp;&nbsp;&nbsp;</span>

		        <el-popover
						  placement="bottom"
						  width="160"
						  v-model="visibleSettingPop">
						  <div>
						  	<p class="sizeForm-tip">模块1所占百分比：</p>
						  	<el-form ref="sizeForm" :model="sizeSetting" :rules="validRules" label-width="30px">
								  <el-form-item label="宽" prop="width">
								    <el-input v-model.number="sizeSetting.width" placeholder="10-100"></el-input>
								  </el-form-item>
								  <el-form-item label="高"  prop="height">
								    <el-input v-model.number="sizeSetting.height" placeholder="10-100"></el-input>
								  </el-form-item>
								</el-form>
						  </div>
						  <div style="text-align: right; margin: 0">
						    <el-button size="mini" type="text" @click="cancelSetting()">取消</el-button>
						    <el-button type="primary" size="mini" @click="saveSetting()">保存</el-button>
						  </div>
						  <el-button id="btn-setting" type="primary" plain  slot="reference" icon="el-icon-setting" size="mini">版面设置</el-button>
						</el-popover>

						<el-button id="btn-reload"  icon="el-icon-refresh" size="mini" type="primary">刷新</el-button>

						<el-badge :value="alertHtmlArr.length" id="btn-alert">
						  <el-button icon="el-icon-bell" size="mini" @click="showAlert()">告警</el-button>
						</el-badge>


						<span id="login-name">您好，{{name}}</span>
		        <a id="btn-logout" class="btn" href="javascript:void(0)" @click="logout()"><svg-icon icon-class="quit"></svg-icon></a>
		      </p>
		  </el-header>
		  <el-main v-if="config">
		  	<!-- 第一行 -->
		  	<el-row :gutter="15" v-show="row[0].show">
		  		<!-- <transition-group name="el-zoom-in-top"> -->
			  		<el-col :key="index" class="grid" v-for="(module,index) in config" v-if="index < 3" v-show="!config[index].isHidden" :span="col[index]" >
			  			<div class="grid-content" :style="{ height: row[0].h}">
			  				<module-table v-if="module.functionname == 'table'"
				  				:moduleIndex = "index"
				  				:paramValue = "config[index].paramvalue"
				  				:boxHeight = "row[0].h"
				  				:selectOption = "selectOption"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
				  			>
				  			</module-table>
			  				<module-map v-else-if="module.functionname == 'map'"
				  				:moduleIndex = "index"
				  				:boxHeight = "row[0].h"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
				  				@station-alert = "handleStationAlert"
					  		>
					  		</module-map>
			  				<module-video v-else-if="module.functionname == 'video'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramvalue"
			  					:boxHeight = "row[0].h"
			  					:selectOption = "selectOption"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  		</module-video>
					  		<module-chart v-else-if="module.functionname == 'chart'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramvalue"
			  					:boxHeight = "row[0].h"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  		</module-chart>
					  		<module-transformer v-else-if="module.functionname == 'transformer'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramvalue"
			  					:boxHeight = "row[0].h"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  	</module-transformer>
					  		<module-sys-graph v-else-if="module.functionname == 'sysGraph'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramvalue"
			  					:boxHeight = "row[0].h"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  		</module-sys-graph>
					  	</div>
			  		</el-col>
			  	<!-- </transition-group> -->
				</el-row>
				<!-- 第二行 -->
				<el-row :gutter="15" v-show="row[1].show">
					<!-- <transition-group name="el-zoom-in-top"> -->
		  		<el-col :key="index" class="grid" v-for="(module,index) in config" v-if="index >= 3" v-show="!config[index].isHidden" :span="col[index]">
		  			<div class="grid-content" :style="{ height: row[1].h}">
				  		<module-table v-if="module.functionname == 'table'"
			  				:moduleIndex = "index"
			  				:paramValue = "config[index].paramvalue"
			  				:boxHeight = "row[1].h"
			  				:selectOption = "selectOption"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
			  			>
			  			</module-table>
		  				<module-map v-else-if="module.functionname == 'map'"
			  				:moduleIndex = "index"
			  				:boxHeight = "row[1].h"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
			  				@station-alert = "handleStationAlert"
				  		>
				  		</module-map>
		  				<module-video v-else-if="module.functionname == 'video'"
		  					:moduleIndex = "index"
		  					:paramValue = "config[index].paramvalue"
		  					:boxHeight = "row[1].h"
		  					:selectOption = "selectOption"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
				  		>
				  		</module-video>
				  		<module-chart v-else-if="module.functionname == 'chart'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramvalue"
			  					:boxHeight = "row[0].h"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  	</module-chart>
					  	<module-transformer v-else-if="module.functionname == 'transformer'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramvalue"
			  					:boxHeight = "row[0].h"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  	</module-transformer>
				  		<module-sys-graph v-else-if="module.functionname == 'sysGraph'"
			  					:moduleIndex = "index"
			  					:paramValue = "config[index].paramvalue"
			  					:boxHeight = "row[1].h"
			  					:selectOption = "selectOption"
				  				@module-close = "handleModuleClose"
				  				@module-full-screen = "handleFullScreen"
					  		>
					  		</module-sys-graph>
				  	</div>
		  		</el-col>
		  		<!-- </transition-group> -->
				</el-row>
		  </el-main>
		</el-container>
	</div>
</template>

<script type="text/javascript">
	import { Notification } from 'element-ui';
	import { mapGetters } from 'vuex'

	import * as apiMonitor from '@/api/api_monitor' ;
	// import {fetchTreeList} from '@/api/api' ;

	import ModuleTable from './module/table/index.vue';
	import ModuleMap from './module/map/index.vue';
	import ModuleVideo from './module/video/index.vue'
	import ModuleSysGraph from './module/sysGraph/index.vue'
	import ModuleChart from './module/chart/index.vue'
	import ModuleTransformer from './module/transformer/index.vue'

	export default {
		components: {
			'module-table': ModuleTable,
			'module-map': ModuleMap,
			'module-video': ModuleVideo,
			'module-sys-graph': ModuleSysGraph,
			'module-chart': ModuleChart,
			'module-transformer': ModuleTransformer
		},
		created () {
			//获取配置文件
			/*Promise.all([apiMonitor.getConfig(1), apiMonitor.getSelectOptions()]).then( resArr => {
				if(resArr[0]) {
					this.size = res.data.size;
					this.sizeSetting = JSON.parse(JSON.stringify(this.size));
		      this.config = res.data.config;
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
							"regionname": "模块1",
							"functionname": "table",
							"paramvalue": "{\"electricitysubstationid\":1, \"companyid\":1}",
							"ishidden": false
						},
						{
							"id":2,
							"regionname": "模块2",
							"functionname": "map",
							"paramvalue": "{\"electricitysubstationid\":1}",
							"ishidden": false
						},
						{
							"id":3,
							"regionname": "模块3",
							"functionname": "transformer",
							"paramvalue": "{\"electricitysubstationid\":1, \"transformerid\": 2}",
							"ishidden": false
						},
						{
							"id":4,
							"regionname": "模块4",
							"functionname": "sysGraph",
							"paramvalue": "{\"electricitysubstationid\":1, \"companyid\":1}",
							// "functionname": "chart",
							// "paramvalue": "{\"electricitysubstationid\":2}",
							"ishidden": false
						},
						{
							"id":5,
							"regionname": "模块5",
							"functionname": "sysGraph",
							"paramvalue": "{\"electricitysubstationid\":2, \"companyid\":1}",
							"ishidden": false
						},
						{
							"id":6,
							"regionname": "模块6",
							"functionname": "video",
							"paramvalue": "{\"companyid\":1, \"electricitysubstationid\":1, \"videoid\": 1}",
							"ishidden": false
						}
					]
					}
				}
				this.size = res.data.size;
				this.sizeSetting = JSON.parse(JSON.stringify(this.size));
	      this.config = res.data.config;
	      this.originConfg = JSON.parse(JSON.stringify(this.config));
			})

			let self = this
			setInterval( () => {
				self.timestamp = Date.now()
			}, 1000)



		},
		data () {
			let checkSizeW = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('不能为空'));
				}
				if (!Number.isInteger(value)) {
					callback(new Error('请输入整数'));
				}
				else {
					if (value > 50 || value < 10) {
						callback(new Error('输入10-50的整数'));
					}
					else {
						callback();
					}
				}
			};
			let checkSizeH = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('不能为空'));
				}
				if (!Number.isInteger(value)) {
					callback(new Error('请输入整数'));
				}
				else {
					if (value > 90 || value < 10) {
						callback(new Error('输入10-90的整数'));
					}
					else {
						callback();
					}
				}
			};

	    return {
	    	//第一个格子的宽、高百分比
	    	timestamp: Date.now(),
	    	visibleSettingPop: false,
	    	size: {
	    		width: 30,
	    		height: 60
	    	},
	    	sizeSetting: {
	    		width: 30,
	    		height: 60
	    	},
	    	config: null,
	    	//界面刷新时，原始的配置
	    	originConfg: null,
	    	//模块全屏的index：默认情况下，6个都不是全屏
	    	fullScreenIndex: -1,
	    	selectOption: null,
	    	//表单验证
				validRules: {
					width: [{ validator: checkSizeW, trigger: 'blur' }],
					height: [{ validator: checkSizeH, trigger: 'blur' }],
				},
				alertHtmlArr: []
			}
	  },
	  computed: {
	  	...mapGetters([
      'name'
    	]),
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
	    	const total_h = 92; //全屏 80vh
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
  	filters: {
  		filterTime (timestamp) {
  			let now = new Date(timestamp);
  			let y = [now.getFullYear(),formatTime(now.getMonth()+1),formatTime(now.getDate())].join("-");
  			let t = [now.getHours(),formatTime(now.getMinutes()),formatTime(now.getSeconds())].join(":");

  			function formatTime(v){
					return v < 10 ? "0"+v : v;
				}
  			return y + "  " + t
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
  		},
  		cancelSetting() {
  			this.visibleSettingPop = false;
  			this.sizeSetting = JSON.parse(JSON.stringify(this.size));
  		},
  		saveSetting() {
  			this.$refs["sizeForm"].validate((valid) => {
          if (valid) {
          	let param = {
          		type: "size",
          		data: this.sizeSetting
          	}
          	apiMonitor.setConfig(param).then( res => {
          		if(res.ok) {
          			this.visibleSettingPop = false;
  							this.size = JSON.parse(JSON.stringify(this.sizeSetting));
  							this.$notify({
		              title: '成功',
		              message: '保存成功',
		              type: 'success',
		              duration: 2000
		            })
          		}
          	})

          }
          else {
            console.log('error submit!!');
            return false;
          }
        });
  		},
  		logout() {
	      this.$store.dispatch('LogOut').then(() => {
	        location.reload() // 为了重新实例化vue-router对象 避免bug
	      })
	    },
	    //显示右上角告警
	    handleStationAlert(htmlArr) {
	    	this.alertHtmlArr = htmlArr;
	    	this.showAlert();
	    },
	    showAlert() {
	    	//关闭所有通知
	    	Notification.closeAll();
	    	if(!this.alertHtmlArr.length) return
	    	this.$notify({
          title: '告警',
          dangerouslyUseHTMLString: true,
          message: this.alertHtmlArr.join(""),
          type: 'warning',
          offset: 50,
        });
	    }

  	}
	}
</script>

<style type="text/css">
	.el-badge__content.is-fixed{
		border: none;
		top: 5px;
	}
</style>

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
	/* body {
		min-width: 700px;
	  overflow-x:scroll;
	} */
	body  .el-container {
    margin-bottom: 40px;
    position: fixed;
	  width: 100%;
	  height: 100vh;
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

	.el-header {
		min-height: 35px;
		// max-height: 4vh;
		padding: 1vh 0.1rem;
		z-index: 100;
		overflow: hidden;
		box-shadow: 0.04rem 0.04rem 0.133333rem rgba(128,128,128,0.3);
		background: rgba(0,0,0,0.6);
		display: flex;
		align-items: center;
		justify-content: space-between;

		.logo {
			line-height: 2vh;
			margin:0;
	    color: #fff;
	    font-size: 20px;
	    i {
	    	margin-right:0.04rem;
	    }
		}
		.status-bar {
			display: flex;
			justify-content: flex-end;
			color: #fff;
			font-size: 16px;
			align-items: center;
		}
		.status-bar .el-button,
		.status-bar .el-badge{
			margin: 0 0.05rem 0 0;
		}

		#btn-alert > button {
			color: #fff;
			border-color: #E6A23C;
			background: #E6A23C;
			margin-right: 0;
		}
		#btn-alert > button:hover {
			filter: brightness(1.1);
		}
		#btn-setting,
		#btn-reload {
			color: #b3edff;
	    background: rgba(255,255,255,0.2);
	    border-color: rgba(179, 216, 255, 0.5);
		}
		#btn-setting:hover,
		#btn-reload:hover {
			color: #fff;
		}

		#login-name {
			margin: 0 0.1rem;
		}
	}

	.sizeForm-tip {
		font-size: 14px;
		margin-bottom: 10px;
		font-weight: bold;
	}

	#btn-logout {
		opacity: 0.8;
	}

	.el-form-item {
		margin-bottom: 20px;
	}

  .el-main {
    background-color: transparent;
    color: #fff;
    text-align: center;
    padding: 0.25rem 0.1rem 0 0.1rem;
    padding: 1vh 0.1rem;
    overflow: hidden;
  }

  .el-row {
    margin-bottom: 1vh;
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

  @media screen and (max-height: 900px) {

  	.el-header {
  		height: 3vh;
  		padding: 5px 0.1rem;

  		.logo {
  			font-size: 16px;
  		}
  		.status-bar {
  			font-size: 12px;
  		}

  		.el-button--mini, .el-button--mini.is-round {
  			padding: 5px 7px;
  			span {
  			 	font-size: 12px;
  			}
  		}
  	}

  	.el-main {
  		padding: 5px 0.1rem;
  	}

  }

  @media screen and (max-height: 768px) {

  }

</style>
