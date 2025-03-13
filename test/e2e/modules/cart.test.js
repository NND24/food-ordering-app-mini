const { testAddingCart } = require("../testcase/cart/cart.addItems.test");


async function runCartTests() {
    console.log("\n▶▶▶ Running CART Tests...\n");

    let results = [];
    const testCases = [testAddingCart,];

    for (let testCase of testCases) {
        console.log(`▶ Running test: ${testCase.name}`);
        const result = await testCase();
        results.push(result);
    }

    return { name: "CART", testResults: results };
}

runCartTests()

module.exports = { runCartTests };
