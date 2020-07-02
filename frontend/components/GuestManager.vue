<template>
    <b-container>
        <b-row>
            <b-col
                md="4">
                <b-card
                    class="mb-4"
                    title="RSVP">
                    <b-form-group>
                        <b-form-checkbox
                            v-model="isComing"
                            switch size="lg">
                            {{ guest.is_coming ? `${pronouns.contraction} coming!` :  `${pronouns.pronoun} can't make it.` }}
                        </b-form-checkbox>
                    </b-form-group>
                </b-card>
            </b-col>
            <b-col
                md="8">
                <AttendanceCard />
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <SongRequestCard :guestId="this.guest.id" />
            </b-col>
        </b-row>
        <b-row>
            <b-col
                md="6">
                <b-card
                    class="mb-4"
                    title="Contact Info">

                </b-card>
            </b-col>
            <b-col
                md="6">
                <b-card
                    class="mb-4"
                    title="Comments" >
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import AttendanceCard from '~/components/AttendanceCard'
    import SongRequestCard from '~/components/SongRequestCard'

    export default {
        computed: {
            guest: {
                async set (val) {
                    this.$store.commit('add', {
                        entity: 'currentGuest',
                        data: val,
                    })
                    const { data } = await this.$axios.put(`${process.env.localUrl}/api/guests/${val._id}`, val)
                },
                get () {
                    return { ...this.$store.state.currentGuest }
                },
            },
            isComing: {
                set (val) {
                    const guest = { ...this.guest }
                    guest.is_coming = val
                    this.guest = guest
                },
                get () {
                    return this.guest.is_coming
                },
            },
            pronouns () {
                const we = {
                    pronoun: "We",
                    contraction: "We're",
                    withVerb: "We are",
                }
                const i = {
                    pronoun: "I",
                    contraction: "I'm",
                    withVerb: "I am",
                }
                return this.guest.name.includes('&') || 
                    (this.guest.hasOwnProperty('guests_attending') && 
                    this.guest.guests_attending.length) ? we : i
            },
        },

        components: {
            AttendanceCard,
            SongRequestCard,
        }
    }
</script>
