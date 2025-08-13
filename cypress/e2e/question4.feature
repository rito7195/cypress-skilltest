Feature: Check cart page
    As a user
    I want to check the product added to cart

    Background:
        Given I log in using "customer_account" and "test" //username and password can be parameterized and stored in env

    Scenario:
        Given I open the "http://my-site.test/product/test-product/" page //url can be parameterized for easier maintenance
        Given I add 5 products to the cart
        When I open the "http://my-site.test/cart" page //url can be parameterized for easier maintenance
        Then the Test Product should have 5 quantity //productName can be parameterized for easier maintenance