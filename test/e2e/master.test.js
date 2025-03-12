const axios = require("axios");
const { testLoginSucess } = require("./testcase/login/login.main.test");
const { testLoginFail1 } = require("./testcase/login/login.alter1.test");
const { testLoginFail2 } = require("./testcase/login/login.alter2.test");
const { testLoginFail3 } = require("./testcase/login/login.alter3.test");
const { testForgotPasswordFlow } = require("./testcase/forgot_password/forgot.password.main.test");

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5000";

async function isServerRunning() {
    try {
        const response = await axios.get(`${SERVER_URL}/health`, { timeout: 5000 });
        return response.status === 200;
    } catch (error) {
        console.error(`🚨 API Server is NOT running at ${SERVER_URL}`);
        return false;
    }
}

async function runTests() {
    try {
        console.log("\n🔍 Checking API Server...\n");

        if (!(await isServerRunning())) {
            console.log("❌ Server is down. Tests cannot proceed.");
            process.exit(1);
        }

        console.log("✅ Server is running. Proceeding with tests...\n");

        const testGroups = [
            // {
            //     name: "LOGIN",
            //     testcases: [testLoginSucess, testLoginFail1, testLoginFail2, testLoginFail3]
            // },
            {
                name: "FORGOT_PASSWORD",
                testcases: [testForgotPasswordFlow]
            }
        ];

        let groupResults = [];
        console.log("\n🔍 Running E2E Tests...\n");

        for (let testGroup of testGroups) {
            console.log(`▶▶▶▶ Running test group: ${testGroup.name}`);
            let results = [];

            for (let testCase of testGroup.testcases) {
                console.log(`▶ Running test: ${testCase.name}`);
                const result = await testCase();
                results.push(result);
            }

            groupResults.push({ name: testGroup.name, testResults: results });
        }

        console.log("\n\n📊 TEST SUMMARY:");
        let totalFailed = 0;

        for (let testResult of groupResults) {
            console.log(`▶▶▶▶ Result test group: ${testResult.name}`);
            let passed = testResult.testResults.filter(r => r.status === "Passed").length;
            let failed = testResult.testResults.length - passed;
            totalFailed += failed;

            console.log(`✅ Passed: ${passed}`);
            console.log(`❌ Failed: ${failed}`);
        }

        if (totalFailed > 0) {
            console.log("\n❌ Some tests failed. Please check the logs.");
            process.exit(1);
        } else {
            console.log("\n🎉 All tests passed successfully!");
            process.exit(0);
        }
    } catch (error) {
        console.error("🚨 An error occurred during the test execution:", error);
        process.exit(1);
    }
}

// Run all tests
runTests();
