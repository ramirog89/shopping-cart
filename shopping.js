const createItem = (name, price) => ({
    name,
    price
});
// Create cart items
const avocado = createItem('Avocado', 2);
const bread = createItem('Bread', 3.99);
const cheerios = createItem('Cheerios', 5.49);
const dillPickles = createItem('Dill Pickles', 4.99);
const shoppingCart = (function (priceMap = {}) {
    let cart = [];
    const specialPriceMap = priceMap;
    function getCart() {
        return cart;
    }
    ;
    function add(item, quantity) {
        [...Array(quantity).keys()].forEach(() => { var _a; return cart.push(Object.assign(Object.assign({}, item), { specialPrice: ((_a = specialPriceMap[item.name]) === null || _a === void 0 ? void 0 : _a.name) || null })); });
    }
    ;
    function remove(item, quantity) {
        const lastItemBeforeDelete = cart.filter(shopItem => shopItem.name === item.name).length;
        cart = cart.filter(shopItem => shopItem.name !== item.name);
        shoppingCart.add(item, lastItemBeforeDelete - quantity);
    }
    ;
    function calculate(bag) {
        return bag.reduce((total, item) => total += item.price, 0);
    }
    ;
    function calculateSubTotal() {
        return shoppingCart.calculate(cart);
    }
    ;
    function calculateTotalWithTax() {
        const itemSpecialPriceList = Object.keys(specialPriceMap);
        const itemsWithOutSpecialPrices = cart.filter(shopItem => {
            return !itemSpecialPriceList.includes(shopItem.name);
        });
        const total = Object.entries(specialPriceMap).reduce((total, [key, item]) => {
            const allItems = cart.filter(cartItem => cartItem.name === key);
            return total += item.calculate(allItems, shoppingCart, allItems[0]);
        }, 0);
        return total + shoppingCart.calculate(itemsWithOutSpecialPrices);
    }
    ;
    return {
        add,
        remove,
        calculate,
        calculateSubTotal,
        calculateTotalWithTax,
        getCart
    };
})({
    // Define special prices for any cart item
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
console.table(shoppingCart.getCart());
