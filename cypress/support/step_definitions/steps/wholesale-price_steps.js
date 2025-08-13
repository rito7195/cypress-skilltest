import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const adminUrl = "/wp-admin";
const shopUrl = "/shop";
const cartUrl = "/cart";

// Login as admin
Given("I am logged in as admin in WordPress dashboard", () => {
  cy.visit("/wp-login.php");
  cy.get("#user_login").click().type(Cypress.env("adminUsername"));
  cy.get("#user_pass").click().type(Cypress.env("adminPassword"), { log: false });
  cy.get("#wp-submit").click();
  cy.url().should("include", adminUrl);
});

// Create product
When(
  "I create a new product {string} with regular price {string}, sale price {string}, and wholesale price {string}",
  (name, regularPrice, salePrice, wholesalePrice) => {
    cy.get("#menu-posts-product").click();
    cy.contains("Add new product").click();

    cy.get("#title").type(name);
    //cy.get("textarea#content").type("This is a test product for wholesale price validation."); //Can't interact with textarea, no solution yet

    cy.get("#_regular_price").type(regularPrice);
    cy.get("#_sale_price").type(salePrice);

    cy.get('#wholesale_customer_wholesale_price').type(wholesalePrice);
    cy.get("input#publish").should("be.enabled").click();
    cy.contains("Product published", { timeout: 10000 }).should("exist");
  }
);

Then(
  "the product {string} should be saved with correct prices",
  (name) => {
    cy.get('a').contains('All Products').click();
    cy.contains(name).should("exist");
    cy.get('tr').contains(name).get('td[data-colname="Price"] del span.woocommerce-Price-amount').should("contain.text", "500.000")
    cy.get('tr').contains(name).get('td[data-colname="Price"] ins .woocommerce-Price-amount').should("contain.text", "495.000")
    cy.get('tr').contains(name).get('span.wholesale_price_title + ins span.woocommerce-Price-amount').should("contain.text", "490.000")
  }
);

// Create wholesale customer
When(
  "I create a wholesale customer with username {string} and email {string}",
  (username, email) => {
    cy.get("#menu-users").click();
    cy.contains("Add User").click();

    cy.get("#user_login").click().type(username);
    cy.get("#email").type(email);
    cy.get("#first_name").type("Wholesale");
    cy.get("#last_name").type("Customer");
    cy.get("#pass1").clear().type("password123");
    cy.get(".pw-checkbox").click()
    cy.get("#role").select("Wholesale Customer");

    cy.get("#createusersub").click();
  }
);

Then("the user {string} should exist with role {string}", (username, role) => {
  cy.contains(username, { timeout: 10000 })
    .parents("tr")
    .within(() => {
      cy.contains(role).should("exist");
    });
});

// Login / logout
Given("I log out from WordPress", () => {
  cy.visit("/my-account");
  cy.get("a").contains("Log out").click();
});

Given(
  "I log in as wholesale customer with username {string} and password {string}",
  (username, password) => {
    cy.visit("/my-account");
    cy.get('#username').type(username);
    cy.get('#password').type(password, { log: false });
    cy.get('button[name="login"]').click();
  }
);

// Verify price in shop
When("I view the shop page", () => {
  cy.visit(shopUrl);
});

Then(
  "the product {string} should display wholesale price {string} in shop",
  (product, wholesalePrice) => {
    cy.contains(product)
      .parents(".product")
      .within(() => {
        cy.get("span.wholesale_price_title + ins span.woocommerce-Price-amount").contains(wholesalePrice).should("exist");
      });
  }
);

// Add to cart and verify
When("I add the product {string} to the cart", (product) => {
  cy.contains(product)
    .parents(".product")
    .within(() => {
      cy.contains("Add to cart").click();
    });
});

When("I view the cart page", () => {
  cy.visit(cartUrl);
});

Then(
  "the product {string} should display wholesale price {string} in cart",
  (product, wholesalePrice) => {
    cy.contains(product)
      .parents("tr")
      .within(() => {
        cy.contains(wholesalePrice).should("exist");
      });
  }
);