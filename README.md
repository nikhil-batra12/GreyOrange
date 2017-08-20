# Star Wars App

This app is used to login a user and search planets. It makes use of https://swapi.co for APIs.

## Technologies used
- Frontend: HTML, CSS, Angulajs(1.5.0) and bootstrap.
- Backend: Nodejs, Express

## To run the app
    npm start
This runs `npm install`, `bower install` and `node app.js` internally to start the project.

## Live demo
The app is deployed on heroku and can be accessed using the url "http://nikhil-greyorange-app.herokuapp.com/".

## Functionalities
- Authenticate user(with password as birth_year), where both the fields are required to be filled.
- Search for planets(15 searches allowed for users except LUKE SKYWALKER who can search as many times as he wants).
- When a new search call is sent, previous one is canceled to maintain consistency of results.
- By default, first 10 search results of planets is shown. User can get more results by clicking "Get More Resuts" button.
- User can refresh "Dashboard" page and will be logged in using data stored in localstorage.
- User can log out of app using "Log out" button on top right corner.

## Login Credentials
- Luke Skywalker/19BBY
- R2-D2/33BBY
