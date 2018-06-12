<template>
  <scroll-bar>
    <el-menu mode="vertical"  :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
      <router-link v-if="permission_monitorScreen" to="/monitorScreen" key="monitorScreen"  target="_blank">
        <el-menu-item index="/monitorScreen">
          <svg-icon icon-class="computer"></svg-icon>
          <span>大屏监控平台</span>
        </el-menu-item>
      </router-link>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar',
      'permissions'
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
    },
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
