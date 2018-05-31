<template>
	<div class="box-card">
		<a href="javascript:void(0)" class="btn x"></a>
	  <div class="box-header">
	  	<div class="title-wrapper"><p class="title"><i :class="titleIcon"></i>{{title}}</p></div>


	    <!-- <el-button style="float: right; padding: 3px 0" type="text">X</el-button> -->
	  </div>
	  <div class="box-content">
	  	<slot></slot>
	  </div>
	</div>
</template>

<script type="text/javascript">

	// import img_x from '@/views/monitor/assets/x.png'

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
	    }
		},
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box-card {
  	background: hsla(0,0%,100%,.2);
    color: #fff;
    border: 1px solid #f1c40f;
    border-radius: 5px;
    height: 100%;
    padding: 0.1rem;
    position: relative;

    .box-header {
	  	border: none;
	  	padding: 0;
	  	position: relative;
	  	z-index: 100;
	  }
  }
  .title-wrapper {
  	text-align: left;
  }
  .title {
  	display: inline-block;
  	text-align: left;
	  font-size: 0.08rem;
	  // font-weight: bold;
	  margin: 0px 0;
	  margin-left: -0.1rem;
	  padding: 0.04rem 0.106667rem 0.04rem 0.106667rem;
	  background: #00bcd4;
	  // width: 198px;

	  i {
	  	margin-right: 5px;
	  }
	}

	.x {
		background: url(../assets/x.png);
		background-size: contain;
		position: absolute;
	  right: 0.08rem;
	  top: 0.08rem;
	  width: 18px;
	  height: 18px;
	  padding: 0;
	  margin: 0;
	  border-radius: 0;
	  transition: transform .5s ease;
	  z-index: 200;
	}

	.box-content {
		margin-top: 0.066667rem;
	}

</style>