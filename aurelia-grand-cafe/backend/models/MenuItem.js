const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Coffee', 'Tea', 'Mocktails', 'Breakfast', 'Burgers', 'Pizza', 'Pasta', 'Desserts', 'Cakes', 'Snacks', 'Special Combos'],
    },
    image: {
      type: String,
      required: true,
    },
    isVeg: {
      type: Boolean,
      required: true,
      default: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 4.5,
    },
    isSignature: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = MenuItem;
