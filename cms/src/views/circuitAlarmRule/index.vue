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
    display: flex;
		align-items: center;
	}

	.list-rule-item {
		display: flex;
		align-items: center;
		font-size: 14px;
    color: #606266;
    font-weight: bold;
    line-height: 40px;
	}
	.btn {
		padding: 10px;
	}

	.el-row {
		margin-bottom: 20px;
	}


</style>
<template>
	<el-container>
	  <el-header class="header"><i class="el-icon-edit-outline"></i>{{isView ? "回路告警规则" : "回路告警规则配置"}}</el-header>
	  <el-main style="margin-top:30px;"  v-loading="isLoading">
	  	<el-row v-if="!isView">
	  		<el-col :span="18" :offset="3">
	  			<el-button style="margin-bottom:20px" class="btn" type="primary" icon="el-icon-plus" @click="onAddRule()">添加规则</el-button>
	  		</el-col>
	  	</el-row>
	  	<el-row>
				<el-col :span="18" :offset="3">
					<el-form  :rules="validRules" ref="myForm" label-width="0px" :model="config[0]">
			  	<ul class="rule-list">
			  		<li v-for="(item, index) in config">
			  			<el-row class="list-rule-item">
			  				<el-col :span="3" class="list-title">
				  					规则{{index+1}}:
				  			</el-col>
				  			<el-col :span="3" v-if="!isView">
				  				<el-button class="btn" type="danger" plain icon="el-icon-delete" @click="onDeleteRule(index)">删除规则</el-button>
				  			</el-col>
			  			</el-row>
			  			<el-row class="list-rule-item" >
			  				<el-col :span="3" >告警提示：</el-col>
								<el-col :span="10" >
									<el-form-item prop="tip">
										<el-input v-model="item.tip" placeholder="请输入告警提示"></el-input>
									</el-form-item>
								</el-col>
			  			</el-row>
		  				<el-row class="list-rule-item">
		  					<el-col :span="3" >配置条件：</el-col>
				  			<el-col :span="5" class="list-rule-item" v-for="(_item, _index) in item.ruleArr">
				  				<el-tag v-if="_index > 0">and</el-tag>
				  				<el-form-item prop="key">
					  				<el-select v-model="_item.key" placeholder="参数">
								      <el-option label="Ia" value="Ia"></el-option>
								      <el-option label="Ib" value="Ib"></el-option>
								      <el-option label="Ic" value="Ic"></el-option>
								      <el-option label="Ua" value="Ua"></el-option>
								      <el-option label="Ub" value="Ub"></el-option>
								      <el-option label="Uc" value="Uc"></el-option>
								    </el-select>
								  </el-form-item>
							    &nbsp;
							    <el-form-item prop="condition">
					  				<el-select v-model="_item.value" placeholder="条件">
								      <el-option label="= 0" value="eq_0"></el-option>
								      <el-option label="≠ 0" value="neq_0"></el-option>
								    </el-select>
								  </el-form-item>
						    </el-col>

						    <el-col :span="1">&nbsp;</el-col>
						    <el-col :span="3" v-if="!isView">
						    	<el-button class="btn" type="primary" plain icon="el-icon-plus" circle @click="onAdd(index, _index)"></el-button>
									<el-button class="btn" type="danger" plain icon="el-icon-delete" circle  @click="onDelete(index, _index)"></el-button>
						    </el-col>
						  </el-row>


			  		</li>
			  		<li>
			  			<el-form :rules="validRules" ref="powerForm" :model="powerConfig">
				  			<el-row>
				  				<el-col class="list-title">
					  					功率条件:&nbsp;
					  			</el-col>
				  			</el-row>
				  			<el-row class="list-rule-item" >
				  				<el-col :span="3" >告警提示：</el-col>
									<el-col :span="10" >
										<el-form-item prop="tip">
											<el-input v-model="powerConfig.tip" placeholder="请输入告警提示"></el-input>
										</el-form-item>
									</el-col>
				  			</el-row>
				  			<el-row class="list-rule-item">
				  				<el-col :span="3" >功率: </el-col>
				  				<el-col :span="21">
				  						<el-form-item class="list-rule-item">
											  <el-col :span="15" class="list-rule-item">
											    <el-select v-model="powerConfig.condition">
											      <el-option label="大于" value="gt"></el-option>
											      <el-option label="大于等于" value="geq"></el-option>
											      <el-option label="等于" value="eq"></el-option>
											      <el-option label="小于等于" value="leq"></el-option>
											      <el-option label="小于" value="lt"></el-option>
											    </el-select>
											    &nbsp;&nbsp;&nbsp;
		 											<el-input prop="power" v-model.number="powerConfig.value" placeholder="百分比"></el-input>
										    </el-col>
										    <el-col :span="1">&nbsp;%</el-col>

											</el-form-item>


				  				</el-col>
				  			</el-row>
			  			</el-form>
			  		</li>
			  	</ul>
			  	</el-form>
				</el-col>
			</el-row>

			<p align="center" style="position:relative;z-index:100" v-if="!isView">
				<el-button type="primary" @click="onSubmit" plain>确定</el-button>
				<el-button type="info" plain @click="onClear">重置</el-button>
			</p>


	  </el-main>
	</el-container>
</template>

<script type="text/javascript">

let winParent
let key

export default {
	name: 'circuitAlarmRule',
	data() {
		return {
			//是否只查看数据，不编辑数据（从列表点进来时，只是查看数据，不编辑）
			isView: true,
			//是否正在加载中，监听message传递
			isLoading: true,
			//普通规则的配置
			config: [
				{
					tip: "",
					ruleStr: "",
					ruleArr: [{  //每个规则中的条件组成的数组，条件间为“且”关系
						key: "Ia",
						value: "eq_0"
					}]
				}
			],
			//功率条件的配置
			powerConfig: {
				tip: "功率过低",
				condition: "leq",
				value: "85"
			},
			//表单验证
			validRules: {
				tip: [{ required: true, message: '请输入告警提示', trigger: 'blur' }],
				power: [{ required: true, type: 'number', message: '必须为数字', trigger: 'blur' }],
			},
		}
	},
	created() {
		let _self = this;

		this.isView = (this.$route.query.type === "view");

		//监听父窗口的消息
		window.addEventListener("message", function(event) {
			if(event.data && event.data.title == "powerCloudCMS-message-alarmRule") {
				winParent = event.source
				key = event.data.key

				//解析传来的数据
				if(event.data.str) {
					try {
						let currentConfig = JSON.parse(event.data.str);
						//规则格式样例：
						/*[
							{
								tip: "告警1",
								rule: "Ia_eq_0|Ib_neq_0"
							},
							{
								tip: "告警2",
								rule:"Ua_eq_0|Ub_neq_0"
							},
							{
								ruleStr: "power_leq_85"
								tip: "功率过低"
							}
						]*/
						//解析功率的配置,config的最后一个是功率配置
						let currentPowserConfig = currentConfig.pop();
						_self.powerConfig = {
							tip: currentPowserConfig.tip,
							condition: currentPowserConfig.ruleStr.split("_")[1],
							value: currentPowserConfig.ruleStr.split("_")[2]
						}

						//解析其他规则配置
						currentConfig.forEach( (o, i) => {
							let obj = {
								tip: o.tip,
								ruleStr: o.ruleStr,
								ruleArr: []
							}
							//将字符串解析成数组
							let _ruleArr = o.ruleStr.split("|");
							_ruleArr.forEach( (_o, _i) => {
								obj.ruleArr.push({
									key: _o.split("_")[0],
									value:  _o.split("_")[1]+"_"+_o.split("_")[2]
								})
							})

							_self.$set(_self.config, i, obj)

						})
					} catch(e) {
						alert("数据解析错误："+e)
					}
				}
				_self.isLoading = false;
			}
		}, false)
	},
	methods: {
		onAddRule() {
			this.config.push({
				tip: "",
				ruleStr: "",
				ruleArr: [{  //每个规则中的条件组成的数组，条件间为“且”关系
					key: "Ia",
					value: "eq_0"
				}]
			})
		},
		onDeleteRule(index) {
			if(this.config.length == 1) {
				this.config = [{
					tip: "",
					ruleStr: "",
					ruleArr: [{  //每个规则中的条件组成的数组，条件间为“且”关系
						key: "Ia",
						value: "eq_0"
					}]
				}]
			}
			else {
				this.config.splice(index, 1)
			}
		},
		onAdd(index, _index) {
			this.config[index].ruleArr.push({
				key: "Ia",
				value: "eq_0"
			})
		},
		onDelete(index, _index) {
			if(this.config[index].ruleArr.length == 1) {
				this.config[index].ruleArr = [{
					key: "Ia",
					value: "eq_0"
				}]
			}
			else {
				this.config[index].ruleArr.splice(_index, 1)
			}
		},
		onSubmit() {
			this.$refs["myForm"].validate((valid1) => {
				if(!valid1) { return }
				this.$refs["powerForm"].validate((valid) => {
	        if (valid) {
	          this.config.forEach( (o, index) => {
							if(Array.isArray(o.ruleArr)) {
								let arr = []
								o.ruleArr.forEach( (_o, _i) => {
									let str = _o.key+ "_" + _o.value
									arr.push(str)
								})
								o.ruleStr = arr.join("|")
							}
						})

						let power = {};
						power.tip = this.powerConfig.tip;
						power.ruleStr = "power_" + [this.powerConfig.condition, this.powerConfig.value].join("_");

						let submitConfig = []
						this.config.forEach( (o, i) => {
							submitConfig.push({
								tip: o.tip,
								ruleStr: o.ruleStr
							})
						})
						submitConfig.push(power)
						// console.log(submitConfig)

						if (winParent) {
					    winParent.postMessage({title:"powerCloudCMS-message-alarmRule", key:key, str:JSON.stringify(submitConfig)}, '*')
					    window.close()
					  }


	        } else {
	          console.log('error submit!!');
	          return false;
	        }
	      });
			});
		},
		onClear() {
			this.config = [
				{
					tip: "",
					ruleStr: "",
					ruleArr: [{  //每个规则中的条件组成的数组，条件间为“且”关系
						key: "Ia",
						value: "eq_0"
					}]
				}
			]
			this.powerConfig = {
				tip: "功率过低",
				condition: "leq",
				value: "85"
			}
		}
	}
}
</script>
