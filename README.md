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
    __v?: Number,   // Document version
}
// Fields marked with a * mark are to be implemented in forthcoming versions.
```

### Creating a user

**Request structure:**

```js
/**
 * @method {POST}
 * @path {/accounts}
 * @requires `user-agent`
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
| 403 | No user-agent |
| 403 | Device already in use |
| 409 | Email already in use |
| 412 | Validation failure message |
| 500 | Couldn't create user: (error message) |
| 500 | Couldn't add client |

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
 * @path {/accounts}
 * @required `access-token` `device-id`
 * @body {none}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 401 | No access-token |
| 401 | Invalid token |
| 403 | No device-id |
| 404 | Client doesn't exist |
| 500 | any |

**Note**

* This route always responds with **user-profile** pattern (if no error)

> Example: `[GET] http://domain.com/accounts`

***

### Verifying user (OTP)

**Request structure**

```js
/**
 * @method {GET}
 * @path {/accounts/verify/otp}
 * @body {none}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 400 | Unrecognized user-agent |

* This route doesn't send any data with response (if no error)

> Example: `[GET] http://domain.com/accounts/verify/otp`

***

### Verifying user (OTP)

**Request structure**

```js
/**
 * @method {POST}
 * @path {/accounts/verify/otp}
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
 * @path {/accounts/verify/email}
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
 * @path {/accounts/verify/email}
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

### Deleting user

**Request structure**

```js
/**
 * @method {DELETE}
 * @path {/accounts}
 * @body {x-www-form-urlencoded}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 400 | Unrecognized user-agent |

**Note**

* This route always has a blank response (if no error)

> Example: `[DELETE] http://domain.com/accounts`

***