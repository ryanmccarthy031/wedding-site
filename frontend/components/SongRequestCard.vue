<template>
    <b-card
        class="mb-4">
        <b-card-title
            class="d-flex">
            Song Requests
            <b-button 
                @click="save()"
                size="sm"
                class="ml-auto"
                variant="outline-success">
                Save
            </b-button>
        </b-card-title>
        <b-form-group label="We'd like to have a little something for everyone at the reception.
            What would you like to hear?">
            <b-row>
                <b-col
                    md="5">
                    <div
                        class="mb-4"
                        v-for="(song, index) of songs"
                        :key="`song_${index}`">
                        <b-form-input
                            id="song_title"
                            class="mb-2"
                            placeholder="Song Title"
                            @input="handleChange($event, index, 'title')"
                            :value="song.title"
                            debounce="300"
                            type="text">
                        </b-form-input>
                        <b-form-input
                            id="artist"
                            class="mb-2"
                            placeholder="Artist"
                            @input="handleChange($event, index, 'artist')"
                            :value="song.artist"
                            debounce="300"
                            type="text">
                        </b-form-input>
                        <b-button
                            class="w-100"
                            @click="remove(index)"
                            variant="outline-danger">
                            Remove Song
                        </b-button>
                    </div>
                </b-col>
                <b-col
                    md="7">
                    <client-only placeholder="Loading Text Editor...">
                        <!-- TODO: Border radius on this text editor to match buttons -->
                        <vue-editor :editor-toolbar="customToolbar" v-model="comment"></vue-editor>
                    </client-only>
                </b-col>
            </b-row>



            <b-button
                pill
                @click="add()"
                variant="outline-primary">
                Add Another Song
            </b-button>
        </b-form-group>

    </b-card>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep'
    export default {
        data: () => ({
            currentSongs:[],
            removedSongs: [],
            currentComment: null,
            customToolbar: [
                [{ header: [false, 1, 2, 3] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
            ],
        }),
        props: {
            guestId: String,
        },
        computed: {
            emptySong () {
                return {
                    artist: '',
                    title: '',
                    guest: this.guestId,
                }
            },
            defaultComment () {
                return `What do you love about ${this.songs.length>1 ? 'these songs' : 'this song'}?`
            },
            comment: {
                set (val) {
                    this.currentComment=val
                },
                get () {
                    if (this.currentComment===null) {
                        if (this.$store.state.currentGuest.songs_comment) {
                            this.currentComment = this.$store.state.currentGuest.songs_comment
                        } else {
                            this.currentComment=this.defaultComment
                        }
                    }
                    return this.currentComment
                },
            },
            songs: {
                set (val) {
                    this.currentSongs=val
                },
                get () {
                    if (!this.currentSongs.length) {
                        if (this.$store.state.currentGuest.songs.length) {
                            this.currentSongs=cloneDeep(this.$store.state.currentGuest.songs)
                        } else {
                            this.currentSongs = [{ ...this.emptySong }]
                        }
                    }
                    return this.currentSongs
                },
            },
        },
        methods: {  
            handleChange (val, index, field) {
                const songs= cloneDeep(this.songs)
                songs[index][field] = val
                this.songs = songs
            },
            remove (index) {
                const songs=cloneDeep(this.songs)
                if (songs[index].hasOwnProperty('id')) {
                    this.removedSongs.push(songs[index])
                }
                if (songs.length===1) {
                    songs=[{ ...this.emptySong }]
                } else {
                    songs.splice(index, 1)
                }
                this.songs = songs
            },
            add () {
                const songs = cloneDeep(this.songs)
                songs.push({ ...this.emptySong })
                this.songs=songs
            },
            async save () {
                const guest = { ...this.$store.state.currentGuest }
                if (this.currentComment!==`<p>${this.defaultComment}</p>`) {
                    guest.songs_comment = this.currentComment
                    guest.songs = this.songs
                    this.$store.commit('add', {
                        entity: 'currentGuest',
                        data: guest,
                    })
                    // TODO: Error handling here
                    await this.$axios.put(`${process.env.localUrl}/api/guests/${guest._id}`, guest)
                }
                for (let i=0; i<this.songs.length; i++) {
                    if (this.songs[i].title==='' && this.songs[i].artist==='') continue
                    // TODO: Error handling here
                    if (!this.songs[i].id) {
                       const { data } = await this.$axios.post(`${process.env.localUrl}/api/songs`, this.songs[i])
                       const songs = cloneDeep(this.songs)
                       songs[i].id=data.id
                       this.songs = songs
                    } else {
                        await this.$axios.put(`${process.env.localUrl}/api/songs/${this.songs[i].id}`, this.songs[i])
                    }
                }

                for (let i=0; i<this.removedSongs.length; i++) {
                    await this.$axios.delete(`${process.env.localUrl}/api/songs/${this.removedSongs[i].id}`, this.removedSongs[i])
                }
                this.removedSongs = []
            }
        },
    }
</script>