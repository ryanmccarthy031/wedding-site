<template>
  <section class="section">
    <h2>{{currentPage.title}}</h2>
    <div class="content columns is-mobile">
      <div class="text"
        v-for="(text, index) of currentPage.text">
          <div v-if="text.paragraph" v-html="$md.render(text.paragraph)"></div>
      </div>
    </div>
    <b-container
      v-if="this.places.length">
      <b-row>
        <b-col
          md="6">
          <div
            v-for="(place, index) of this.places">
            <h3>
                <component 
                  :is="place.website?'a':'span'" 
                  :href="place.website || ''" 
                  target="_blank">{{place.name}}
                </component>
            </h3>
            <p v-if="place.text">{{place.text}}</p>
            <p v-if="place.date_time">{{$moment(place.date_time).tz("America/Los_Angeles").format("D MMMM YYYY, h:mmA")}}</p>
            <p v-if="place.place_name">{{place.place_name}}</p>
            <Address
              class="address"
              v-if="place.address"
              :street-a="place.address.street1" 
              :street-b="place.address.street2" 
              :city="place.address.city"
              :state="place.address.state"
              :zip="place.address.zip_code"
              />
            <!--{{place}}<br /><br />-->
          </div>
        </b-col>
        <b-col
          md="6"
          v-if="hasCoords"
          class="column map">
          <Map 
            :places="this.currentPage.places"/>
        </b-col>
      </b-row>
    </b-container>
    <div
      v-if="currentPage.is_guest_management">
        <GuestQuestions v-if="$store.state.currentGuest.hasOwnProperty('name') && !$store.state.currentGuest.hasOwnProperty('is_coming')" />
        <GuestManager v-else-if="$store.state.currentGuest.hasOwnProperty('name')" />
        <GuestFinder v-else />

    </div>
  </section>
</template>

<script>
import Address from '~/components/Address'
import GuestFinder from '~/components/GuestFinder'
import GuestManager from '~/components/GuestManager'
import GuestQuestions from '~/components/GuestQuestions'
import Map from '~/components/Map'
import { mapState } from 'vuex'

export default {
  validate ({ params, store }) {
    if (Object.keys(store.state.pages).includes(params.slug) || typeof params.slug==='undefined') return true
    return false
  },
  computed: {
    ...mapState({
        currentPage (state) {
          return state.pages[this.slug]
        },
    }),
    slug () {
      return typeof this.$route.params.slug === 'undefined' ? 'home' : this.$route.params.slug
    },
    places () {
      return this.currentPage.places
    },
    hasCoords () {
      // If any of the places has longitude and latitude, we'll include a map.
      for (let i=0; i<this.places.length; i++) {
        if (this.places[i].latitude && this.places[i].longitude) return true
      }
      return false
    },
  },
  components: {
    Address,
    GuestFinder,
    GuestManager,
    GuestQuestions,
    Map,
  }
}
</script>
