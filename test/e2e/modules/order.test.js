

async function runOrderTests() {
    console.log("\n▶▶▶ Running CART Tests...\n");

    let results = [];
    const testCases = [];

    for (let testCase of testCases) {
        console.log(`▶ Running test: ${testCase.name}`);
        const result = await testCase();
        results.push(result);
    }

    return { name: "CART", testResults: results };
}

runOrderTests()

module.exports = { runOrderTests };
