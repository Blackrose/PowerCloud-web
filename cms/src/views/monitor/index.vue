<template>
	<div id="wrapper">
		<el-container>
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
		  	<el-row :gutter="20" v-if="rowShow[0]">
				  <el-col v-if="!config[0].hide" :span="col[0]">
				  	<div :class="['grid-content','grid-content-1',!rowShow[1] ? 'grid-content-0' : '']">
				  		<module-table>1</module-table>
				  	</div>
				  </el-col>
				  <el-col v-if="!config[1].hide" :span="col[1]">
				  	<div :class="['grid-content','grid-content-2',!rowShow[1] ? 'grid-content-0' : '']">
				  	<module-map>2</module-map>
				  	</div>
				  </el-col>
				  <el-col v-if="!config[2].hide" :span="col[2]">
				  	<div :class="['grid-content','grid-content-3',!rowShow[1] ? 'grid-content-0' : '']">
				  		<module-table>3</module-table>
				  	</div>
				  </el-col>
				</el-row>

				<el-row :gutter="20" v-if="rowShow[1]">
				  <el-col v-if="!config[3].hide" :span="col[3]"><div :class="['grid-content','grid-content-4','bg-purple',!rowShow[0] ? 'grid-content-0' : '']">4</div></el-col>
				  <el-col v-if="!config[4].hide" :span="col[4]"><div :class="['grid-content','grid-content-5','bg-purple',!rowShow[0] ? 'grid-content-0' : '']">5</div></el-col>
				  <el-col v-if="!config[5].hide" :span="col[5]"><div :class="['grid-content','grid-content-6','bg-purple',!rowShow[0] ? 'grid-content-0' : '']">6</div></el-col>
				</el-row>
		  </el-main>
		</el-container>
	</div>
</template>

<script type="text/javascript">
	import * as apiMonitor from '@/api/api_monitor' ;

	import ModuleTable from './module/table/index.vue';
	import ModuleMap from './module/map/index.vue'

	export default {
		components: {
			'module-table': ModuleTable,
			'module-map': ModuleMap,
		},
		created: function() {
			//获取配置文件
			apiMonitor.getConfig(1).then(response => {
				console.log(response)
        this.config = response.data.config
	    })
		},
		data () {
	    return {
	    	config: null
			}
	  },
	  computed: {
	    col: function () {
	      let col = [];
	      col[0] = this.config[1].hide&&this.config[2].hide ? 24 : (this.config[1].hide ? 18 : 6)
	      col[1] = this.config[0].hide&&this.config[2].hide ? 24 : (this.config[0].hide||this.config[2].hide ? 18 : 12)
	      col[2] = this.config[0].hide&&this.config[1].hide ? 24 : 6;

	      col[3] = this.config[4].hide&&this.config[5].hide ? 24 : (this.config[4].hide ? 18 : 6)
	      col[4] = this.config[3].hide&&this.config[5].hide ? 24 : (this.config[3].hide||this.config[5].hide ? 18 : 12)
	      col[5] = this.config[3].hide&&this.config[4].hide ? 24 : 6;
	      console.log(col);
	      return col
	    },
	    rowShow: function() {
	    	let rowShow = [];
	    	rowShow[0] = !(this.config[0].hide&&this.config[1].hide&&this.config[2].hide);
	    	rowShow[1] = !(this.config[3].hide&&this.config[4].hide&&this.config[5].hide);
	    	return rowShow;
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
    padding: 3%;
  }

  body  .el-container {
    margin-bottom: 40px;
    position: fixed;
	  width: 100%;
	  height: 100vh;
  }


  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }


  .grid-content-1,
  .grid-content-2,
  .grid-content-3 {
  	height: 48vh;
  }

  .grid-content-4,
  .grid-content-5,
  .grid-content-6 {
  	height: 32vh;
  }

  .grid-content-0 {
  	height: 80vh;
  }

</style>
