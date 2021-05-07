# REST API structure

## Table of contents

- [REST API structure](#rest-api-structure)
  - [Table of contents](#table-of-contents)
  - [Disclaimer](#disclaimer)
  - [Common Response Patterns](#common-response-patterns)
    - [1. Client Access Document Pattern](#1-client-access-document-pattern)
    - [2. User Profile Document Pattern](#2-user-profile-document-pattern)
    - [3. OTP Request Document Pattern](#3-otp-request-document-pattern)
  - [Accounts Management](#accounts-management)
    - [1. Creating a user](#1-creating-a-user)
    - [2. Request OTP verification (phone)](#2-request-otp-verification-phone)
    - [3. OTP Verification (phone)](#3-otp-verification-phone)
    - [4. Request OTP verification (email)](#4-request-otp-verification-email)
    - [5. OTP Verification (email)](#5-otp-verification-email)
    - [6. Fetching user](#6-fetching-user)
    - [7. User updation](#7-user-updation)
    - [8. User authentication (signin)](#8-user-authentication-signin)
    - [9. User authentication (signout)](#9-user-authentication-signout)
    - [10. Request OTP signin (Forgot password)](#10-request-otp-signin-forgot-password)
    - [11. OTP signin (Forgot password)](#11-otp-signin-forgot-password)
    - [12. User deletion](#12-user-deletion)
    - [13. User picture upload](#13-user-picture-upload)
  - [Family Management](#family-management)
    - [creating a family member](#creating-a-family-member)
    - [fetch all family members](#fetch-all-family-members)
    - [delete a family member](#delete-a-family-member)
    - [edit/update a family member](#editupdate-a-family-member)

## Disclaimer

* This is a common instruction for all of the routes documented below other than *signin* and *user registration* route. 
* Always hydrate request headers with Client details obtained after user creation or authentication. 
* Hydrate `access-token` with the provided access token.
* Hydrate `device-id`  with the provided deviceid.

## Common Response Patterns

### 1. Client Access Document Pattern
```js
{
    _id: String,    // The 24-char device-id
    user: String,   // The 24-char userid
    userAgent?: String,   // The user-agent of the client device
    token: String,  // The access_token
    createdAt: Date,    // Date of login
    updatedAt?: Date,    // Same as createdAt
    __v?: Number,   // Document version
}
// Fields marked with a ? mark aren't important.
```

### 2. User Profile Document Pattern
```js
{
    _id: String,    // The 24-char userid
    email: String,  
    phone: String,  
    firstName:String,
    lastName:String,
    gender:String,
    dateOfBirth:Date,
    bloodGroup:String,
    address:String,
    insurance:String,
    emergencyName:String,
    emergencyNumber:String,
    phoneVerified: boolean, // OTP verification status
    emailVerified: boolean, // Email verification status
    createdAt: Date,    // Date of account creation
    updatedAt: Date,    // Date of last account updation
    __v?: Number,   // Document version
}
// Fields marked with a ? mark aren't important.
```

### 3. OTP Request Document Pattern
```js
{
    _id: String,    // The 24-char requestId
    user: String,   // The 24-char userId
    createdAt: Date,    // Date of account creation
    updatedAt: Date,    // Date of last account updation
    __v?: Number,   // Document version
}
// Fields marked with a ? mark aren't important.
```

## Accounts Management

* Accounts service is provided through the `/accounts` route.
* The responses from this route has only 2 common patterns.
  * *Client access* pattern has the data to identify the device (access_token)
  * *User profile* pattern will be the user profile.

### 1. Creating a user

**Request structure:**

```js
/**
 * @method {POST}
 * @path {/accounts}
 * @headers `user-agent`
 * @param {none}
 * @body {x-www-form-urlencoded}
 * */
{
    email: String,
    password: String,
    phone: String,   
}
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `401`  | Operation requires `access-token` |
| `403`  | Operation requires `device-id` |
| `403`  | Operation requires `user-agent` |
| `409` | User already exists |
| `406` | Validation failed: (error message) |
| `500` | Couldn't create user |
| `500` | Couldn\'t register client |

**Note**

* This route always responds with [CAD](#1-client-access-document-pattern) along with a status code `201 Created` (if no errors).
* This route doesn't require header hydration.

> Example: `[POST] https://skinmate.herokuapp.com/accounts`

***


### 2. Request OTP verification (phone)

**Request structure**

```js
/**
 * @method {GET}
 * @path {/accounts/verify/phone}
 * @headers `access-token` `device-id`
 * @param {none}
 * @body {none}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 401 | Operation requires `access-token` |
| 403 | Operation requires `device-id` |
| 500 | Couldn\'t verify your identity |
| 500 | Couldn't find user |
| 500 | Couldn't generate OTP |
| 500 | Couldn't send OTP |

**Note**

* This route responds with [OTPRD](#3-otp-request-document-pattern) to identify user for the requested OTP (if no error).
* A OTP code will be sent to the associated phone number.
* Both the `_id` and OTP received is used to proceed with verification.

> Example: `[GET] https://skinmate.herokuapp.com/accounts/verify/phone`

***

### 3. OTP Verification (phone)

**Request structure**

```js
/**
 * @method {POST}
 * @path {/accounts/verify/phone}
 * @headers `access-token` `device-id`
 * @body {x-www-form-urlencoded}
 * */
{
    requestId: string, // Obtained from verify OTP GET method (_id)
    code: Number,   // OTP to be verified
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 401 | Operation requires `access-token` |
| 403 | Operation requires `device-id` |
| 500 | Couldn\'t verify your identity |
| 500 | Couldn't find user |
| 500 | Couldn\'t find OTP in registry |
| 401 | Invalid OTP |

**Note**

* This route responds with *"{phone_number} is now verified"* message if OTP is send before the expiry window.

> Example: `[POST] https://skinmate.herokuapp.com/accounts/verify/phone`

***

### 4. Request OTP verification (email)

**Request structure**

```js
/**
 * @method {GET}
 * @path {/accounts/verify/email}
 * @param {none}
 * @body {none}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 401 | Operation requires `access-token` |
| 403 | Operation requires `device-id` |
| 500 | Couldn\'t verify your identity |
| 500 | Couldn't find user |
| 500 | Couldn't generate OTP |
| 500 | Couldn't send OTP |

**Note**

* This route responds with [OTPRD](#3-otp-request-document-pattern) to identify user for the requested OTP (if no error).
* A OTP code will be sent to the associated email address.
* Both the `_id` and OTP received is used to proceed with verification.

> Example: `[GET] https://skinmate.herokuapp.com/accounts/verify/email`

***

### 5. OTP Verification (email)

**Request structure**

```js
/**
 * @method {POST}
 * @path {/accounts/verify/email}
 * @body {x-www-form-urlencoded}
 * */
{
    requestId: String, // The 24-char requestId
    code: Number    // OTP to be verified
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 401 | Operation requires `access-token` |
| 403 | Operation requires `device-id` |
| 500 | Couldn\'t verify your identity |
| 500 | Couldn't find user |
| 500 | Couldn\'t find OTP in registry |
| 401 | Invalid OTP |

**Note**

* This route responds with *"{email} is now verified"* message if OTP is send before the expiry window.

> Example: `[POST] https://skinmate.herokuapp.com/accounts/verify/email`

***

### 6. Fetching user

**Request structure**

```js
/**
 * @method {GET}
 * @path {/accounts}
 * @headers `access-token` `device-id`
 * @param {none}
 * @body {none}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 401 | Operation requires access-token |
| 403 | Operation requires device-id |
| 500 | Couldn't verify your identity |
| 500 | Couldn't find user |
| 401 | Unauthorized client |
| 401 | Phone and email not verified |
| 401 | Phone number not verified |
| 401 | Email not verified |

**Note**

* Only verified users can access this route.
* This route always responds with [UPD](#2-user-profile-document-pattern) pattern (if no error)

> Example: `[GET] https://skinmate.herokuapp.com/accounts`

***

### 7. User updation

**Request structure**

```js
/**
 * @method {PATCH}
 * @path {/accounts}
 * @headers `access-token` `device-id`
 * @param {none} 
 * @body {x-www-form-urlencoded}
 * */
{ 
    firstName: String,
    lastName: String,
    gender: String, // "male", "female", "others"
    dateOfBirth: Date,
    bloodGroup: String,
    address: String,
    insurance: String,
    emergencyName: String,
    emergencyNumber: String
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 401 | Operation requires access-token |
| 403 | Operation requires device-id |
| 403 | Requires access-token |
| 500 | Couldn't verify your identity |
| 500 | Couldn't find user |
| 401 | Unauthorized client |
| 401 | Phone number not verified |
| 406 | Validation failed: (forbidden fields) |
| 500 | Couldn't update user |

**Note**

* Expects phone number to be priorly verified.
* This route always responds with [UPD](#2-user-profile-document-pattern) pattern (if no error)

> Example: `[PATCH] https://skinmate.herokuapp.com/accounts`


***

### 8. User authentication (signin)

**Request structure**

```js
/**
 * @method {POST}
 * @path {/accounts/auth}
 * @headers `user-agent`
 * @param {none}
 * @body {x-www-form-urlencoded}
 * */
{
    email: String, // or
    phone: String  // this
    password:String
 }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 403 | Requires user-agent |
| 404 | Account not found |
| 500 | Couldn\'t verify password |
| 401 | Incorrect password |
| 500 | Couldn\'t authenticate |



**Note**

* This route always responds with [CAD](#1-client-access-document-pattern) (if no errors).
* This route doesn't require `access-token` or `device_id`.
* If `device-id` exists, pass it to remove any orphaned client access documents.

> Example: `[POST] https://skinmate.herokuapp.com/accounts/auth`


***

### 9. User authentication (signout)

**Request structure**

```js
/**
 * @method {PURGE}
 * @path {/accounts/auth}
 * @headers `access-token` `device-id`
 * @param {none} 
 * @body {none}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 403 | Requires access-token |
| 403 | Requires device-id |
| 500 | Couldn\'t sign you out |


**Note**

* This route always responds a message **You\'re signed out** (if no error)

> Example: `[PURGE] https://skinmate.herokuapp.com/accounts/auth`


***



### 10. Request OTP signin (Forgot password)

**Request structure**

```js
/**
 * @method {POST}
 * @path {/accounts/auth/request-otp-signin}
 * @headers `user-agent`
 * @body {x-www-form-urlencoded}
 * */
{
    email: String, // or
    phone: String
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 403 | Operation requires user-agent |
| 500 | Couldn\'t find user |
| 404 | User doesn\'t exist |
| 500 | Couldn\'t generate OTP |
| 500 | Couldn\'t send OTP |

**Note**

* This route always responds with [OTPRD](#3-otp-request-document-pattern) (if no error)
* Sends OTP to phone or email based on the request body given.

> Example: `[POST] https://skinmate.herokuapp.com/accounts/auth/request-otp-signin`


***

### 11. OTP signin (Forgot password)

**Request structure**

```js
/**
 * @method {POST}
 * @path {/accounts/auth/otp-signin}
 * @headers `user-agent`
 * @body {x-www-form-urlencoded}
 * */
{
    requestId: String, // or
    code: String
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 403 | Operation requires user-agent |
| 500 | Couldn't find OTP in registry |
| 404 | OTP isn't available |
| 401 | Invalid OTP |
| 500 | Couldn't register client |

**Note**

* This route always responds with [CAD](#1-client-access-document-pattern) (if no errors)
* This request is same as email-password signin. Use the *Client Access Token* to login and update the password.
* Use [User Update](#7-user-updation) route to update the password.

> Example: `[POST] https://skinmate.herokuapp.com/accounts/auth/otp-signin`

***

### 12. User deletion 

**Request structure**

```js
/**
 * @method {DELETE}
 * @path {/accounts}
 * @headers `access-token` `device-id`
 * @param {none} 
 * @body {none}
 * */
{ }
```

**Possible errors**

| Status | Message |
| --: | --- |
| 403 | Requires access-token |
| 403 | Requires device-id |
| 500 | Couldn\'t validate access |
| 403 | Unrecognized device |
| 404 | Account not found |
| 500 | Couldn\'t delete user |

**Note**

* This route always responds a message *"Account deleted"* (if no errors)

> Example: `[DELETE] https://skinmate.herokuapp.com/accounts`


***

### 13. User picture upload

**Request structure**

```js
/**
 * @method {POST}
 * @path {/accounts/avatar}
 * @headers `access-token` `device-id`
 * @param {none} 
 * @body {x-www-form-data}
 * */
{ 
    file: Buffer // 1:1 jpeg/jpg/png image
}      


```

**Possible errors**

| Status | Message |
| --: | --- |
| 403 | Requires access-token |
| 403 | Requires device-id |
| 403 | Unrecognized device |
| 404 | Account not found |


**Note**

*  This route always responds a message **avatar uploaded** (if no error)

> Example: `[POST] https://skinmate.herokuapp.com/accounts/avatar`


***


## Family Management

### creating a family member 

**Request structure**

```js
/**
 * @method {POST}
 * @path {/familymember}
 * @headers `access-token` `device-id`
 * @param {none} 
 * @body {x-www-form-urlencoded}
 * */
{ 
    firstName:String,
    lastName:String,
    relationship:String,
    gender:String,
    dateOfBirth:Date,
    bloodGroup:String,
    address:String,
    insurance:String,
    emergencyName:String,
    emergencyNumber:String
      
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 403 | Requires access-token |
| 403 | Requires device-id |
| 403 | Unrecognized device |
| 404 | Account not found |


**Note**

* This route always responds with  **family member created** pattern (if no error)

> Example: `[POST] https://skinmate.herokuapp.com/familymember`

***

### fetch all family members

**Request structure**

```js
/**
 * @method {GET}
 * @path {/familymember/all}
 * @headers `access-token` `device-id`
 * @param {none} 
 * @body {none}
 * */
{
     
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 403 | Requires access-token |
| 403 | Requires device-id |
| 403 | Unrecognized device |
| 404 | Account not found |
| 404 |family members not found |


**Note**

* This route always responds with  **family members of the user** pattern (if no error)

> Example: `[GET] https://skinmate.herokuapp.com/familymember/all`

***

### delete a family member

**Request structure**

```js
/**
 * @method {DELETE}
 * @path {/familymember/:id}
 * @headers `access-token` `device-id`
 * @param {:id:} 
 * @body {none}
 * */
{
     
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 403 | Requires access-token |
| 403 | Requires device-id |
| 403 | Unrecognized device |
| 404 | Account not found |
| 404 |family member not found |


**Note**

* This route always responds with  message **family member deleted** pattern (if no error)

> Example: `[DELETE] https://skinmate.herokuapp.com/familymember/:id`

***

### edit/update a family member

**Request structure**

```js
/**
 * @method {PATCH}
 * @path {/familymember/:id}
 * @param {:id:} 
 * @headers `access-token` `device-id`
 * @body {x-www-form-urlencoded}
 * */
{
     firstName:String, 
    lastName:String,
    relationship:String,
    gender:String,
    dateOfBirth:Date,
    bloodGroup:String,
    address:String,
    insurance:String,
    emergencyName:String,
    emergencyNumber:String
}
```

**Possible errors**

| Status | Message |
| --: | --- |
| 403 | Requires access-token |
| 403 | Requires device-id |
| 403 | Unrecognized device |
| 404 | Account not found |
| 404 |family member not found |
| 500 | invalid property  |


**Note**

* This route always responds with  **updated family member** pattern (if no error)

> Example: `[PATCH] https://skinmate.herokuapp.com/familymember/:id`

***
