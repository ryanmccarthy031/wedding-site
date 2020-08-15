<template>
  <div>
        <b-sidebar 
          aria-label="sidebar navigation"
          id="sidebar" 
          no-header
          backdrop 
          shadow>
            <nav class="mt-5 pt-4">
              <ul>
                <b-nav-item
                  v-for="(page, slug) in pages" 
                  :key="`page_${slug}`" 
                  :to="slug==='home'? '/' : `${slug}`">
                    <span :class="currentSlug===slug ? 'active' : ''" >{{ page.title }}</span>
                </b-nav-item>
              </ul>
            </nav>
        </b-sidebar>
        <div class="toggler-box">

          <b-navbar-toggle class="toggler position-fixed d-block d-sm-none" target="sidebar">
            <template v-slot:default="{ expanded }">
              <button class="hamburger hamburger--squeeze" :class="{ 'is-active': expanded }" type="button">
                <span class="hamburger-box">
                  <span class="hamburger-inner"></span>
                </span>
              </button>
            </template>
          </b-navbar-toggle>
        </div>
    <transition name="slide-fade">  
      <!-- v-if="currentSlug==='home'" -->    
      <b-row class="py-3 justify-content-md-center header">
          <b-col>
            <h1 :class="currentSlug==='home' ? 'home' : 'secondary text-center'">
                <span
                  v-for="(name, index) in $store.state.names">
                    <b-row  class="text-center p-0 m-0">
                      <b-col class=" p-0 m-0">
                        <span class='mx-auto flourish'>{{name}}</span>
                      </b-col>
                    </b-row>
                    <b-row class="p-0 m-0">
                      <b-col  class="text-center p-0 m-0">
                        <span class='mx-auto conjunction' sm v-if="index<$store.state.names.length - 1" >
                          and
                        </span>
                      </b-col>
                    </b-row>

                </span>
            </h1>
          </b-col>
      </b-row>
    </transition>

    <Navbar 
      :pages="pages"
      :currentSlug="currentSlug" />

    <main  class="main-content columns pt-2 mt-5 mb-5">

      <div class="container column is-10">
        <nuxt />
      </div>
    </main>
  <footer>
    <b-row class="justify-content-center">
      <b-col cols="8" md="6" lg="4">
        <b-img fluid src="/footer.png" />
      </b-col>
    </b-row>
  </footer>
  </div>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    mounted () {
        let scrolled = false

        /* Bind the scroll Event */
        window.addEventListener('scroll', function(e) {
            scrolled = true
        });
        const that = this
        let timeout = setInterval(function() {
            /* If the page was scrolled, handle the scroll */
            if (scrolled) {
                scrolled = false

                if (that.$children[2].$el.getBoundingClientRect().y<5) {
                    that.stuck=true
                } else {
                    that.stuck=false
                }
            }
        }, 200);
    },
    computed: {
      ...mapState([
        'pages',
        'carouselPhotos',
      ]),
      currentSlug () {
        return typeof this.$route.params.slug === 'undefined' ? 'home' : this.$route.params.slug
      },
    },
    data () {
        return {
            stuck: false,
        }
    },
  }
</script>
<style>


/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s ease-out;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-300px);
}
</style>