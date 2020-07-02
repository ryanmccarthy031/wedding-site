<template>
    <b-card>
        <div>
            <b-card-text>
                Will you be attending the wedding?
            </b-card-text>    
            <div>
                <b-button
                    @click="setAttending(false)"
                    variant="outline-danger">
                    No
                </b-button>
                <b-button 
                    @click="setAttending(true)"
                    variant="outline-primary">

                    Yes
                </b-button>
            </div>
        </div>
    </b-card>
</template>

<script>
    export default {
        data() {
            return {
                form: ''
            }
        },
        methods: {
            async setAttending (val) {
                const guest = { ...this.$store.state.currentGuest }
                guest.is_coming=val
                this.$store.commit('add', {
                    entity: 'currentGuest',
                    data: guest,
                })
                const { data } = await this.$axios.put(`${process.env.localUrl}/api/guests/${guest._id}`, { is_coming: val })
                console.log(data)

            }
        }
    }
</script>
