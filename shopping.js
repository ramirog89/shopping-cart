const createItem = (name, price) => ({
    name,
    price
});
// Create cart items
const avocado = createItem('Avocado', 2);
const bread = createItem('Bread', 3.99);
const cheerios = createItem('Cheerios', 5.49);
const dillPickles = createItem('Dill Pickles', 4.99);
// Define special prices for any cart item
const specialPriceMap = {
    [avocado.name]: { name: '3 for $5', calculate: (items) => {
            const withFive = Math.floor(items.length / 3);
            const totalWithFive = withFive * 5;
            const missing = items.length % 3;
            const totalMissing = missing * avocado.price;
            return totalWithFive + totalMissing;
        }
    },
    [cheerios.name]: { name: 'BOGO', calculate: (items, shopping, item) => {
            shopping.add(Object.assign(Object.assign({}, item), { specialPrice: 'BOGO', price: 0 }), items.length);
            return shopping.calculate(items);
        } },
    [dillPickles.name]: { name: '30% off', calculate: (items, shopping, item) => {
            return item.price * items.length * 0.30;
        } },
};
const shoppingCart = ({
    cart: [],
    add: (item, quantity) => {
        [...Array(quantity).keys()].forEach(() => { var _a; return shoppingCart.cart.push(Object.assign(Object.assign({}, item), { specialPrice: ((_a = specialPriceMap[item.name]) === null || _a === void 0 ? void 0 : _a.name) || null })); });
    },
    remove: (item, quantity) => {
        const lastItemBeforeDelete = shoppingCart.cart.filter(shopItem => shopItem.name === item.name).length;
        shoppingCart.cart = shoppingCart.cart.filter(shopItem => shopItem.name !== item.name);
        shoppingCart.add(item, lastItemBeforeDelete - quantity);
    },
    calculate: (bag) => {
        return bag.reduce((total, item) => total += item.price, 0);
    },
    calculateSubTotal: () => {
        return shoppingCart.calculate(shoppingCart.cart);
    },
    calculateTotalWithTax: () => {
        const itemSpecialPriceList = Object.keys(specialPriceMap);
        const itemsWithOutSpecialPrices = shoppingCart.cart.filter(shopItem => {
            return !itemSpecialPriceList.includes(shopItem.name);
        });
        const total = Object.entries(specialPriceMap).reduce((total, [key, item]) => {
            const allItems = shoppingCart.cart.filter(cartItem => cartItem.name === key);
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
console.info('Shopping Subtotal: ', shoppingCart.calculateSubTotal());
console.info('Shopping Total with Taxes: ', shoppingCart.calculateTotalWithTax());
console.table(shoppingCart.cart);
