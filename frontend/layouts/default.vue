<template>
  <div>
    <nav class="navbar header has-shadow" role="navigation" aria-label="main navigation">
      <template>
        <b-navbar
          :mobile-burger="true">
          <template slot="start">
            <template slot="burger"></template>
            <b-navbar-item 
            v-for="(page, index) of $store.state.pages" 
            :key="`page_${index}`"
            tag="router-link" 
            exact-active-class="is-active"
            :to="{ path: page.slug || '/' }">
                {{ page.title }}
            </b-navbar-item>
          </template>
        </b-navbar>
      </template>
    </nav>

    <section class="main-content columns">

      <div class="container column is-10">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {

    data() {
      return {
      }
    },
  }
</script>