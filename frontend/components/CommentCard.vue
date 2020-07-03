<template>
    <b-card
        class="mb-4" >
        <b-card-title
            class="d-flex">
            Comments
            <b-button 
                @click="save()"
                size="sm"
                class="ml-auto"
                variant="outline-success">
                Save
            </b-button>
        </b-card-title>
        <client-only placeholder="Loading Text Editor...">
            <!-- TODO: Border radius on this text editor to match buttons -->
            <vue-editor :editor-toolbar="customToolbar" v-model="comment"></vue-editor>
        </client-only>
    </b-card>
    
</template>
<script>
    export default {
        data: () => ({
            currentComment: null,
            customToolbar: [
                [{ header: [false, 1, 2, 3] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
            ],
        }),
        computed: {
            comment: {
                set (val) {
                    this.currentComment = val
                },
                get () {
                    if (this.currentComment===null) {
                        if (this.$store.state.currentGuest.comment) {
                            this.currentComment = this.$store.state.currentGuest.comment
                        } else {
                            this.currentComment = "Is there anything you'd like to share with us?"
                        }
                    }
                    return this.currentComment
                },
            },
        },
        methods: {
            async save () {
                const guest = { ...this.$store.state.currentGuest }
                guest.comment = this.comment
                this.$store.commit('add', {
                    entity: 'currentGuest',
                    data: guest,
                })
                // TODO: Error handling here
                const { data } = await this.$axios.put(`${process.env.localUrl}/api/guests/${guest._id}`, guest)

            },
        },
    }
</script>