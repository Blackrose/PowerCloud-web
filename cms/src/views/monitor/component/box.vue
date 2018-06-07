<template>
	<div class="box-card">
		<a href="javascript:void(0)" class="btn x" @click="close()">
			<svg-icon icon-class="x"></svg-icon>
		</a>
		<a href="javascript:void(0)" class="btn full-screen" @click="fullScreen()">
			<svg-icon icon-class="full_screen"></svg-icon>
		</a>
	  <div class="box-header">
	  	<div class="title-wrapper"><p class="title"><svg-icon class="title-icon" :icon-class="titleIcon"></svg-icon>{{title}}</p></div>
	  </div>
	  <!-- 上面的级联选择框 -->
  	<el-row class="select-bar" v-if="paramValue">
  		<el-col>
				<el-cascader class="my-select"
			    size="mini"
			    :show-all-levels="true"
			    :options="options"
			    v-model="selectedOptions"
			    @change="selectBarChange">
			  </el-cascader>
			</el-col>
		</el-row>

	  <div class="box-content">

	  	<slot></slot>
	  </div>
	</div>
</template>

<script type="text/javascript">

	import {fetchList} from '@/api/api' ;

	export default {
		props: {
			title: {   //当前模块的名称：对应src/api/api.js中API_URL的KEY
	      type: String,
	      default: function () {
	        return "模块"
	      }
	    },
	    titleIcon: {
	    	type: String,
	      default: function () {
	        return "el-icon-circle-plus"
	      }
	    },
	    type: {
	    	type: String,
	      default: function () {
	        return ""
	      }
	    },
	    paramValue: {
	    	type: String,
	      default: function () {
	        return ''
	      }
	    },
	    selectOption: {
	    	type: Array,
	      default: function () {
	        return []
	      }
	    },
		},
		data() {
    	return {
    		options: [],
    		//选中的选项，为数组格式，[第一级,第二级,第三极]
        selectedOptions: []
      }
    },
		created () {
			//这个参数，证明有级联选项
			if(this.paramValue) {
				this.options = this.generateOptions(this.type);
	    	//变电站的的ID,从config里的paramValue参数中解析获取
				let param = JSON.parse(this.paramValue);
				this.selectedOptions =  [param.companyid, param.electricitysubstationid];
				if(this.type == "video") {
					this.selectedOptions.push(+param.videoid)
				}
			}
		},
		methods: {
			//生成二级级联选项
			generateOptions (type) {
    		let options = [];
    		//一级目录
    		this.selectOption.forEach( (o, i) => {
    			let company = {};
    			company.value = o.id;
    			company.label = o.company;
    			company.children = [];
    			if(o.children && (o.children).length) {
    				//二级目录
    				o.children.forEach( (_o, _i) => {
    					let station = {};
      				station.value = _o.id;
      				station.label = _o.substation;
      				company.children.push(station);
      				if(type == "video") {
      					station.children = [];
      					//如果该变电站下有视频
      					if(_o.children.video && (_o.children.video).length) {
      						//三级目录
      						_o.children.video.forEach( (__o, __i) => {
      							let video = {};
			      				video.value = __o.id;
			      				video.label = "编号"+__o.num;
			      				station.children.push(video);
      						})
      					}
      				}
    				})
    				options.push(company);
    			}
    		})
    		return options;
			},
			selectBarChange (v) {
				this.$emit('box-select-bar-change', v)
			},
			close () {
				this.$emit('box-close', '我是子元素传过来的')
			},
			fullScreen () {
				this.$emit('box-full-screen', '我是子元素传过来的')
			},
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	.my-select {
		.el-input .el-input__inner{
			background: transparent;
		}
		.el-cascader__label {
			color: #fff;
			& > span {
				color: rgba(255,255,255,0.6);
			}
		}
		.el-input .el-input__inner, .el-input__inner {
	    border-color: rgba(255,255,255,0.4);
		}

		.el-input.is-active .el-input__inner, .el-input__inner:focus {
	    border-color: #00bcd4;
		}
	}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
	.btn svg {
		width: 100%;
		height: 100%;
	}
  .box-card {
  	background: hsla(0,0%,100%,.2);
    color: #fff;
    border: 1px solid #26c6da;
    border-radius: 5px;
    height: 100%;
    padding: 0.15rem 0.1rem 0.1rem 0.1rem;
    position: relative;
    margin-bottom: 0.1rem;

    .box-header {
	  	border: none;
	    padding: 0;
	    position: absolute;
	    z-index: 100;
	    top: 0;
	    left: 0.1rem;
	  }

	  .title-wrapper {
	  	text-align: left;
	  }
	  .title {
	  	display: inline-block;
	    text-align: left;
	    height: 0.15rem;
	    line-height: 0.15rem;
	    font-size: 0.08rem;
	    margin: 0;
	    margin-left: -0.1rem;
	    padding: 0 0.1rem;
	    background: #00bcd4;
	    border-radius: 0 0 5px 0;

		  .title-icon {
		  	margin-right: 5px;
		  }
		}

		.x,
		.full-screen {
			color: #fff59d;
			display: none;
			background-size: contain;
			position: absolute;
		  width: 18px;
		  height: 18px;
		  top: 10px;
		  padding: 0;
		  margin: 0;
		  border-radius: 0;
		  transition: transform .5s ease;
		  z-index: 200;
		}
		.x {
		  right: 15px;
		}
		.full-screen {
			width: 15px;
		  height: 15px;
		  top: 12px;
		  right: 48px;
		}
		.x:hover,
		.full-screen:hover {
			transform: rotate(360deg);
		}

		.box-content {
			height: calc(100% - 45px);
			overflow: hidden;
		}

		.select-bar {
			margin: 10px 0 10px 0;
		}

  }

  .box-card:hover {
		.x, .full-screen {
			display: block;
		}
	}

</style>