<style lang="scss" scoped>
	.header {
		font-size: 20px;
    line-height: 60px;
    background: #304156;
    color: #fff;
    i {
    	margin-right: 15px;
    }
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

	.rule-key {
		font-family: '宋体';
		padding: 0 10px 0 0;
	}
	.btn {
		padding: 10px;
	}

	.align-center {
		text-align: center;
	}
	.el-row {
		margin-bottom: 20px;
	}


</style>


<template>
	<el-container>
	  <el-main style="margin-top:30px;" >
	  	<el-row>
			<el-col :span="18" :offset="3">
				<el-form  ref="myForm" label-width="0px" :model="data">
			  	<ul class="rule-list">
				  	<li v-for="(item, index) in data.config" :key="item.id"> 
				  		<el-card>
				  			<div slot="header" class="list-title">
				  				<span>模块{{index+1}}</span>
					  			<el-switch 
					  			  v-model="item.ishidden"
								  :active-value="0"
								  :inactive-value="1"
								  active-color="#13ce66"
								  inactive-color="#ff4949"
								  inactive-text="是否隐藏">
								</el-switch>
							</div>

							<el-row class="list-rule-item" >
								<template v-if="!parseInt(item.ishidden)">
									<el-col :span="3" >请选择：</el-col>
									<el-select v-model="item.functionname" placeholder="请选择">
										<el-option
											v-for="obj in functions"
											:key="obj.functionname"
											:label="obj.functionname"
											:value="obj.functionname">
										</el-option> 
									</el-select>
									<el-cascader 
											expand-trigger="hover" 
											:options="item.functionName!=='video'?options1:options2" 
											v-model="selectedOptions[index]" 
											@change="handleChange">
									</el-cascader>
								</template>
							</el-row>	
				  		</el-card>			
				  	</li>
			  	</ul>
			  	</el-form>
			</el-col>
		</el-row>
		<p align="center" style="position:relative;z-index:100" v-if="!isView">
			<el-button type="primary" @click="onSubmit" plain>确定</el-button>
		</p>
	  </el-main>
	</el-container>
</template>



<script type="text/javascript">

import {setMonitorConfig,getMonitorConfig,getMontinorSelectOptions,getMonitorfunctions} from '@/api/api';


export default {
	data() {
    return {
			isView: true,
			
			data: {config:[]},
			options: [], 
			selectedOptions:[[],[],[],[],[],[]],
	        options1:[],
	        options2:[],

	        functions:[],
			}
	},
	created() {
		let _self = this;

		this.isView = (this.$route.query.type === "view");


		Promise.all([getMonitorConfig(),getMontinorSelectOptions(),getMonitorfunctions()]).then((res)=>{
			//返回一个数组列表，每个函数为数组中的一项
			this.data.config=res[0].data.config;
		    //遍历config 
	        this.data.config.forEach( (item, i) => {
		        if(item.paramvalue){
		    	let p = JSON.parse(item.paramvalue);
		    	let changeid = p.compayid
		    	let eleid = p.electricitysubstationid
		    	this.selectedOptions[i] = [changeid,eleid];
		    	}
	        })

	    	//1
	    	this.options=res[1].data;
			this.options1 = this.generateOptions();//调用函数通过this
	        this.options2 = this.generateOptions("video");

	        //2
	        this.functions=res[2].data.items;
		})
		.catch((reason)=>{
	        console.log("reject "+reason);
		});

	},
	methods: {
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
    				})
    				options.push(company);
    			}
    		})
    		return options;
			},
		handleChange(value){
			//将获取到的数据存入config中的paramvalue中
			
			let options3=this.selectedOptions;
			
           this.data.config.forEach( (item, i) => {
        	let p = JSON.parse(item.paramvalue);
        	p.compayid=this.selectedOptions[i][0];
        	p.electricitysubstationid=this.selectedOptions[i][1];

        	item.paramvalue = JSON.stringify(p) ;
           })

		},
		onSubmit(){
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