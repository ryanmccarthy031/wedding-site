<template>
    <b-container>
        <b-row>
            <b-col
                md="5">
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
                md="7">
                <AttendanceCard 
                    v-if="guest.is_coming" />
                <CommentCard 
                    v-else />
            </b-col>
        </b-row>
        <b-row v-if="guest.is_coming">
            <b-col>
                <SongRequestCard :guestId="this.guest.id" />
            </b-col>
        </b-row>
        <b-row v-if="guest.is_coming">
            <b-col>
                <AddressCard />
            </b-col>
        </b-row>
        <b-row v-if="guest.is_coming">
            <b-col>
                <CommentCard />
            </b-col>
        </b-row>                       

    </b-container>
</template>

<script>
    import AttendanceCard from '~/components/AttendanceCard'
    import SongRequestCard from '~/components/SongRequestCard'
    import CommentCard from '~/components/CommentCard'
    import AddressCard from '~/components/AddressCard'

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
                return (this.guest.name.includes('&') || this.guest.name.includes(' and ')) ||
                    (this.guest.hasOwnProperty('guests_attending') && 
                    this.guest.guests_attending.length) ? we : i
            },
        },

        components: {
            AttendanceCard,
            SongRequestCard,
            CommentCard,
            AddressCard,
        }
    }
</script>
