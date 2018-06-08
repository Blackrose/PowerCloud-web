<template>
  <scroll-bar>
    <el-menu mode="vertical"  :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="routes"></sidebar-item>
      <router-link to="/Monitor" key="Monitor"  target="_blank">
        <el-menu-item index="/Monitor">
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
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
