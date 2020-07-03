'use strict';
const stripe = require('stripe')('YOU_STRIPE_API_KEY');

module.exports = {
  create: async ctx => {
    const {
      name,
      email,
      message,
      amount,
    } = ctx.request.body;

    // Charge the donor
    try {
      await stripe.charges.create({
        // Transform cents to dollars.
        amount: amount * 100,
        currency: 'usd',
        description: `Gift ${new Date()}`,
        source: token,
      });

      // Register the gifts in the database
      try {
        const gift = await strapi.services.gifts.create({
          name,
          email,
          message,
          amount,
        });

        return gift;
      } catch (err) {
        // Silent
      }
    } catch (err) {
      // Silent
    }
  },
};