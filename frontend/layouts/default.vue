<template>
  <div>
    <nav role="navigation" aria-label="main navigation">
      <b-navbar type="dark" variant="info">
        <!--<b-navbar-brand href="#">NavBar</b-navbar-brand>-->

        <b-button v-b-toggle.sidebar-backdrop>
           <b-icon icon="three-dots-vertical"></b-icon>
        </b-button>
        <b-sidebar 
          aria-label="sidebar navigation"
          id="sidebar-backdrop" 
          no-header
          backdrop 
          shadow>
            <b-button v-b-toggle.sidebar-backdrop>
              <b-icon icon="three-dots-vertical"></b-icon>
            </b-button>
            <b-nav-item 
              v-for="(page, slug) in pages" 
              :key="`page_${slug}`" 
              :to="slug==='home'? '/' : slug">
              {{ page.title }}
            </b-nav-item>
        </b-sidebar>

        <b-navbar-nav>
          <b-nav-item 
            v-for="(page, slug) in pages" 
            :key="`page_${slug}`" 
            :to="slug==='home'? '/' : slug">
            {{ page.title }}
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </nav>

    <section class="main-content columns">

      <div class="container column is-10">
        <nuxt />
      </div>
    </section>
  </div>
</template>
<script>
  import {
    mapState
  } from 'vuex'

  export default {
    computed: {
      ...mapState([
        'pages',
      ])
    },
    data() {
      return {}
    },
  }
</script>