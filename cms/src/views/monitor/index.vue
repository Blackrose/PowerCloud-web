<template>
	<div id="wrapper">
		<el-container ref="containerEle">
		  <el-header height="auto">
		      <p class="logo"><i class="el-icon-menu"></i>电云系统监控平台</p>
		      <p class="status-bar">
		      	<!-- 时间 -->
		        <i class="el-icon-time"></i>&nbsp;
		        <span id="time">{{timestamp | filterTime}}&nbsp;&nbsp;&nbsp;</span>
		        <!-- 版面设置 -->
		        <el-popover
		        	v-if="this.permission_monitorScreen"
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
						<!-- 刷新 -->
						<el-button id="btn-reload"  icon="el-icon-refresh" size="mini" type="primary" @click="reload()">刷新</el-button>
						<!-- 告警 -->
						<el-badge
							v-if="this.permission_monitorScreen"
							:value="alertHtmlArr.length" id="btn-alert"
						>
						  <el-button icon="el-icon-bell" size="mini" @click="showAlert()">告警</el-button>
						</el-badge>
						<!-- 登录 -->
						<span id="login-name">您好，{{name}}</span>
		        <a id="btn-logout" class="btn" href="javascript:void(0)" @click="logout()"><svg-icon icon-class="quit"></svg-icon></a>
		      </p>
		  </el-header>
		  <el-main v-if="config">
		  	<!-- 共两行 -->
		  	<el-row v-for="(rowIndex,row_i) in [0,1]" :gutter="15" :key="row_i">
		  		<el-col v-for="(module,index) in config" :key="module.functionname+index" class="grid" :span="col[index]"
		  			 v-if="[0,1,2].indexOf(index - 3*rowIndex) >= 0" >
		  			<!-- ishidden -->
		  			<div v-if="config[index].ishidden == '0'" class="grid-content" :style="{ height: row[rowIndex]}">
		  				<module-table v-if="module.functionname == 'table'"
			  				:moduleIndex = "index"
			  				:paramValue = "config[index].paramvalue"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
			  			>
			  			</module-table>
		  				<module-map v-else-if="module.functionname == 'map'"
			  				:moduleIndex = "index"
			  				:boxHeight = "row[rowIndex]"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
			  				@station-alert = "handleStationAlert"
				  		>
				  		</module-map>
		  				<module-video v-else-if="module.functionname == 'video'"
		  					:moduleIndex = "index"
		  					:paramValue = "config[index].paramvalue"
		  					:boxHeight = "row[rowIndex]"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
				  		>
				  		</module-video>
				  		<module-chart v-else-if="module.functionname == 'chart'"
		  					:moduleIndex = "index"
		  					:paramValue = "config[index].paramvalue"
		  					:boxHeight = "row[rowIndex]"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
				  		>
				  		</module-chart>
				  		<module-transformer v-else-if="module.functionname == 'transformer'"
		  					:moduleIndex = "index"
		  					:paramValue = "config[index].paramvalue"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
				  		>
				  	 </module-transformer>
				  		<module-sys-graph v-else-if="module.functionname == 'sysGraph'"
		  					:moduleIndex = "index"
		  					:paramValue = "config[index].paramvalue"
		  					:boxHeight = "row[rowIndex]"
			  				@module-close = "handleModuleClose"
			  				@module-full-screen = "handleFullScreen"
				  		>
				  		</module-sys-graph>
				  	</div>
		  		</el-col>
				</el-row>
		  </el-main>
		</el-container>
	</div>
</template>

<script type="text/javascript">

	import { Notification } from 'element-ui';
	import { mapGetters } from 'vuex'

	import {getConfig, setConfig} from '@/api/api_monitor' ;

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

			if(this.permission_monitorScreen) {
				this.init();
			}
			else {
				this.$message({
          duration: 0,
          message: '抱歉，您没有权限访问该模块，请联系系统管理员',
          type: 'error'
        });
			}
			/*显示时间*/
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
	    	//每个模块所占的宽度。共6个
	    	col: [],
	    	//每行所占的高度
	    	row: [],
	    	config: null,
	    	//表单验证
				validRules: {
					width: [{ validator: checkSizeW, trigger: 'blur' }],
					height: [{ validator: checkSizeH, trigger: 'blur' }],
				},
				//通知的HTML内容
				alertHtmlArr: []
			}
	  },
	  watch: {
	  	size : function(newValue, oldValue) {
	  		this.setCol(newValue, this.config)
	  		this.setRow(newValue, this.config)
	  	}
	  },
	  computed: {
	  	...mapGetters([
      'name',
      'permissions',
      'monitor'
    	]),
    	//是否有监控大屏的查看权限
	    permission_monitorScreen() {
	      let allowed = false;
	      if(Array.isArray(this.permissions)) {
	        this.permissions.forEach( (permission,i) => {
	          //每个功能模块 前后端的命名可能有差异
	          //this.moduleName：前端命名
	          //API_MAP[this.moduleName]：后端命名
	          if(permission.functionname == "monitorScreen") {
	            allowed =  permission.selectfunction == 0
	            return
	          }
	        })
	      }
	      return allowed
	    }
  	},
  	filters: {
  		filterTime (timestamp) {
  			let now = new Date(timestamp);
  			let y = [now.getFullYear(),format(now.getMonth()+1),format(now.getDate())].join("-");
  			let t = [now.getHours(),format(now.getMinutes()),format(now.getSeconds())].join(":");

  			function format(v){
					return v < 10 ? "0"+v : v;
				}
  			return y + "  " + t
  		}
  	},
  	methods: {
  		/*初始化*/
  		init () {
  			//获取配置文件
				Promise.all([this.$store.dispatch('setMonitorSelectOptions'), getConfig()]).then( resArr => {
					let res = resArr[1];
					if(res.ok) {
						this.size = JSON.parse(res.data.size);
						this.sizeSetting = JSON.parse(res.data.size);
			      this.config = res.data.config;
					}
					console.log(this.config)
				})
  		},
  		/*模块关闭*/
  		handleModuleClose (e) {
  			if(this.config[e]) {
  				this.config[e].ishidden = "1";
  				this.setCol(this.size, this.config);
  				this.setRow(this.size, this.config);
  			}
  		},
  		/*模块全屏,全屏和关闭不一样，关闭不可逆，全屏可逆*/
  		/*全屏不改变ishidden，只改变el-col的宽度 和 el-row的高度*/
  		handleFullScreen (e) {
  			/*该模块正处于全屏状态，则应该回到初始状态*/
  			if(this.monitor.fullScreenIndex == e) {
  				this.setCol(this.size, this.config);
  				this.setRow(this.size, this.config);
  				this.$store.dispatch('setMonitorFullScreenIndex', -1)
  			}
  			/*否则，该模块现在开始全屏*/
  			else {
  				this.$store.dispatch('setMonitorFullScreenIndex', e)
  				this.col.forEach( (c,i) => {
  					this.$set(this.col, i, 0);
  				})
  				this.$set(this.col, e, 24);
  				this.$set(this.row, parseInt(e/3), "92vh");
  			}
  		},
  		/*取消版面设置*/
  		cancelSetting() {
  			this.visibleSettingPop = false;
  			this.sizeSetting = JSON.parse(JSON.stringify(this.size));
  		},
  		/*保存版面设置*/
  		saveSetting() {
  			this.$refs["sizeForm"].validate((valid) => {
          if (valid) {
          	let param = {
          		type: "size",
          		data: this.sizeSetting
          	}
          	setConfig(param).then( res => {
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
          		else {
          			this.$notify.error({
		              title: '失败',
		              message: res.data,
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
  		/*登出*/
  		logout() {
	      this.$store.dispatch('LogOut').then(() => {
	        location.reload() // 为了重新实例化vue-router对象 避免bug
	      })
	    },
	    /*显示右上角告警*/
	    handleStationAlert(htmlArr) {
	    	this.alertHtmlArr = htmlArr;
	    	this.showAlert();
	    },
	    showAlert() {
	    	/*关闭所有通知*/
	    	Notification.closeAll();
	    	if(!this.alertHtmlArr.length) return
	    	this.$notify({
          title: '告警',
          dangerouslyUseHTMLString: true,
          message: this.alertHtmlArr.join(""),
          type: 'warning',
          offset: 50,
        });
	    },
	    /*刷新*/
	    reload() {
	    	location.reload()
	    },
	    setCol (size, config) {
	    	let col = [];
	      const total_w = 24;
	      //第一个格子的宽
	      const w_1 = Math.round((size.width/100)*total_w);
	      //第二个格子的宽
	      const w_2 = total_w - w_1*2;

	      for(let i = 0 ; i < 6 ; i++) {
	      	//如果ishidden,则宽度等于0
	      	if(config[i].ishidden == "1") {
	      		col[i] = 0
	      	}
	      	//否则，根据相邻格子的隐藏情况，判断自己的大小
	      	else {
	      		let relative_i = i % 3;  //一共两行
	      		let row_n = parseInt(i / 3); //行数
	      		let hidden_n = (+config[row_n*3].ishidden) + (+config[row_n*3+1].ishidden) + (+config[row_n*3+2].ishidden)
 	      		//隐藏两个
 	      		if(hidden_n == 2) {
	      			col[i] = total_w;
	      		}
	      		//隐藏一个
	      		else if(hidden_n == 1){
	      			//1、如果是第1个隐藏，则第2个等于w_1 + w_2，第3个等于w_1
	      			//3、如果是第3个隐藏，则第2个等于w_1 + w_2，第1个等于w_1
	      			if(config[row_n*3].ishidden == "1" || config[row_n*3+2].ishidden == "1") {
	      				col[i] = relative_i == 1 ? w_1 + w_2 : w_1;
	      			}
	      			//2、如果第2个隐藏，则第1个等于w_1 + w_2，第3个等于w_1
	      			else if(config[row_n*3+1].ishidden == "1") {
	      				col[i] = relative_i == 0 ? w_1 + w_2 : w_1;
	      			}
	      		}
	      		//都不隐藏
	      		else if(hidden_n == 0) {
	      			col[i] = relative_i == 1 ? w_2 : w_1;
	      		}
	      	}
	      }
	      this.col = col;
	    },
	    setRow (size, config) {
	    	const total_h = 92; //全屏 92vh
	    	const h_1 = Math.round((size.height/100)*total_h);
	      const h_2 = total_h - h_1;
	      let row = [h_1+"vh", h_2+"vh"]
	    	//第1行格子都没有
	    	if(config[0].ishidden=="1" && config[1].ishidden=="1" && config[2].ishidden=="1")
	    	{
	    		row[0] = 0;
	    		row[1] = total_h + "vh";
	    	}
	    	//第2行格子都没有
	    	if(config[3].ishidden=="1" && config[4].ishidden=="1" && config[5].ishidden=="1")
	    	{
	    		row[1] = 0;
	    		row[0]= total_h + "vh";
	    	}
	    	this.row = row;
	    }
  	}
	}
</script>

<style type="text/css">
	.el-badge__content.is-fixed{
		border: none;
		top: 5px;
	}
	.el-notification__content p {
		margin: 5px 0;
	}

	.el-notification__content p > i{
		margin-right: 5px;
		color: #E6A23C;
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
	  // background-image: linear-gradient(45deg, #6a78b7, #444f87);
	  // background-image: linear-gradient(45deg, #6a9eb7, #044a5f);

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
			border-color: #fff;
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
