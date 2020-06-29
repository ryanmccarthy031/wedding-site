import axios from 'axios'

export const state = () => ({
    pages: [],
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
  async nuxtServerInit ({ commit }, { req }) {
    const { data } = await axios.get(`${process.env.baseUrl}/pages`)
    // TODO: I need to figure out how to temporarily exclude a page, and how to make a page
    // viewable only either to some users or with a token
    const pageList = data.sort((a,b) => a.order - b.order).filter(page=>page.is_included)
    // TODO: I need some error handling here
    await commit('add', { entity: 'pages', data: pageList })
  },
}