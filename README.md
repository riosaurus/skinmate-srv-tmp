# SkinMate Backend

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)

## Table of contents

- [SkinMate Backend](#skinmate-backend)
  - [Table of contents](#table-of-contents)
  - [Disclaimer](#disclaimer)
  - [Common Response Patterns](#common-response-patterns)
    - [Client Access Document Pattern](#client-access-document-pattern)
    - [User Profile Document Pattern](#user-profile-document-pattern)
    - [OTP Request Document Pattern](#otp-request-document-pattern)
    - [Service Document Pattern](#service-document-pattern)
    - [Doctor Document Pattern](#doctor-document-pattern)
    - [Appointment Creation Pattern](#appointment-creation-pattern)
    - [Appointment Cancel and Reschedule Pattern](#appointment-cancel-and-reschedule-pattern)
  - [Accounts](#accounts)
    - [Creating a user](#creating-a-user)
    - [Request OTP verification (phone)](#request-otp-verification-phone)
    - [OTP Verification (phone)](#otp-verification-phone)
    - [Request OTP verification (email)](#request-otp-verification-email)
    - [OTP Verification (email)](#otp-verification-email)
    - [Fetching user](#fetching-user)
    - [User updation](#user-updation)
    - [User authentication (signin)](#user-authentication-signin)
    - [User authentication (signout)](#user-authentication-signout)
    - [Request OTP signin (Forgot password)](#request-otp-signin-forgot-password)
    - [OTP signin (Forgot password)](#otp-signin-forgot-password)
    - [User deletion](#user-deletion)
    - [User picture upload](#user-picture-upload)
  - [Services](#services)
    - [Creating a service](#creating-a-service)
    - [Fetching all services](#fetching-all-services)
    - [Fetching service details](#fetching-service-details)
    - [Deleting a service](#deleting-a-service)
  - [Doctors](#doctors)
    - [Creating a doctor](#creating-a-doctor)
    - [Fetching all services](#fetching-all-services-1)
    - [Fetching doctor details](#fetching-doctor-details)
    - [Deleting a doctor](#deleting-a-doctor)
  - [Appointment](#appointment)
    - [Creating an appointment](#creating-an-appointment)
    - [reschedule an appointment](#reschedule-an-appointment)
    - [cancel an appointment](#cancel-an-appointment)
  - [Family](#family)
    - [creating a family member](#creating-a-family-member)
    - [fetch all family members](#fetch-all-family-members)
    - [delete a family member](#delete-a-family-member)
    - [edit/update a family member](#editupdate-a-family-member)

## Disclaimer
- Always hydrate request headers with vital properties obtained from [Client Access Document](#client-access-document-pattern).
- All *responses* have common patterns. Follow up with the [Common Response Patterns](#common-response-patterns) listed below.
- All *error responses* will always be a `String` value describing the error occured supported by a more descriptive status code.

## Common Response Patterns

### Client Access Document Pattern
```js
{
    _id: String,    // The 24-char device-id
    user: String,   // The 24-char user-id
    userAgent?: String,   // The user-agent of the client device
    token: String,  // The access-token
    createdAt: Date,    // Date of login
    updatedAt?: Date,    // Same as createdAt
    __v?: Number,   // Document version
}
// Fields marked with a ? mark aren't important.
```

### User Profile Document Pattern
```js
{
    _id: String,    // The 24-char user-id
    email: String,  
    phone: String,  
    firstName: String,
    lastName: String,
    gender: String,
    dateOfBirth: Date,
    bloodGroup: String,
    address: String,
    insurance: String,
    emergencyName: String,
    emergencyNumber: String,
    elevatedAccess: Boolean
    phoneVerified: Boolean, // OTP verification status
    emailVerified: Boolean, // Email verification status
    createdAt: Date,    // Date of account creation
    updatedAt: Date,    // Date of last account updation
    __v?: Number,   // Document version
}
// Fields marked with a ? mark aren't important.
```

### OTP Request Document Pattern
```js
{
    _id: String,    // The 24-char requestId
    user: String,   // The 24-char user-id
    createdAt: Date,    // Date of account creation
    updatedAt?: Date,
    __v?: Number,   // Document version
}
// Fields marked with a ? mark aren't important.
```

### Service Document Pattern
```js
{
    _id: String,    // The 24-char serviceId
    name: String,   // Service id
    description: String,    // Service description
    createdAt: Date,    // Date of account creation
    updatedAt: Date,    // Date of last update
    __v?: Number,   // Document version
}
```

### Doctor Document Pattern
```js
{
    _id: String,    // 24-char doctorId
    name: String,
    email: String,
    phone: String,
    qualification: String,
    busySlots: [{
                 time:an array of String,
                 date:Date
                 }]
    __v: Number,    // Document version
}
```


### Appointment Creation Pattern
```js
{
    type : String,    // Type of service
    date: Date,       // Date of appointment
    time: String,     // Time of the appointment
    id: String        // 24-char appointment id
}
```

### Appointment Cancel and Reschedule Pattern
```js
{
    doctorName : String,    
    doctorEducation: Date,       
    appointmentDate: Date,     
    appointmentTime: String        
}
```

## Accounts

- Accounts service is provided through the `/accounts` route.
- [User Profile Document](#user-profile-document-pattern), [Client Access Document](#client-access-document-pattern) & [OTP Request Document](#otp-request-document-pattern) patterns are the only responses responded.

### Creating a user

```js
/**
 * @method {POST}
 * @path {/accounts}
 * @headers `user-agent`
 * @body {x-www-form-urlencoded}
 * */
{
    email: String,
    password: String,
    phone: String,   
}
```

**Possible errors**

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

* This route always responds with [Client Access Document](#client-access-document-pattern) along with a status code `201 Created`.
* This route doesn't require header hydration.

> Example: `[POST] https://skinmate.herokuapp.com/accounts`

***

### Request OTP verification (phone)

```js
/**
 * @method {GET}
 * @path {/accounts/verify/phone}
 * @headers `access-token` `device-id`
 * */
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

* This route responds with [OTP Request Document](#otp-request-document-pattern) to identify user for the requested OTP (if no error).
* A OTP code will be sent to the associated phone number.
* Both the `_id` and OTP received is used to proceed with verification.

> Example: `[GET] https://skinmate.herokuapp.com/accounts/verify/phone`

***

### OTP Verification (phone)

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

### Request OTP verification (email)

```js
/**
 * @method {GET}
 * @path {/accounts/verify/email}
 * @headers `access-token` `device-id`
 * */
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

* This route responds with [OTP Request Document](#otp-request-document-pattern) to identify user for the requested OTP (if no error).
* A OTP code will be sent to the associated email address.
* Both the `_id` and OTP received is used to proceed with verification.

> Example: `[GET] https://skinmate.herokuapp.com/accounts/verify/email`

***

### OTP Verification (email)

```js
/**
 * @method {POST}
 * @path {/accounts/verify/email}
 * @headers `access-id` `device-id`
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

### Fetching user

```js
/**
 * @method {GET}
 * @path {/accounts}
 * @headers `access-token` `device-id`
 * */
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
* This route always responds with [User Profile Document](#user-profile-document-pattern) pattern (if no error)

> Example: `[GET] https://skinmate.herokuapp.com/accounts`

***

### User updation

```js
/**
 * @method {PATCH}
 * @path {/accounts}
 * @headers `access-token` `device-id`
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
* This route always responds with [User Profile Document](#user-profile-document-pattern) pattern (if no error)

> Example: `[PATCH] https://skinmate.herokuapp.com/accounts`

***

### User authentication (signin)

```js
/**
 * @method {POST}
 * @path {/accounts/auth}
 * @headers `user-agent`
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

* This route always responds with [Client Access Document](#client-access-document-pattern).
* This route doesn't require `access-token` or `device_id`.
* If `device-id` exists, pass it to remove any orphaned client access documents.

> Example: `[POST] https://skinmate.herokuapp.com/accounts/auth`

***

### User authentication (signout)

```js
/**
 * @method {PURGE}
 * @path {/accounts/auth}
 * @headers `access-token` `device-id`
 * */
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

### Request OTP signin (Forgot password)

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

* This route always responds with [OTP Request Document](#otp-request-document-pattern) (if no error)
* Sends OTP to phone or email based on the request body given.

> Example: `[POST] https://skinmate.herokuapp.com/accounts/auth/request-otp-signin`

***

### OTP signin (Forgot password)

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

* This route always responds with [Client Access Document](#client-access-document-pattern)
* This request is same as email-password signin. Use the *Client Access Token* to login and update the password.
* Use [User Update](#user-updation) route to update the password.

> Example: `[POST] https://skinmate.herokuapp.com/accounts/auth/otp-signin`

***

### User deletion 

```js
/**
 * @method {DELETE}
 * @path {/accounts}
 * @headers `access-token` `device-id`
 * */
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

* This route always responds a message *"Account deleted"*

> Example: `[DELETE] https://skinmate.herokuapp.com/accounts`

***

### User picture upload

```js
/**
 * @method {POST}
 * @path {/accounts/avatar}
 * @headers `access-token` `device-id`
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

## Services

* Service of services is provided through the `/services` route.
* All operations under `/services` has a single response pattern [Service Document Pattern](#service-document-pattern)

### Creating a service

```js
/**
 * @adminOnlyRoute
 * @method {POST}
 * @path {/services}
 * @headers `access-token` `device-id`
 * @body {x-www-form-urlencoded}
 * */
{
    name: String,
    description: String,
    staff: [String],   // [doctor-id]
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
| `500` | Couldn't add service |
| `500` | Couldn\'t register client |

**Note**

- This is a **admin only** route.
- This route always responds with [Service Document](#service-document-pattern) along with a status code `201 Created`.

> Example: `[POST] https://skinmate.herokuapp.com/services`

***

### Fetching all services

```js
/**
 * @public
 * @method {GET}
 * @path {/services}
 * */
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `500` | Couldn't find service |

**Note**

- This is a **public** route. Can be accessed without any authorized restrictions.
- This route always responds with array of [Service Document](#service-document-pattern).

> Example: `[GET] https://skinmate.herokuapp.com/services`

***

### Fetching service details

```js
/**
 * @public
 * @method {GET}
 * @path {/services/:serviceId}
 * */
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `404` | No such service |
| `500` | Couldn\'t find service |

**Note**

- This is a **public** route. Can be accessed without any authorized restrictions.
- This route always responds with [Service Document](#service-document-pattern).

> Example: `[GET] https://skinmate.herokuapp.com/services/e73c5b37a8897c36b43f78c3`

***

### Deleting a service

```js
/**
 * @adminOnly
 * @method {DELETE}
 * @path {/services/:serviceId}
 * */
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `401`  | Operation requires `access-token` |
| `403`  | Operation requires `device-id` |
| `401` | Operation requires elevated privileges |
| `404` | No such service |
| `500` | Couldn\'t delete service |

**Note**

- This is a **admin only** route.
- This route always responds with *'Service deleted'* message.

> Example: `[DELETE] https://skinmate.herokuapp.com/services/e73c5b37a8897c36b43f78c3`

***

## Doctors

* Details on doctors is provided through the `/doctors` route.
* All operations under `/doctors` also has a single response pattern [Doctor Document Pattern](#doctor-document-pattern)

### Creating a doctor

```js
/**
 * @adminOnlyRoute
 * @method {POST}
 * @path {/doctors}
 * @headers `access-token` `device-id`
 * @body {x-www-form-urlencoded}
 * */
{
    name: String,
    description: String,
    staff: [String],   // [doctor-id]
}
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `401`  | Operation requires `access-token` |
| `403`  | Operation requires `device-id` |
| `403`  | Operation requires `user-agent` |
| `401` | Operation requires elevated privileges |
| `406` | Validation failed: (error message) |
| `500` | Couldn't add doctor |

**Note**

- This is a **admin only** route.
- This route always responds with [Doctor Document](#doctor-document-pattern) along with a status code `201 Created`.

> Example: `[POST] https://skinmate.herokuapp.com/doctors`

***

### Fetching all services

```js
/**
 * @public
 * @method {GET}
 * @path {/services}
 * */
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `500` | Couldn't find doctor |

**Note**

- This is a **public** route. Can be accessed without any authorized restrictions.
- This route always responds with array of [Service Document](#service-document-pattern).

> Example: `[GET] https://skinmate.herokuapp.com/services`

***

### Fetching doctor details

```js
/**
 * @public
 * @method {GET}
 * @path {/doctors/:doctorId}
 * */
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `404` | No such service |
| `500` | Couldn\'t find service |

**Note**

- This is a **public** route. Can be accessed without any authorized restrictions.
- This route always responds with [Doctor Document](#doctor-document-pattern).

> Example: `[GET] https://skinmate.herokuapp.com/doctors/e73c5b37a8897c36b43f78c3`

***


### Deleting a doctor

```js
/**
 * @adminOnly
 * @method {DELETE}
 * @path {/doctors/:doctorId}
 * */
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `401`  | Operation requires `access-token` |
| `403`  | Operation requires `device-id` |
| `401` | Operation requires elevated privileges |
| `404` | No such service |
| `500` | Couldn\'t delete service |

**Note**

- This is a **admin only** route.
- This route always responds with *'Service deleted'* message.

> Example: `[DELETE] https://skinmate.herokuapp.com/doctors/e73c5b37a8897c36b43f78c3`

***


## Appointment

### Creating an appointment

```js
/**
 * @adminOnlyRoute
 * @method {POST}
 * @path {/appointment/create}
 * @headers `access-token` `device-id`
 * */
{
    doctorid: String,       //
    ownerid: String,
    date:Date,
    time:[string].   //An array of string. Example ["7:00","7:15"]
}
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `401`  | Operation requires `access-token` |
| `403`  | Operation requires `device-id` |
| `403`  | Operation requires `user-agent` |
| `406` | Validation failed: (error message) |
| `500` | Couldn't add appointment |
| `500` | Couldn\'t register client |

**Note**

- This is a **admin only** route.
- This route always responds with [Appointment Creation Pattern](#Appointment Creation Pattern) along with a status code `201 Created`.

> Example: `[POST] https://skinmate.herokuapp.com/appointment/create`

***


### reschedule an appointment

```js
/**
 * @adminOnlyRoute
 * @method {PATCH}
 * @path {/appointment/reschedule/:id}
 * @headers `access-token` `device-id`
 * */
{
    date:Date,
    time:[string].   //An array of string. Example ["7:00","7:15"]
}
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `401`  | Operation requires `access-token` |
| `403`  | Operation requires `device-id` |
| `403`  | Operation requires `user-agent` |
| `406` | Validation failed: (error message) |
| `500` | Couldn\'t register client |

**Note**

- This is a **admin only** route.
- This route always responds with Appointment Reschedule Pattern(#service-document-pattern) along with a status code `200`.

> Example: `[POST] https://skinmate.herokuapp.com/appointment/reschedule`

***



### cancel an appointment

```js
/**
 * @adminOnlyRoute
 * @method {DELETE}
 * @path {/appointment/cancel/:id}
 * @headers `access-token` `device-id`
 * */
```

**Possible errors:**

| Status | Message |
| --: | --- |
| `401`  | Operation requires `access-token` |
| `403`  | Operation requires `device-id` |
| `403`  | Operation requires `user-agent` |
| `406` | Validation failed: (error message) |
| `500` | Couldn\'t register client |

**Note**

- This is a **admin only** route.
- This route always responds with Appointment Reschedule Pattern(#service-document-pattern) along with a status code `200`.

> Example: `[POST] https://skinmate.herokuapp.com/appointment/reschedule`

***






## Family

### creating a family member 

```js
/**
 * @method {POST}
 * @path {/familymember}
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

**Note**

* This route always responds with  **family member created** pattern (if no error)

> Example: `[POST] https://skinmate.herokuapp.com/familymember`

***

### fetch all family members

```js
/**
 * @method {GET}
 * @path {/familymember/all}
 * @headers `access-token` `device-id`
 * */
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

```js
/**
 * @method {DELETE}
 * @path {/familymember/:id}
 * @headers `access-token` `device-id`
 * @param {:id:} 
 * */
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
