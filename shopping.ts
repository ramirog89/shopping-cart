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

interface CartItem {
  name: string;
  price: number;
}

interface SpecialPrice {
  name: string;
  calculate: (items: CartItem[], shopping?: any, item?: CartItem) => number;
}

interface Shopping {
  add: (item: CartItem, quantity: number) => void;
  remove: (item: CartItem, quantity: number) => void;
  calculate: (bag: any) => number;
  calculateSubTotal: () => number;
  calculateTotalWithTax: () => number;
}

const createItem = ({ name, price }: CartItem): CartItem => ({
  name,
  price
});

const createShopping = (shopping: Shopping): Shopping => (shopping);

let cart: CartItem[] = [];

// Create cart items
const avocado = createItem({ name: 'Avocado', price: 2 });
const bread = createItem({ name: 'Bread', price: 3.99 });
const cheerios = createItem({ name: 'Cheerios', price: 5.49 });
const dillPickles = createItem({ name: 'Dill Pickles', price: 4.99 });

// Define special prices for any cart item
const specialPriceMap: { [key: string]: SpecialPrice } = {
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
  [dillPickles.name]: { name: '30% off', calculate: (items, shopping, item) => {
    return item.price * items.length * 0.30;
  }},
};

const shoppingCart = createShopping({
  add: (item: CartItem, quantity: number) => {
    [...Array(quantity).keys()].forEach(() => cart.push(item));
  },
  remove: (item: CartItem, quantity: number) => {
    const lastItemBeforeDelete = cart.filter(shopItem => shopItem.name === item.name).length;
    cart = cart.filter(shopItem => shopItem.name !== item.name);
    shoppingCart.add(item, lastItemBeforeDelete - quantity);
  },
  calculate: (bag): number => {
    return bag.reduce((total, item) => total += item.price, 0);
  },
  calculateSubTotal: (): number => {
    return shoppingCart.calculate(cart);
  },
  calculateTotalWithTax: (): number => {
    const itemSpecialPriceList = Object.keys(specialPriceMap);
    const itemsWithOutSpecialPrices = cart.filter(shopItem => {
      return !itemSpecialPriceList.includes(shopItem.name)
    });
    const total = Object.entries(specialPriceMap).reduce((total, [key, item]) => {
      const allItems = cart.filter(cartItem => cartItem.name === key);
      return total += item.calculate(allItems, shoppingCart, allItems[0]);
    }, 0);
    return total + shoppingCart.calculate(itemsWithOutSpecialPrices);
  }
});

// Populate the Shop
shoppingCart.add(avocado, 3);
shoppingCart.add(bread, 3);
shoppingCart.add(cheerios, 1);
shoppingCart.add(dillPickles, 2);

// Remove items from the shop
// shoppingCart.remove(avocado, 2);

// Shopping Summary
console.table(cart);

console.info('Shopping Subtotal: ', shoppingCart.calculateSubTotal());
console.info('Shopping Total with Taxes: ', shoppingCart.calculateTotalWithTax());