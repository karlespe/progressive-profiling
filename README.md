# Auth0 Progressive Profiling User Interface Library

A drop-in JavaScript library allowing JavaScript applications to progressively gather responses to pre-configured questions
from Auth0 users. Responses to the questions are saved to the logged-in user's Auth0 profile as "user metadata".


## Prerequisite

A prerequisite to a JavaScript application using the Progressive Profiling library and user interface
 is that an Auth0 user is already signed in, for example via Auth0's [Auth0.js](https://auth0.com/docs/hosted-pages/login/auth0js "Auth0.js") library. An Auth0
[Access Token](https://auth0.com/docs/tokens/access-token "Auth0 Access Token") (representing an Auth0 user's authentication/authorization) must be obtained by the application using the library
prior to initializing the Progressive Profiling utility. That token must be issued against the Auth0 [User Management API](https://auth0.com/docs/api/management/v2 "Auth0 User Management API") audience.
[The Auth0 Management API is automatically defined as a resource server on your Auth0 domain.](https://manage.auth0.com/#/apis/management/settings "User Management API Settings")
The [API Scopes](https://auth0.com/docs/scopes/current/api-scopes "Auth0 API Scopes") used to request the token must
include the `read:current_user`, `create:current_user_metadata`, and `update:current_user_metadata` scope values. See the
[API Scopes](https://auth0.com/docs/scopes/current/api-scopes "Auth0 API Scopes") documentation for more information on
API scopes.

An example of authenticating with Auth0's `Auth0.js` library follows.

```js
<script src="https://cdn.auth0.com/js/auth0/9.5.1/auth0.min.js"></script>
<script type="text/javascript">
var webAuth = new auth0.WebAuth({
        domain: "example.auth0.com",
        clientID: "abc123DEF456ghi789",
        audience: 'https://example.auth0.com/api/v2/',
        redirectUri: 'http://example.com/callback.html',
        responseType: 'token id_token code',
        scope: 'openid profile read:current_user create:current_user_metadata update:current_user_metadata'
      });
      webAuth.authorize();
</script>
```

The `redirectUri` URL will be augmented by Auth0 with the Access Token to be used with the Progressive Profiling library once
the user authenticates with Auth0.

## Install

From remote minified library

```html
<script src="http://karlespe-auth0.s3-website-us-east-1.amazonaws.com/progressive-profile.min.js"></script>
```

Or clone this Github repository and [build the minified library with Node](#build-the-minified-library "build the minified library locally with Node").

### Initialize

_Please note that the namespace for this library is currently `auth0pp`
(e.g. `.. new auth0pp.ProgressiveProfile({}) ...`), not to be confused with the Auth0 JavaScript library `auth0` namespace._

```js
var progressiveProfile = new auth0pp.ProgressiveProfile({
  domain: "{YOUR_AUTH0_DOMAIN}",
  token: "{AUTH0_AUTHENTICATED_USER_ACCESS_TOKEN}",
  questionsPerProfilingStep: {NUMBER_OF_QUESTIONS_PRESENTED_PER_SCREEN},
  questions: {QUESTIONS}
});
```

Parameters:
- **domain {REQUIRED, string}**: Your Auth0 account domain such as `'example.auth0.com'` or `'example.eu.auth0.com'`.
- **token {REQUIRED, string}**: The Auth0 user Access Token provided by Auth0's authentication service. [See Prerequisite](#prerequisite "See Prerequisite")
 regarding the scopes required in the Access Token.
- **questionsPerProfilingStep {REQUIRED, integer}**: The number of questions to appear each time the Progressive Profiling screen is presented to the Auth0 user.
- **questions {REQUIRED, array}**: All of the questions to be asked of the user.

The **questions** `Array` consists of a series of JavaScript object literals with `key`, `text`, and (optionally) `options`
properties and values.

For example, take the following `ProgressiveProfile` initialization.

```js
var progressiveProfile = new auth0pp.ProgressiveProfile({
  domain: 'example.auth0.com',
  token: '...aBcdEfG...',
  questionsPerProfilingStep: 2,
  questions: [
    {
      key: "job_title",
      text: "What is your job title?"
    },
    {
      key: "employer",
      text: "What is the name of your employer?"
    },
    {
      key: "product_interest",
      text: "Are you interested in this new product?",
      options: ["Yes", "Nope", "Maybe"]
    },
    {
      key: "decision",
      text: "When will you make a decision about it?",
      options: ["This week", "Next week", "Next month", "Later"]
    }
  ]
});
```

The first time `progressiveProfile.show();` is executed the following two (`questionsPerProfilingStep: 2`) questions will be displayed in a modal over your
application's content.

![Question Display Step 1](https://content.screencast.com/users/karlespe/folders/Jing/media/db5bd060-6e9b-4647-afe6-8847b3b36845/00000698.png)

Assuming the user responds to the questions, the next time `progressiveProfile.show();` is executed the following two questions will be displayed in a modal over your application's content.

![Question Display Step 2](https://content.screencast.com/users/karlespe/folders/Jing/media/93f39798-b5f0-41a8-b1fe-5fa8ad7e0b6a/00000699.png)

### Show the User Interface

```js
progressiveProfile.show(callback);
```

Parameters:
- **callback {function}**: A callback function triggered on error or when the Progressive Profiling user interface closes.

The `show` method prompts a user interface modal to display if there are remaining unanswered questions available for
which the user should respond. If all questions have been responded to by the user, the `show` method will
effectually do nothing.

The `show` method accepts a `callback` parameter. The `callback` function accepts two parameters `error` and `user`. `error` is
a `String` containing an error message. `user` is a JavaScript object containing the updated Auth0 user record including
newly updated user metadata capture in the Progressive Profiling component.

e.g.

```js
progressiveProfile.show(function(error, user) {
  if (error) {
    console.log(error);
  } else if (user) {
    console.log(JSON.stringify(user, undefined, 2));
  } else {
    console.log('Progressive Profiling component closed by the user with no action.');
  }
});
```

## Sample Application

A sample application is included to help you get started quickly.

### Install the source and Sample Application

Clone this repository from Github and then run the following.

```sh
npm install
```

### Run the Sample Application

```sh
npm run dev
```
The application will be served at http://localhost:8080.

Update the vanilla JavaScript in the `index.html` with your Auth0
tenant details (`domain` and `clientID`). Update the vanilla JavaScript in `callback.html` to configure the
questions to which users will respond ([See Examples](#initialize "See Examples")).

### Run the automated test suite

```sh
npm run test
```

### Build the minified library

```sh
npm run build
```

The minified JavaScript library will be created in a single file in `/dist/progressive-profile.min.js`.



