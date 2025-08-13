Feature: Wholesale Price Functionality
  As an admin and wholesale customer
  I want to verify that wholesale prices work correctly
  So that wholesale customers are charged the correct price

  Background:
    Given I am logged in as admin in WordPress dashboard

  Scenario: Create Product with Wholesale Price
    When I create a new product "Test Product" with regular price "500000", sale price "495000", and wholesale price "490000"
    Then the product "Test Product" should be saved with correct prices

  Scenario: Create Wholesale Customer
    When I create a wholesale customer with username "wholesaleuser" and email "wholesale@example.com"
    Then the user "wholesaleuser" should exist with role "Wholesale Customer"

  Scenario: Verify Wholesale Price Display and Cart Functionality
    Given I log out from WordPress
    And I log in as wholesale customer with username "wholesaleuser" and password "password123"
    When I view the shop page
    Then the product "Test Product" should display wholesale price "490.000" in shop
    When I add the product "Test Product" to the cart
    And I view the cart page
    Then the product "Test Product" should display wholesale price "490.000" in cart