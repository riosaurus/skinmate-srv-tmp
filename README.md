# REST API structure

> ## Disclaimer
> * This is a common intruction for all of the routes documented below other than *signin* and *user registration* route.
> 
> * Always hydrate request headers with Client details obtained after user creation or authentication.
> 
> * Hydrate `access-token` with the provided access token.
> * Hydrate `device-id`  with the provided deviceid.

## Accounts Management

* Accounts service is provided through the `/accounts` route.
* The responses from this route has only 2 common patterns.
  * *Client access* pattern has the data to identify the device (access_token)
  * *User profile* pattern will be the user profile.

```js
/* Client access response pattern */
{
    _id: String,    // The 24-char deviceid
    user: String,   // The 24-char userid
    userAgent?: String,   // The user-agent of the client device
    token: String,  // The access_token
    createdAt: Date,    // Date of login
    updatedAt?: Date,    // Same as createdAt
    __v?: Number,   // Document version
}
// Fields marked with a ? mark aren't important for other requests to be fed.
```

```js
/* User profile response pattern */
{
    _id: String,    // The 24-char userid
    email: String,  // The user-agent of the client device
    phone: String,  // The access_token
    address: Date,  // Date of login
    family*: Array,   // Array of family member details
    phoneVerified: boolean, // OTP verification status
    emailVerified: boolean, // Email verification status
    createdAt: Date,    // Date of account creation
    updatedAt: Date,    // Date of last account updation
}
// Fields marked with a * mark are to be implemented in forthcoming versions.
```

### Creating a user

**Request structure:**

```js
/**
 * @method {POST}
 * @path {/accounts}
 * @param {none}
 * @body {x-www-form-urlencoded}
 * */
{
    email: String,
    password: String,
    phone: String,
    address: String
}
```

**Possible errors:**

| Status | Message |
| --: | --- |
| 400 | Unrecognized user-agent |
| 409 | Email already in use |
| 412 | Validation failed (validation message) |
| 403 | Device already in use |
| 500 | User created; Failed to register device |
| 500 | Couldn't create user: (error message) |

**Note**

* This route always responds with **client-access** pattern (if no error).
* This route doesn't require header hydration.

> Example: `[POST] http://domain.com/accounts`

***

### Fetching user

**Request structure**

```js
/**
 * @method {GET}
 * @path {/accounts/:userid:}
 * @param {:userid:} A unique user identifier of length 24 chars
 * @body {none}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 400 | Unrecognized user-agent |

**Note**

* This route always responds with **user-profile** pattern (if no error)

> Example: `[GET] http://domain.com/accounts/608a27075ca1962a18eabd3a`

***

### Verifying user (OTP)

**Request structure**

```js
/**
 * @method {GET}
 * @path {/accounts/:userid:/verify/otp}
 * @param {:userid:} A unique user identifier of length 24 chars
 * @body {none}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 400 | Unrecognized user-agent |

* This route doesn't send any data with response (if no error)

> Example: `[GET] http://domain.com/accounts/608a27075ca1962a18eabd3a/verify/otp`

***

### Verifying user (OTP)

**Request structure**

```js
/**
 * @method {POST}
 * @path {/accounts/:userid:/verify/otp}
 * @param {:userid:} A unique user identifier of length 24 chars
 * @body {x-www-form-urlencoded}
 * */
{
    code: Number,   // OTP to be verified
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 400 | Unrecognized user-agent |

**Note**

* This route always responds with **user-profile** pattern (if no error)

> Example: `[GET] http://domain.com/accounts/608a27075ca1962a18eabd3a/verify/otp`

***

### Verifying user (email)

**Request structure**

```js
/**
 * @method {GET}
 * @path {/accounts/:userid:/verify/email}
 * @param {:userid:} A unique user identifier of length 24 chars
 * @body {none}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 400 | Unrecognized user-agent |

**Note**

* This route doesn't send any data with response (if no error)

> Example: `[GET] http://domain.com/accounts/608a27075ca1962a18eabd3a/verify/email`

***

### Verifying user (email)

**Request structure**

```js
/**
 * @method {POST}
 * @path {/accounts/:userid:/verify/email}
 * @param {:userid:} A unique user identifier of length 24 chars
 * @body {x-www-form-urlencoded}
 * */
{
    code: Number    // OTP to be verified
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 400 | Unrecognized user-agent |

**Note**

* This route always responds with **user-profile** pattern (if no error)

> Example: `[GET] http://domain.com/accounts/608a27075ca1962a18eabd3a/verify/email`

***
