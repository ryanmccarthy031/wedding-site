import axios from 'axios'

export const state = () => ({
    pages: [],
    text: {},
})

export const getters = {}

export const mutations = {
    add (state, { entity, data }) {
        if (Array.isArray(data)) state[entity] = [...data]
        else if (typeof data === 'object' && data !== null) state[entity] = { ...data }
        else state[entity] = data
    },
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { req }) {
    const { data } = await axios.get(`${process.env.baseUrl}/framework`)
    // TODO: I need to figure out how to make a page viewable only either to some users or with a token
    // TODO: I need some error handling here

    const pages = await dispatch('keyObj', { array: data.pages.filter(page=>page.is_included), key: 'slug' })
    await commit('add', { entity: 'pages', data: pages })
  },
  keyObj ({commit}, { array, key }) {
    const obj = {}
    for (let i=0; i<array.length; i++) {
      obj[array[i][key]] = array[i]
      delete obj[array[i][key]][key]
    }
    return obj
  }
}