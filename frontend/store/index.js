import axios from 'axios'

export const state = () => ({
    pages: [],
    names: [],
    currentGuest: {},
    songs: [],
    carouselPhotos: [],
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

    // TODO: I need some error handling here
    const pages = await dispatch('keyObj', { array: data.pages.filter(page=>page.is_included), key: 'slug' })
    await commit('add', { entity: 'pages', data: pages })

    const names = data.host_names.map(name=>name.person_name)
    await commit('add', { entity: 'names', data: names })

    const results = await axios.get(`${process.env.baseUrl}/carousel-photos`)
    await commit('add', { entity: 'carouselPhotos', data: results.data.photos.map(photo=>{
      return {
        alternativeText: photo.alternativeText,
        url: photo.url,
      }
    })})
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