/**
Your cart should be able to:
add and store items with their quantities
remove items with a given quantity
calculate a subtotal with discounts applied
calculate a total with a given tax rate

Below is a table with some sample prices and discounts

Item          Unit      Special
              Price     Price
----------------------------------
Avocado       $2.00    3 for $5
Bread         $3.99
Cheerios      $5.49     BOGO
Dill Pickles  $4.99      30% off
*/

class CartItem {
  name;
  price;

  constructor(name = '', price = 0) {
    this.name = name;
    this.price = price;
  }
}


class ShoppingCart {
  cart = [];
  
  specialPrices = {}

  constructor(specialPrices = {}) {
    this.specialPrices = specialPrices;
  }

  add(item, quantity) {
    [...Array(quantity).keys()].forEach(() => this.cart.push(item));
  }

  remove(item, quantity) {
    const lastItemBeforeDelete = this.cart.filter(shopItem => shopItem.name === item.name).length;
    this.cart = this.cart.filter(shopItem => shopItem.name !== item.name);
    this.add(item, lastItemBeforeDelete - quantity);
  }

  calculate(bag) {
    return bag.reduce((total, item) => total += item.price, 0);
  }

  calculateSubTotal() {
    return this.calculate(this.cart);
  }

  calculateTotalWithTax() {
    const itemSpecialPriceList = Object.keys(this.specialPrices);
    const itemsWithOutSpecialPrices = this.cart.filter(shopItem => {
      return !itemSpecialPriceList.includes(shopItem.name)
    });

    const total = Object.entries(this.specialPrices).reduce((total, [key, item]) => {
      const allItems = this.cart.filter(cartItem => cartItem.name === key);
      const totalAdditionalPrices = item.calculate(allItems, this, item);
      return total += totalAdditionalPrices;
    }, 0);

    return total + this.calculate(itemsWithOutSpecialPrices);
  }
}

const avocado = new CartItem('Avocado', 2);
const bread = new CartItem('Bread', 3.99);
const cheerios = new CartItem('Cheerios', 5.49);
const dillPickles = new CartItem('Dill Pickles', 4.99);

const shoppingCart = new ShoppingCart({
  [avocado.name]: { name: '3 for $5', calculate: (items) => {
      const withFive = Math.floor(items.length / 3);
      const totalWithFive = withFive * 5;
      const missing = items.length % 3;
      const totalMissing = missing * avocado.price;
      return totalWithFive + totalMissing;
    }
  },
  [cheerios.name]: { name: 'BOGO', calculate: (items, shopping, item) => {
    shopping.add({ ...item, price: 0 }, items.length);
    return shopping.calculate(items);
  }},
  [dillPickles.name]: { name: '30% off', calculate: (items) => {
    return items.reduce((total, item) => total += item.price * 0.30, 0);
  }},
});

// Populate the Shop
shoppingCart.add(avocado, 3);
shoppingCart.add(bread, 3);
shoppingCart.add(cheerios, 1);
shoppingCart.add(dillPickles, 2);

// Remove items from the shop
// shoppingCart.remove(avocado, 2);

// Shopping Summary
console.info('Shopping Subtotal: ', shoppingCart.calculateSubTotal());
console.info('Shopping Total with Taxes: ', shoppingCart.calculateTotalWithTax());

console.table(shoppingCart.cart);