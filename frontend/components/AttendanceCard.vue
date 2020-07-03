<template>
    <b-card
        class="mb-4">
        <b-card-title
            class="d-flex">
            Guests
            <b-button 
                @click="save()"
                size="sm"
                class="ml-auto"
                variant="outline-success">
                Save
            </b-button>
        </b-card-title>
        <b-form-group label="Who will be attending?">

            <b-row
                v-for="(person, index) of allGuests"
                :key="`attendant_input_${index}`">
                <b-input-group class="mb-2">
                    <b-form-input
                        :value="allGuests[index].name"
                        @input="handleNameChange(person.id, $event, index)"
                        type="text">
                    </b-form-input>
                    <b-input-group-append>
                        <b-button 
                            v-if="!allGuests[index].on_invitation"
                            @click="removeAttending(person.id,index)"
                            variant="outline-danger">
                            <b-icon
                                icon="dash"></b-icon>
                        </b-button>
                        <b-button 
                            v-if="allGuests.length-1===index"
                            @click="addAttending()"
                            variant="outline-primary">
                            <b-icon
                                icon="plus"></b-icon>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-row>
        </b-form-group>

    </b-card>
</template>

<script>

    export default {
        data() {
            return {
                currentGuest: null,
            }
        },
        computed: {
            guest: {
                async set (val) {
                    this.currentGuest=val
                },
                get () {
                    if (this.currentGuest===null) this.currentGuest = this.$store.state.currentGuest
                    return this.currentGuest
                },
            },
            attending: {
                async set (val) {
                    const guest = { ...this.guest }
                    guest.guests_attending = val
                    this.guest=guest
                },
                get () {
                    const attending = [ ...this.guest.guests_attending ]
                    return attending
                },
            },
            invited: {
                set (val) {
                    const guest = { ...this.guest }
                    guest.name = val
                    this.guest = guest
                },
                get () {
                    return { name: this.guest.name, on_invitation: true }
                },
            },
            allGuests () {
                return [ this.invited, ...this.attending ]
            },
        },
        methods: {
            getId () {
                // A quick unique id generator so that we can manage new guests as though
                // they have mongodb ids
                return (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
                    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
            },
            async save() {

                this.$store.commit('add', {
                    entity: 'currentGuest',
                    data: this.guest,
                })
                // TODO: Error handling here
                const { data } = await this.$axios.put(`${process.env.localUrl}/api/guests/${this.guest._id}`, this.guest)
            },
            addAttending() {
                const attending = Object.values(this.attending)
                attending.push({
                    name: 'Mystery Guest',
                    id: this.getId(),
                    is_new: true,
                })
                this.attending = attending
            },
            removeAttending(id, index) {
                if (this.allGuests[index].hasOwnProperty('on_invitation')) return
                const attending = [ ...this.attending ]
                for (let i=0; i<attending.length; i++) {
                    if (attending[i].id===id) attending.splice(i, 1)
                }
                this.attending = attending
            },
            handleNameChange (id, newName, index) {
                if (this.allGuests[index].hasOwnProperty('on_invitation')) {
                    // TODO: Some kind of alert for attempts to delete the primary name
                    if (newName === '') return
                    return this.invited = newName                
                } else {
                    if (newName==='') this.removeAttending(id, index)
                    const attending = [ ...this.attending ]
                    for (let i=0; i<attending.length; i++) {
                        if (attending[i].id===id) {
                            attending[i] = { ...attending[i] }
                            attending[i].name = newName
                        }
                    }
                    return this.attending = attending           
                }
            }
        },
    }
</script>