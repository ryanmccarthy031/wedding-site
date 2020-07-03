"use strict";

/**
 * Gifts.js controller
 *
 * @description: A set of functions called "actions" for managing `Gifts`.
 */

const stripe = require("stripe")("sk_test_INSERT YOUR API KEY");

module.exports = {
  /**
   * Retrieve gifts records.
   *
   * @return {Object|Array}
   */

  find: async ctx => {
    if (ctx.query._q) {
      return strapi.services.gifts.search(ctx.query);
    } else {
      return strapi.services.gifts.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a gifts record.
   *
   * @return {Object}
   */

  findOne: async ctx => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.gifts.fetch(ctx.params);
  },

  /**
   * Count gifts records.
   *
   * @return {Number}
   */

  count: async ctx => {
    return strapi.services.gifts.count(ctx.query);
  },

  /**
   * Create a/an gifts record.
   *
   * @return {Object}
   */

  create: async ctx => {
    const { address, amount, dishes, token, city, state } = ctx.request.body;

    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: amount * 100,
      currency: "usd",
      description: `Gift ${new Date()}`,
      source: token
    });

    // Register the gifts in the database
    const gift = await strapi.services.gifts.add({
      name,
      email,
      message,
      amount,
    });

    return gift;
  },

  /**
   * Update a/an gifts record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.gifts.edit(ctx.params, ctx.request.body);
  },

  /**
   * Destroy a/an gifts record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.gifts.remove(ctx.params);
  }
};