<template>
    <div>
        <label for="name">Enter your name as it appears on the invitation</label>
        <b-form-input 
            id="name" 
            v-model="name" 
            @input="getGuest($event)"
            placeholder="Enter your name">
        </b-form-input>
        <div class="mt-2">Value: {{ name }}</div>
    </div>
</template>

<script>
    import debounce from 'lodash/debounce'
    export default {
        data() {
            return {
            name: ''
            }
        },
        methods: {
            getGuest: debounce(async function (val) {
                if (val.length > 3) {
                    const guest = await this.$axios.get(`${process.env.localUrl}/api/guests?name_contains=${val}`)
                    console.log(guest)
                }
            }, 1000),
        },
    }
</script>
