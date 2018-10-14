# Auth0 Progressive Profiling User Interface Library (auth0pp.js)

A drop-in JavaScript library allowing JavaScript applications to progressively gather configurable information from
Auth0 users with data saved to the Auth0 profile.

## Install

From remote minified library

```html
<script src="http://karlespe-auth0.s3-website-us-east-1.amazonaws.com/progressive-profile.min.js"></script>
```

### Initialize

```js
var progressiveProfile = new auth0pp.ProgressiveProfile({
  domain: "{YOUR_AUTH0_DOMAIN}",
  token: "{AUTH0_AUTHENTICATED_USER_ACCESS_TOKEN}"
});
```

Parameters:
- **domain {REQUIRED, string}**: Your Auth0 account domain such as `'example.auth0.com'` or `'example.eu.auth0.com'`.
- **clientID {REQUIRED, string}**: The Client ID found on your Application settings page

## Build Source

Clone this repository from Github and then run...

```sh
npm install
```

## Run the Sample Application

```sh
npm run dev
```
The application will be served at http://localhost:8080.


