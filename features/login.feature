Feature: Login action

As a user
I want to login into application

Scenario: login with valid credentials
Given I visit a login page
When I fill the login form with valid credentials
Then I should see the home page

Scenario: login with invalid credentials
Given I visit a login page
When I fill the login form with invalid credentials
Then I should see an error 
And should not be logged in

Scenario: login with XSS injection attack
Given I visit a login page
When I fill the login form with XSS injection scripts
Then The fields should reject the input
