import { getSelectOptions } from '@/api/api_monitor'

const monitor = {
	state: {
		//模块全屏的index：默认情况下，6个都不是全屏
		fullScreenIndex: -1,
		//级联选项
		selectOptions: [],
	},
	mutations: {
		SET_FULL_SCREEN_INDEX: (state, index) => {
			state.fullScreenIndex = index
		},
		SET_SELECT_OPTIONS: (state, options) => {
      state.selectOptions = options
    },
	},
	actions: {
		setMonitorFullScreenIndex: ({ commit }, index) => {
      commit('SET_FULL_SCREEN_INDEX', index)
    },
    setMonitorSelectOptions: ({ commit }) => {
    	return new Promise((resolve, reject) => {
        getSelectOptions().then(response => {
          commit('SET_SELECT_OPTIONS', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })

    },
	}
}

export default monitor