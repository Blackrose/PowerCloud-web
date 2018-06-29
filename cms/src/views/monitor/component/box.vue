<template>
	<div class="box-card">
		<!-- 标题 -->
	  <div class="box-header">
	  	<div class="title-wrapper"><p class="title"><svg-icon class="title-icon" :icon-class="titleIcon"></svg-icon>{{title}}</p></div>
	  </div>
		<!-- 关闭按钮 -->
		<a href="javascript:void(0)" class="btn x"
			@click="close()">
			<svg-icon icon-class="x"></svg-icon>
		</a>
		<!-- 全屏按钮 -->
		<a href="javascript:void(0)" class="btn full-screen"
			@click="fullScreen()">
			<svg-icon icon-class="full_screen"></svg-icon>
		</a>
		<!-- 曲线模块的配置弹出框 -->
		<el-popover
			popper-class="box-popover"
			v-if="paramValue && type == 'chart' && chartSetting"
		  placement="bottom"
		  width="325"
		  trigger="click"
		  v-model="visibleChartSettingForm">
			<el-form ref="chartSettingForm" :model="chartSetting" label-width="40px"  size="mini">
			  <el-form-item label="时间">
			    <el-select v-model="chartSetting.time.type" placeholder="请选择显示时间">
			      <el-option
				      v-for="item in TIME_TYPE_OPTIONS"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
			    </el-select>
			    <el-row  v-if="chartSetting.time.type == 0">
				    <el-col :span="11">
				      <el-time-picker :editable="false" placeholder="起始时间"  value-format="timestamp" v-model="chartSetting.time.start" style="width: 100%;"></el-time-picker>
				    </el-col>
				    <el-col style="text-align: center;" :span="2">-</el-col>
				    <el-col :span="11">
				      <el-time-picker :editable="false" placeholder="结束时间"  value-format="timestamp" v-model="chartSetting.time.end" style="width: 100%;"></el-time-picker>
				    </el-col>
				  </el-row>
				  <el-row v-if="chartSetting.time.type == 1">
				  	<el-select v-model="chartSetting.time.duration" placeholder="请选择显示时长">
			      <el-option
				      v-for="hour in DURATION_OPTIONS"
				      :key="hour.value"
				      :label="'最近'+hour.value+'小时'"
				      :value="hour.value">
				    </el-option>
			    </el-select>
				  </el-row>
			  </el-form-item>
			  <el-form-item label="参数">
			  	<el-row>
			  		<el-col>
							<el-cascader class="my-select"
								style="width:260px;"
						    size="mini"
						    :show-all-levels="true"
						    :options="options"
						    v-model="selectedOption"
						    @change="chartSelectBarChange">
						  </el-cascader>
						</el-col>
				    <el-col>
				      <el-select v-model="chartSetting.value.parameter" placeholder="显示参数">
					      <el-option
						      v-for="item in PARAMETER_TYPE_OPTIONS"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
					    </el-select>
				    </el-col>
				  </el-row>
			  </el-form-item>
			  <p style="text-align: center;margin: 0"><el-button type="primary" @click="onChartSettingFormSubmit" size="mini">确定</el-button></p>
			</el-form>
			<!-- <el-button type="primary" icon="el-icon-setting" circle></el-button> -->
			<el-button slot="reference" size="mini" class="btn-setting" type="primary" icon="el-icon-setting">设置</el-button>
			<!-- <a  href="javascript:void(0)"  >
				设置<svg-icon  icon-class="setting"></svg-icon>
			</a> -->

		</el-popover>
	  <!-- 上面的级联选择框 -->
  	<el-row class="select-bar" v-else-if="paramValue && type != 'chart'">
  		<el-col>
				<el-cascader class="my-box-select"
			    size="mini"
			    :show-all-levels="true"
			    :options="options"
			    v-model="selectedOption"
			    @change="selectBarChange">
			  </el-cascader>
			</el-col>
		</el-row>
		<!-- 内容 -->
	  <div :class="['box-content',type=='chart' ? 'full-height':'']">
	  	<slot></slot>
	  </div>
	</div>
</template>

<script type="text/javascript">
	import { mapGetters } from 'vuex'

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
	    chartSetting: {
	    	type: Object,
	    	default: function () {
	    		return null
	    	}
	    }
		},
		data() {
    	return {
        //后台获取的选项列表
        selectOptions: [],
        //选中的选项，为数组格式，[第一级,第二级,第三极]
        selectedOption: [],
        visibleChartSettingForm: false,
        TIME_TYPE_OPTIONS: [
        	{
        		value: 0,
        		label: "按时段显示"
        	},
        	{
        		value: 1,
        		label: "实时显示"
        	},
        ],
        DURATION_OPTIONS: [],
        CABINET_TYPE_OPTIONS: [
        	{
        		value: 0,
        		label: "进线柜"
        	},
        	{
        		value: 1,
        		label: "电容柜"
        	},
        	{
        		value: 2,
        		label: "馈电柜"
        	}
        ],
        PARAMETER_TYPE_OPTIONS: [
          {
          	value:"Ia/Ib/Ic",
          	label:"Ia/Ib/Ic"
          },
          {
        		value:"Ua/Ub/Uc",
        		label:"Ua/Ub/Uc"
          },
          {
          	value:"Uab/Uac/Ubc",
          	label:"Uab/Uac/Ubc"
          },
          {
          	value:"activepower",
          	label:"有功功率"
          },
          {
          	value:"reactivepower",
          	label:"无功功率"
          },
          {
          	value:"powerfactor",
          	label:"功率因数"
          }
        ]
      }
    },
    computed: {
    	...mapGetters([
	      'monitor'
	    ]),
	    //处理过的选项列表
	    options () {
	    	return this.generateOptions(this.type)
	    }
    },
    watch: {
      //地图中点击了变电站
      'monitor.stationId': function(newValue, oldValue) {
          let click_stationId = newValue;
          //如果点击的不是当前的变电站，则更新selectedOption的值，使得选中点击的变电站
          if(this.selectedOption.length && click_stationId != this.selectedOption[1]) {
            this.setClickedSelectedOption(click_stationId)
          }
      }
    },
		created () {
			let currentHour = (new Date()).getHours();
			for(let i = 1; i <= currentHour; i++) {
				this.DURATION_OPTIONS.push({value:i});
			}
			//这个参数，证明有级联选项
			if(this.paramValue) {
	    	//变电站的的ID,从config里的paramValue参数中解析获取
				let param = JSON.parse(this.paramValue);
				this.selectedOption =  [param.companyid, param.electricitysubstationid];
				if(this.type == "video") {
					this.selectedOption.push(+param.videoid)
				}
				else if(this.type == "transformer") {
					this.selectedOption.push(+param.transformerid)
				}
				else if(this.type == "chart") {
					this.selectedOption.push(+param.circuitid)
					//曲线模块里，popover菜单里的级联选项！
					this.chartSetting.value.stationid = +param.electricitysubstationid;
					this.chartSetting.value.circuitid = +param.circuitid;
				}
			}
		},
		methods: {
			//生成二级级联选项
			generateOptions (type) {
    		let options = [];
    		//一级目录
    		//vuex中维护的级联选项列表
    		this.monitor.selectOptions.forEach( (o, i) => {
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
      					if(_o.children.video && Array.isArray(_o.children.video)) {
      						//三级目录
      						_o.children.video.forEach( (__o, __i) => {
      							let video = {};
			      				video.value = __o.id;
			      				video.label = "编号"+(__o.num||1);
			      				station.children.push(video);
      						})
      					}
      				}
      				else if(type == "transformer") {
      					station.children = [];
      					//如果该变电站下有变压器
      					if(_o.children.transformer && Array.isArray(_o.children.transformer)) {
      						//三级目录
      						_o.children.transformer.forEach( (__o, __i) => {
      							let transformer = {};
			      				transformer.value = __o.id;
			      				transformer.label = __o.name || "编号"+(__o.num||1);
			      				station.children.push(transformer);
      						})
      					}
      				}
      				else if(type == "chart") {
      					station.children = [];
      					//如果该变电站下有回路
      					if(_o.children.circuit && Array.isArray(_o.children.circuit)) {
      						//三级目录
      						_o.children.circuit.forEach( (__o, __i) => {
      							let obj = {};
			      				obj.value = __o.id;
			      				obj.label = __o.circuitname;
			      				station.children.push(obj);
      						})
      					}
      				}
    				})
    				options.push(company);
    			}
    		})
    		return options;
			},
      //改变级联选项，使得选中的值变成地图模块里点击的变电站的id
      setClickedSelectedOption (stationid) {
        this.monitor.selectOptions.forEach( (company, i) => {
          if(company.children && Array.isArray(company.children)) {
            company.children.forEach( (station, j) => {
              if(station.id == stationid) {
                //只有二级目录
                if(this.type == "table" || this.type == "sysGraph") {
                  this.$set(this.selectedOption, 0, company.id);
                  this.$set(this.selectedOption, 1, station.id);
                  this.selectBarChange(this.selectedOption)
                  return
                }
                //三级目录
                else if(this.type == "transformer") {
                  if(station.children.transformer && Array.isArray(station.children.transformer)) {
                    for(let k = 0 ; k < station.children.transformer.length ; k++) {
                      let transformer = station.children.transformer[k];
                      //默认选择三级目录的第一个
                      this.$set(this.selectedOption, 0, company.id);
                      this.$set(this.selectedOption, 1, station.id);
                      this.$set(this.selectedOption, 2, transformer.id);
                      this.selectBarChange(this.selectedOption);
                      break;
                    }
                    return
                  }
                }
                else if(this.type == "video") {
                  if(station.children.video && Array.isArray(station.children.video)) {
                    for(let k = 0 ; k < station.children.video.length ; k++) {
                      let video = station.children.video[k];
                      //默认选择三级目录的第一个
                      this.$set(this.selectedOption, 0, company.id);
                      this.$set(this.selectedOption, 1, station.id);
                      this.$set(this.selectedOption, 2, video.id);
                      this.selectBarChange(this.selectedOption);
                      break;
                    }
                    return
                  }
                }
                else if(this.type == "chart") {
                  for(let k = 0 ; k < station.children.circuit.length ; k++) {
                      let circuit = station.children.circuit[k];
                      //默认选择三级目录的第一个
                      this.$set(this.selectedOption, 0, company.id);
                      this.$set(this.selectedOption, 1, station.id);
                      this.$set(this.selectedOption, 2, circuit.id);
                      this.chartSelectBarChange(this.selectedOption);
                      this.onChartSettingFormSubmit();
                      break;
                    }
                    return
                }

              }
            })
          }
        })
      },
			selectBarChange (selectedOption) {
				this.$emit('box-select-bar-change', selectedOption)
			},
			chartSelectBarChange (selectedOption) {
				this.chartSetting.value.stationid = selectedOption[1];
				this.chartSetting.value.circuitid = selectedOption[2];
			},
			onChartSettingFormSubmit () {
				this.visibleChartSettingForm = false;
				this.$emit('box-chart-setting', this.chartSetting)
			},
			close () {
				this.$emit('box-close')
			},
			fullScreen () {
				this.$emit('box-full-screen')
			},
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	.my-box-select {
		width: 80%;
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

	.box-popover {
		background: rgba(255,255,255,0.9);
	}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>

	.btn svg {
		width: 100%;
		height: 100%;
	}

	.el-form-item {
		margin-bottom: 15px;
	}
  .box-card {
  	background: hsla(0,0%,100%,.15);
  	// background-image: linear-gradient(45deg, rgba(51, 57, 93, 0.5), #212a53);

  	// background-image: linear-gradient(45deg, rgba(51, 57, 93, 0.5), #0f2a3d);
  	//
    color: #fff;
    box-shadow: 0 0 15px #33395d;
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
		.btn-setting {
			background: transparent;
			font-weight: bold;
			border: none;
			font-size: 14px;
			color: #00bcd4;
			position: absolute;
			top: auto;
		  bottom: 0.1rem;
		  right: 0.1rem;
		  z-index: 999;
		}
		.btn-setting:hover {
			filter:brightness(1.5);
		}
		.x,
		.full-screen,
		.setting {
			display: none;
			background-size: contain;
			position: absolute;
		  width: 18px;
		  height: 18px;
		  top: 10px;
		  padding: 0;
		  margin: 0;
		  border-radius: 0;
		  // transition: transform .5s ease;
		  z-index: 200;
		  color: #00bcd4;
      // transform-origin:center center;
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
		.setting {
			width: 30px;
			height: 30px;
			display: block;
			top: auto;
		  bottom: 0.1rem;
		  right: 0.1rem;
		}
		.x:hover,
		.full-screen:hover,
		.setting:hover  {
      filter:brightness(1.2);
			// transform: rotate(360deg);
		}

		.box-content {
			height: calc(100% - 45px);
			overflow: hidden;
		}
		.box-content.full-height {
			height: 100%;
		}


  }

  .box-card .select-bar {
			margin: 10px 0;
		}

  .box-card:hover {
		.x, .full-screen, .setting {
			display: block;
		}
	}

	@media screen and (max-height: 768px){
    .box-card .select-bar {
			margin: 5px 0 5px 0;
		}
  }

</style>