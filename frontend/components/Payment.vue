<template>
    <b-container>
            <b-row :class="successfulCharge ? 'thanks' : 'payment' " class="justify-content-md-center">
                <b-col lg="8">
                    <transition name="slide-out">
                        <b-card  v-if="!successfulCharge"  class="w-100 position-absolute justify-content-md-center">
                            <b-card-title>Honeymoon Fund</b-card-title>
                            <b-row>
                                <b-col sm="8">
                                    <b-form-input 
                                        class="mb-2"
                                        placeholder="Name" 
                                        v-model="name"
                                        @input="validate('name')"
                                        :state="isValid.name"
                                        trim>
                                    </b-form-input>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-input 
                                        class="mb-2"
                                        placeholder="Amount" 
                                        v-model="amount"
                                        @input="validate('amount')"
                                        :state="isValid.amount"
                                        v-currency="{currency: 'USD', locale: 'en'}"
                                        trim>
                                    </b-form-input>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col md="12">
                                    <b-form-input 
                                        class="mb-2"
                                        placeholder="Email" 
                                        v-model="email"
                                        @input="validate('email')"
                                        :state="isValid.email"
                                        type="email"
                                        trim>
                                    </b-form-input>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col md="12"> 
                                    <card class='stripe-card mb-6'
                                        :class='{ complete }'
                                        :stripe="publicKey"
                                        :options='stripeOptions'
                                        @change='complete = $event.complete'/>
                                </b-col>
                            </b-row>
                            <div class="text-center">
                                <b-button
                                    v-if="!loading"
                                    class="mt-2" 
                                    @click='pay'
                                    :disabled="!complete || !allValid"
                                    variant="success">
                                    Bon Voyage!
                                </b-button>
                                <b-spinner class="mt-2" v-else variant="success" label="Spinning"></b-spinner>
                            </div>
                        </b-card>
                    </transition>
                    <transition name="slide-in">
                        <div v-if="successfulCharge" class="w-100 position-absolute text-center">
                            <h3>
                                Thanks!
                            </h3>
                            <p>
                                We really hope to see you at the wedding!
                            </p>
                        </div>
                    </transition>
                </b-col>
            </b-row>
        <b-row class="pl-4 justify-content-center">   
            <b-button 
                href="http://www.zola.com/registry/leighandryan2021"
                variant="outline-primary"
                target="_blank">
                Visit Our Registry
            </b-button>
        </b-row>
    </b-container>
</template>

<script>
    import { Card, createToken } from 'vue-stripe-elements-plus'
    import { CurrencyDirective } from 'vue-currency-input'


export default {
    data () {
        return {
            isValid: {
                name: null,
                email: null,
                amount: null,
            },
            name: '',
            amount: null,
            email: '',
            complete: false,
            successfulCharge: false,
            loading: false,
            stripeOptions: {
                // see https://stripe.com/docs/stripe.js#element-options for details
            }
        }
    },
    directives: {
        currency: CurrencyDirective
    },
    computed: {
        publicKey () {
            return process.env.stripePublicKey
        },
        allValid () {
            for (const key in this.isValid) {
                if (this.isValid[key]===false) return false
            }
            return true
        },
    },
    components: { Card },
    methods: {
        validate (key) {
            if (key==='amount') return this.isValid.amount = this.amount===null || this.amount<=0.50 ? false : null
            this.isValid[key] = this[key]==='' ? false : null
        },
        async pay () {
            // createToken returns a Promise which resolves in a result object with
            // either a token or an error key.
            // See https://stripe.com/docs/api#tokens for the token object.
            // See https://stripe.com/docs/api#errors for the error object.
            // More general https://stripe.com/docs/stripe.js#stripe-create-token.
            this.loading = true
            this.validate()
            let token
            try {
                const response = await createToken()
                token = response.token.id
            } catch (err) {
                this.loading=false
                this.$bvToast.toast('It looks like there was a problem with your credit card information.', {
                    title: `Oh no! An error occurred.`,
                    variant: 'danger',
                    solid: true
                })
                return
            }
            try {
                const gift = {
                    amount: this.$parseCurrency(this.amount),
                    name: this.name,
                    email: this.email,
                    token
                }
                const { data } = await this.$axios.post(`${process.env.localUrl}/api/gifts`, gift)
                this.successfulCharge = true
            } catch (err) {
                this.$bvToast.toast('It looks like there was a problem processing your gift.', {
                    title: `Oh no! An error occurred.`,
                    variant: 'danger',
                    solid: true
                })
            } finally {
                this.loading = false
            }
        }
    }
}
</script> 
 
<style>
    .StripeElement {
        display: block;
        width: 100%;
        height: calc(1.5em + 0.75rem + 2px);
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .StripeElement--focus {
        color: #495057;
        background-color: #fff;
        border-color: #80bdff;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .StripeElement--invalid {
        border-color: #fa755a;
    }

    .StripeElement--webkit-autofill {
        background-color: #fefde5 !important;
    }

    /* Enter and leave animations can use different */
    /* durations and timing functions.              */
    .slide-in-enter-active {
        transition: all .3s ease;
    }
    .slide-in-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-in-enter, .slide-in-leave-to
        /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateX(150px);
        opacity: 0;
    }
    /* Enter and leave animations can use different */
    /* durations and timing functions.              */
    .slide-out-enter-active {
        transition: all .3s ease;
    }
    .slide-out-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-out-enter, .slide-out-leave-to
        /* .slide-fade-leave-active below version 2.1.8 */ {
        transform: translateX(-150px);
        opacity: 0;
    }
</style> 
