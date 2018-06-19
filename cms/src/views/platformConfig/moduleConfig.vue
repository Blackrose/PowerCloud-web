<template>
	<el-container>
		<el-alert v-if="!allowed.list"
      title="Sorry，您没有权限访问该模块T_T"
      type="warning"
      center
      show-icon
      :closable="false">
    </el-alert>
	  <el-main v-else-if="data.config.length">
	  	<el-row>
				<el-col :span="18" :offset="3">
					<el-form  ref="myForm" label-width="0px" :model="data">
				  	<ul class="rule-list">
					  	<li v-for="(item, index) in data.config" :key="item.id">
					  		<el-card>
					  			<div slot="header" class="list-title">
					  				<span>区域 {{index+1}}</span>
						  			<el-switch
						  			  v-model="item.ishidden"
										  :active-value="0"
										  :inactive-value="1"
										  active-color="#13ce66"
										  inactive-text="是否显示"
										  active-value="0"
	    								inactive-value="1">
										</el-switch>
									</div>
									<template v-if="item.ishidden === '0'">
										<el-row class="list-rule-item" >
											<el-col :span="3" >功能模块：</el-col>
											<el-select :style="{minWidth:'300px'}" v-model="item.functionid" placeholder="请选择">
												<el-option
													v-for="obj in functions"
													:key="obj.functionname"
													:label="obj.functiondescription"
													:value="obj.id">
												</el-option>
											</el-select>
										</el-row>
										<el-row class="list-rule-item" v-if="getFunctionName(item.functionid) != 'map'">
											<el-col  :span="3" >参数:</el-col>
												<el-cascader
													:style="{minWidth:'300px'}"
													:options="generateOptions(getFunctionName(item.functionid))"
													v-model="selectedOptions[index]"
													@change="handleChange">
												</el-cascader>
											</el-row>
									</template>
					  		</el-card>
					  	</li>
				  	</ul>
				  	</el-form>
				</el-col>
			</el-row>
			<p align="center" style="position:relative;z-index:100">
				<el-button v-if="allowed.update" type="primary" @click="onSubmit">保存配置</el-button>
			</p>
	  </el-main>
	</el-container>
</template>



<script type="text/javascript">

import {setMonitorConfig,getMonitorConfig,getMontinorSelectOptions,getMonitorfunctions} from '@/api/api';

import { mapGetters } from 'vuex'

export default {
	data() {
    return {
			data: {config:[]},
			options: [],
			//选择企业 变电站的级联列表
			selectedOptions:[[],[],[],[],[],[]],
			// //二级级联
   //    options1:[],
   //    //三级级联  视频
   //    options2:[],
   //    //三级级联  变压器
   //    options3:[],
      //目前所拥有的模块
      functions:[],
      //当前模块的权限
      allowed: {
        list: false,
        add: false,
        update: false,
        del: false
      }
		}
	},
	computed: {
		...mapGetters([
      'permissions'
    ])
	},
	created() {
		if(Array.isArray(this.permissions)) {
      this.permissions.forEach( (permission,i) => {
        if(permission.functionname == "monitorConfig") {
          this.allowed.list = permission.selectfunction == 0
          this.allowed.add = permission.addfunction == 0
          this.allowed.update = permission.updatefunction == 0
          this.allowed.del = permission.deletefunction == 0
          return
        }
      })
    }

    console.log(this.allowed.update)

		Promise.all([getMonitorfunctions(), getMontinorSelectOptions(), getMonitorConfig(), ]).then(resArr => {
				//生成功能选择列表
				this.functions = resArr[0].data.items;

				//生成级联列表
	    	this.options=resArr[1].data;

				//返回一个数组列表，每个函数为数组中的一项
				if(Array.isArray(resArr[2].data.config)) {
					resArr[2].data.config.forEach( (item,i) => {
						this.data.config.push(item);
						if(item.paramvalue){
				    	let p = JSON.parse(item.paramvalue);
				    	let changeid = p.companyid
				    	let eleid = p.electricitysubstationid
				    	this.selectedOptions[i] = [changeid,eleid];

				    	if(this.getFunctionName(item.functionid) == "video") {
				    		this.selectedOptions[i].push(p.videoid);
				    	}
				    	else if(this.getFunctionName(item.functionid) == "transformer") {
				    		this.selectedOptions[i].push(p.transformerid);
				    	}
			    	}
			    	// item.functionname = this.getFunctionName(item.functionid);
					})
				}

				console.log(this.data.config)

		})
		.catch((reason)=>{
	    console.log("reject "+reason);
		});

	},
	methods: {
		getFunctionName (functionid) {
			let name = null;
			this.functions.forEach( o => {
				if(o.id == functionid) {
					name = o.functionname;
					return
				}
			})
			return name;
		},
		//生成二级级联选项
		generateOptions (type) {
  		let options = [];
  		//一级目录
  		this.options.forEach( (o, i) => {
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
    				else if(type == "transformer") {
    					station.children = [];
    					//如果该变电站下有视频
    					if(_o.children.transformer && (_o.children.transformer).length) {
    						//三级目录
    						_o.children.transformer.forEach( (__o, __i) => {
    							let transformer = {};
		      				transformer.value = __o.id;
		      				transformer.label = __o.name || "编号"+__o.num;
		      				station.children.push(transformer);
    						})
    					}
    				}
    				else if(type == "chart") {
    					station.children = [];
    					//如果该变电站下有回路
    					if(_o.children.circuit && (_o.children.circuit).length) {
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
		handleChange (value) {
			//将获取到的数据存入config中的paramvalue中
			this.data.config.forEach( (item, i) => {
				if(item.paramvalue) {
					let p = {};
					p.companyid = this.selectedOptions[i][0];
					p.electricitysubstationid = this.selectedOptions[i][1];
					if(this.getFunctionName(item.functionid) == "video") {
						p.videoid = this.selectedOptions[i][2];
					}
					/*else if(item.functionname == "transformer") {
						p.transformerid = this.selectedOptions[i][2];
					}*/
					item.paramvalue = JSON.stringify(p);
				}
			})

		},
		onSubmit () {
			//重新改变一下 functionname 似的与 functionid 对应上
			this.data.config.forEach( (o,i) => {
				o.functionname = this.getFunctionName(o.functionid);
			})
			let param = {
				type: "config",
				data: this.data.config
			}
			setMonitorConfig(param).then( res => {
				if(res.ok) {
					this.$notify({
            title: '成功',
            message: '配置成功',
            type: 'success',
            duration: 2000
          })
				}
				else {
					this.$notify({
            title: '失败',
            message: res.data,
            type: 'error',
            duration: 2000
          })
				}
			})
		},
	}
}
</script>


<style lang="scss" scoped>
	.el-container {
		padding: 20px;
	}

	ul {
		list-style: none;
		margin-left: 0;
		padding-left: 0;
	}
	.rule-list {
		li {
			margin: 0 0 30px 0;
		}
	}
	.el-form-item {
		margin-bottom: 0;
	}
	.list-title {
    font-size: 18px;
    color: #409EFF;
    font-weight: bold;
		align-items: center;
		display: flex;
		justify-content: space-between;
	}

	.list-rule-item {
		display: flex;
		align-items: center;
		font-size: 14px;
    color: #606266;
    font-weight: bold;
    line-height: 40px;
	}

	.align-center {
		text-align: center;
	}
	.el-row {
		margin-bottom: 20px;
	}
</style>
