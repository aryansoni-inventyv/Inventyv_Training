Feature: User Registration
  
  Scenario Outline: Register new users
    Given I open the registration page
    When I enter first name "<firstName>"
    And I enter last name "<lastName>"
    And I enter email "<email>"
    And I enter password "<password>"
    And I click register button
    Then I should see "<message>"

    Examples:
      | firstName | lastName | email                | password    | message                  |
      | John      | Doe      | john@example.com     | Pass123     | Registration Successful  |
      | Sarah     | Smith    | sarah@example.com    | Pass456     | Registration Successful  |
      | Mike      | Johnson  | mike@example.com     | Pass789     | Registration Successful  |