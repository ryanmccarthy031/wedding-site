<template>
  <div>
    <p v-if="streetA">{{streetA}}</p>
    <p v-if="streetB">{{streetB}}</p>
    <p v-if="city && state && zip">{{`${city}, ${state}  ${zip}`}}</p>
  </div>
</template>

<script>
export default {
  props: {
      streetA: String,
      streetB: String,
      city: String,
      state: String,
      zip: String,
  }
}
</script>
