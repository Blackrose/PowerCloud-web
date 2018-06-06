<template>
	<div class="box-card">
		<a href="javascript:void(0)" class="btn x" @click="close()">
			<svg-icon icon-class="x"></svg-icon>
		</a>
		<a href="javascript:void(0)" class="btn full-screen" @click="fullScreen()">
			<svg-icon icon-class="full_screen"></svg-icon>
		</a>
	  <div class="box-header">
	  	<div class="title-wrapper"><p class="title"><i :class="titleIcon"></i>{{title}}</p></div>
	  </div>
	  <!-- 上面的级联选择框 -->
  	<el-row class="select-bar" v-if="paramValue">
  		<el-col>
			<!-- <el-col :span="type == 'sysGraph' ? 18 : 6"> -->
				<el-cascader class="my-select"
			    size="mini"
			    :show-all-levels="false"
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
			// console.log(this.paramValue)
			//这个参数，证明有级联选项
			if(this.paramValue) {
				this.options = this.generateOptions(this.type);
	    	//变电站的的ID,从config里的paramValue参数中解析获取
				let param = JSON.parse(this.paramValue);
				this.selectedOptions =  [param.companyid, param.electricitySubstationid];
				if(this.type == "video") {
					this.selectedOptions.push(+param.videoid)
					// this.updateDynamicOptions(this.selectedOptions)
				}
			}

		},
		methods: {
			//生成二级级联选项
			generateOptions (type) {
    		let options = [];
    		this.selectOption.forEach( (o, i) => {
    			let company = {};
    			company.value = o.id;
    			company.label = o.company;
    			company.children = [];
    			if(o.children) {
    				o.children.forEach( (_o, _i) => {
      				let station = {};
      				station.value = _o.id;
      				station.label = _o.substation;
      				company.children.push(station);
      				//三级目录！
      				if(type == "video") {
      					station.children = [];
      					if(_o.children.video) {
      						console.log("***********")
      						_o.children.video.forEach( (__o, __i) => {
      							let video = {};
			      				video.value = __o.id;
			      				video.label = __o.id;
			      				station.children.push(video);
      						})
      					}
      				}
      			})
    			}
    			options.push(company)
    		})
    		return options;
			},
			/*//只有需要动态加载的 级联选择器，才会响应
			handleItemChange (val) {
				if(val.length < 2) return
				// console.log('active item:', val);
				// console.log(this.options)
				this.updateDynamicOptions(val);

			},
			updateDynamicOptions (val) {
				let index1,index2;
				this.options.forEach( (o, i) => {
					if(o.value == val[0]) {
						index1 = i;
						o.children.forEach( (_o, _i) => {
							if(_o.value == val[1]) {
								index2 = _i
								return;
							}
						})
					}
				})
				// console.log(this.options)
				// console.log(index1,index2)
				if (!this.options[index1].children[index2].children.length) {

					let param = {
						page: 1,
						limit: 100000,
						search: {"electricitysubstationid":val[1]}
					}
					fetchList(this.type == "video" ? "electricitySubstation_video" : "electricitySubstation_video", param).then( res => {
						let items = res.data.items;
						if(items && items.length) {
							this.options[index1].children[index2].children = [];
							items.forEach( (item, i) => {
								this.options[index1].children[index2].children.push({
									value: item.id,
									label: item.id
								})
							})
						}

					})

        }
			},*/
			selectBarChange (v) {
				this.$emit('box-select-bar-change', v)
			},
			close () {
				console.log("close");
				this.$emit('box-close', '我是子元素传过来的')
			},
			fullScreen () {
				console.log("fullScreen");
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
    padding: 0.1rem;
    position: relative;
    margin-bottom: 0.1rem;

    .box-header {
	  	/* border: none;
	  	padding: 0;
	  	position: absolute;
	  	z-index: 100; */
	  	border: none;
	    padding: 0;
	    position: absolute;
	    z-index: 100;
	    top: 0;
	    transform: translateY(-100%);
	    left: 0.1rem;
	  }
  }
  .title-wrapper {
  	text-align: left;

  }
  .title {
  	display: inline-block;
    text-align: left;
    /* height: 0.2rem; */
    /* line-height: 0.2rem; */
    font-size: 0.08rem;
    margin: 0;
    margin-left: -0.1rem;
    padding: 0.04rem 0.1rem;
    background: #00bcd4;
    border-radius: 5px 5px 0 0;

	  i {
	  	margin-right: 5px;
	  }
	}

	.x {
		display: none;
		// background: url(../assets/x.png);
		background-size: contain;
		position: absolute;
	  right: 0.08rem;
	  top: 0.1rem;
	  width: 18px;
	  height: 18px;
	  padding: 0;
	  margin: 0;
	  border-radius: 0;
	  transition: transform .5s ease;
	  z-index: 200;
	}
	.full-screen {
		display: none;
		background-size: contain;
		position: absolute;
	  right: 0.3rem;
	  top: 0.1rem;
	  width: 18px;
	  height: 18px;
	  padding: 0;
	  margin: 0;
	  border-radius: 0;
	  transition: transform .5s ease;
	  z-index: 200;
	}
	.box-card:hover {
		.x, .full-screen {
			display: block;
		}
	}

	.box-content {
		height: 90%;
		// overflow-y: scroll;
		// margin-top: 0.066667rem;
	}

	.select-bar {
		margin: 0px 0 10px 0;
	}

</style>