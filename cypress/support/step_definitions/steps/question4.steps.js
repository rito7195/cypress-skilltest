Given('I log in using {string} and {string}', (username, password) => {
  cy.visit('/my-account');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  //missing submission action
});

Given('I open the {string} page', (url) => {
  cy.visit(url);
});

Given('I add {int} products to the cart', (quantity) => {
  for (let i = 0; i < quantity; i++) {
    cy.get('button[name="add-to-cart"]').click(); //add a delay between click to avoid flaky test
  }
});

Then('the Test Product should have {int} quantity', (quantity) => {
  cy.get('.wp-block-woocommerce-cart')
    .contains('Test Product') //productName can be parameterized for easier maintenance
    .parents('td')
    .within(() => {
      cy.get('.wc-block-components-quantity-selector input').should('have.value', quantity); //locator can be enhanced for easier readability and maintenance
    });
});