require("dotenv").config();
const { Builder, By, until } = require("selenium-webdriver");
const { loginAndReturnDriver } = require("../../../utils/loginUtil");

async function testAddingCart() {
    let driver = await loginAndReturnDriver();
    let result = { name: "Adding dish and topping to Cart", status: "Failed" };

    try {
        // Find and click the store
        const storeCard = await driver.wait(
            until.elementLocated(By.xpath("//h4[text()='Tasty Bites']")),
            5000
        );
        await storeCard.click();
        console.log("✅ Clicked 'Tasty Bites' store");

        // Wait for the restaurant page to load
        await driver.wait(until.urlContains("/restaurant/"), 5000);
        console.log("✅ Redirected to restaurant page");

        // Click the first available dish
        const firstDish = await driver.wait(
            until.elementLocated(By.name("bigDishCard")),
            5000
        );
        await firstDish.click();
        console.log("✅ Clicked the first DishBigCard");

        // Wait for dish page and validate URL
        await driver.wait(until.urlMatches(/\/restaurant\/[a-f0-9]{24}\/dish\/[a-f0-9]{24}$/), 5000);
        console.log("✅ Redirected to dish page");

        const toppingCheckbox = await driver.wait(
            until.elementLocated(By.name("checkedBtn")),
            5000
        );
        await toppingCheckbox.click();
        console.log("✅ Selected a topping");

        // Click 'Add to Cart' button
        const addTocartBtn = await driver.wait(
            until.elementLocated(By.name("addCartBtn")),
            5000
        );
        await addTocartBtn.click();
        console.log("✅ Added dish to cart");

        const cartDetailBtn = await driver.wait(
            until.elementLocated(By.name("cartDetailBtn")),
            5000
        );
        await cartDetailBtn.click();
        console.log("✅ Go to Cart detail");


        await driver.wait(until.urlMatches(/\/restaurant\/[a-f0-9]{24}\/cart\/[a-f0-9]{24}$/), 5000);
        console.log("✅ Redirected to cart detail page");

        // Done


        // Verify dish is in the cart
        const cartDish = await driver.wait(
            until.elementLocated(By.xpath("//h4[contains(@class,'cart-item-dish-name')]")),
            5000
        );
        const dishText = await cartDish.getText();
        if (dishText.includes("Dish Name")) { // Change this to match the actual dish name
            console.log("✅ Dish found in the cart");
        } else {
            throw new Error("❌ Dish not found in cart");
        }

        // Verify topping is in the cart
        const cartTopping = await driver.wait(
            until.elementLocated(By.xpath("//span[contains(@class,'cart-item-topping-name')]")),
            5000
        );
        const toppingText = await cartTopping.getText();
        if (toppingText.includes("Topping Name")) { // Change this to match actual topping name
            console.log("✅ Topping found in cart");
        } else {
            throw new Error("❌ Topping not found in cart");
        }

        // Verify the total price
        const totalPriceElement = await driver.wait(
            until.elementLocated(By.className("cart-total-price")),
            5000
        );
        const totalPrice = await totalPriceElement.getText();
        if (totalPrice.includes("Expected Price")) { // Change this to expected price
            console.log("✅ Price is correct");
        } else {
            throw new Error("❌ Price mismatch");
        }

        result.status = "Passed";
    } catch (error) {
        console.error(`❌ ${result.name} Failed:`, error);
    } finally {
        await driver.quit();
    }

    return result;
}

module.exports = { testAddingCart };
