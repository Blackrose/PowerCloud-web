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
	  <el-header class="header"><i class="el-icon-edit-outline"></i>{{isView ? "回路告警规则" : "回路告警规则配置"}}</el-header>
	  <el-main style="margin-top:30px;"  v-loading="isLoading">
	  	<el-row v-if="!isView">
	  		<el-col :span="18" :offset="3">
	  			<el-button style="margin-bottom:20px" class="btn" type="primary" icon="el-icon-plus" @click="onAddRule()">添加规则</el-button>
	  		</el-col>
	  	</el-row>
	  	<el-row>
				<el-col :span="18" :offset="3">
					<el-form  :rules="validRules" ref="myForm" label-width="0px" :model="data">
			  	<ul class="rule-list">
			  		<li v-for="(item, index) in data.config">
			  			<el-row class="list-rule-item">
			  				<el-col :span="3" class="list-title">
				  					规则{{index+1}}:
				  			</el-col>
				  			<el-col :span="3">
				  				<el-form-item prop="type">
					  				<el-select v-model="item.type" placeholder="参数">
								      <el-option label="电流" value="I"></el-option>
								      <el-option label="电压" value="V"></el-option>
								    </el-select>
								  </el-form-item>
				  			</el-col>
				  			<el-col :span="1"></el-col>
				  			<el-col :span="3" v-if="!isView">
				  				<el-button class="btn" type="danger" plain icon="el-icon-delete" @click="onDeleteRule(index)">删除规则</el-button>
				  			</el-col>
			  			</el-row>
			  			<el-row class="list-rule-item" >
			  				<el-col :span="3" >告警提示：</el-col>
								<el-col :span="10" >
									<el-form-item :prop="'config.'+index+'.tip'" :rules="{required: true, message: '告警提示不能为空', trigger: 'blur'}">
										<el-input v-model="item.tip" placeholder="请输入告警提示"></el-input>
									</el-form-item>
								</el-col>
			  			</el-row>
			  			<!-- 电流 -->
		  				<el-row v-if="item.type == 'I'" class="list-rule-item">
		  					<el-col :span="3" >配置条件：</el-col>
		  					<template class="list-rule-item" v-for="(_item, _index) in ['Ia','Ib', 'Ic']">
		  						<el-col :span="2" class="align-center" v-if="_index > 0"><el-tag>and</el-tag></el-col>
		  						<el-col :span="4" class="list-rule-item" >
			  						<span class="rule-key">{{_item}}</span>
			  						<el-form-item prop="condition">
						  				<el-select v-model="item.ruleArr[_index]" placeholder="条件">
									      <el-option label="= 0" value="0"></el-option>
									      <el-option label="≠ 0" value="1"></el-option>
									    </el-select>
									  </el-form-item>
									 </el-col>
		  					</template>
		  				</el-row>
		  				<!-- 电压 -->
	  					<el-row v-else-if="item.type == 'V'" class="list-rule-item">
	  						<el-col :span="3" >配置条件：</el-col>
		  					<template class="list-rule-item" v-for="(_item, _index) in ['Ua','Ub', 'Uc']">
		  						<el-col :span="2" class="align-center" v-if="_index > 0"><el-tag>and</el-tag></el-col>
		  						<el-col :span="4" class="list-rule-item" >
			  						<span class="rule-key">{{_item}}</span>
			  						<el-form-item prop="condition">
						  				<el-select v-model="item.ruleArr[_index]" placeholder="条件">
									      <el-option label="= 0" value="0"></el-option>
									      <el-option label="≠ 0" value="1"></el-option>
									    </el-select>
									  </el-form-item>
									 </el-col>
		  					</template>
		  				</el-row>
			  		</li>
			  		<li>
			  			<el-form :rules="validRules" ref="powerForm" :model="data.powerConfig">
				  			<el-row>
				  				<el-col class="list-title">
					  					功率条件:&nbsp;
					  			</el-col>
				  			</el-row>
				  			<el-row class="list-rule-item" >
				  				<el-col :span="3" >告警提示：</el-col>
									<el-col :span="10" >
										<el-form-item prop="tip">
											<el-input v-model="data.powerConfig.tip" placeholder="请输入告警提示"></el-input>
										</el-form-item>
									</el-col>
				  			</el-row>
				  			<el-row class="list-rule-item">
				  				<el-col :span="3" >配置条件: </el-col>
				  				<el-col :span="21" class="list-rule-item">
				  					<span class="rule-key">功率&nbsp;≤&nbsp;</span>
										<el-col :span="3">
											<el-form-item prop="power">
												<el-input v-model.number="data.powerConfig.power" placeholder="百分比"></el-input>
											</el-form-item>
										</el-col>
		 								<el-col :span="1">&nbsp;%</el-col>
									    <!-- <el-select v-model="powerConfig.condition">
									      <el-option label="大于" value="gt"></el-option>
									      <el-option label="大于等于" value="geq"></el-option>
									      <el-option label="等于" value="eq"></el-option>
									      <el-option label="小于等于" value="leq"></el-option>
									      <el-option label="小于" value="lt"></el-option>
									    </el-select> -->
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
		let checkPower = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('不能为空'));
			}
			if (!Number.isInteger(value)) {
				callback(new Error('请输入数值'));
			}
			else {
				if (value > 100 || value < 0) {
					callback(new Error('请输入0-100的数值'));
				}
				else {
					callback();
				}
			}
		};
		return {
			//是否只查看数据，不编辑数据（从列表点进来时，只是查看数据，不编辑）
			isView: true,
			//是否正在加载中，监听message传递
			isLoading: true,
			//普通规则的配置
			data: {
				config: [
					{
						tip: "",
						type: "I", //电流=I、电压=V、功率=P
						ruleStr: "",
						ruleArr: ["0","0","0"] //每个规则中的条件组成的数组，条件间为“且”关系
					}
				],
				//功率条件的配置
				powerConfig: {
					tip: "功率过低",
					type: "P",
					power: 85,
					ruleStr: ""
				},
			},
			//表单验证
			validRules: {
				tip: [{ required: true, message: '告警提示不能为空', trigger: 'blur' }],
				power: [{ validator: checkPower, trigger: 'blur' }],
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
								{"tip":"电压报警","type":"V","ruleStr":"010"},
								{"tip":"电流报警","type":"I","ruleStr":"001"},
								{"tip":"功率过低","type":"P","ruleStr":"50"}
							]*/
						//解析功率的配置,config的最后一个是功率配置
						let currentPowserConfig = currentConfig.pop();
						_self.data.powerConfig = {
							tip: currentPowserConfig.tip,
							type: currentPowserConfig.type,
							ruleStr: currentPowserConfig.ruleStr,
							power: +currentPowserConfig.ruleStr,
						}

						//解析其他规则配置
						currentConfig.forEach( (o, i) => {
							let obj = {
								tip: o.tip,
								type: o.type,
								ruleStr: o.ruleStr,
								ruleArr: o.ruleStr.split("")
							}
							_self.$set(_self.data.config, i, obj)

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
			this.data.config.push({
				tip: "",
				type: "I", //电流=I、电压=V、功率=P
				ruleStr: "",
				ruleArr: ["0","0","0"] //每个规则中的条件组成的数组，条件间为“且”关系
			})
		},
		onDeleteRule(index) {
			if(this.data.config.length == 1) {
				this.data.config = [{
					tip: "",
					type: "I", //电流=I、电压=V、功率=P
					ruleStr: "",
					ruleArr: ["0","0","0"] //每个规则中的条件组成的数组，条件间为“且”关系
				}]
			}
			else {
				this.data.config.splice(index, 1)
			}
		},
		onSubmit() {
			this.$refs["myForm"].validate((valid1) => {
				if(!valid1) { return }
				this.$refs["powerForm"].validate((valid) => {
	        if (valid) {
	          this.data.config.forEach( (o, index) => {
							o.ruleStr = o.ruleArr.join("")
						})

						let power = {};
						power.tip = this.data.powerConfig.tip;
						power.type = this.data.powerConfig.type;
						power.ruleStr = ""+this.data.powerConfig.power;

						let submitConfig = []
						this.data.config.forEach( (o, i) => {
							submitConfig.push({
								tip: o.tip,
								type: o.type,
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
			this.data.config = [{
				tip: "",
				type: "I", //电流=I、电压=V、功率=P
				ruleStr: "",
				ruleArr: ["0","0","0"] //每个规则中的条件组成的数组，条件间为“且”关系
			}]
			this.data.powerConfig = {
				tip: "功率过低",
				type: "P",
				value: 85,
				ruleStr: ""
			}
		}
	}
}
</script>
