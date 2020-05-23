# sulap


server is built on `Express` and `Mongoose` and `Node Js`
client is build on `React Js`


## Usage
To run the development server, you can use these commands:
```console
$ cd <project_name>
$ sulap poof
```

Access the REST API via localhost = `http://localhost:3000`


## REST API Routes:

### AUTHENTICATION

- **Register**
  - URL:
    - **`POST`** *`/register`*
  - Body:
    - `name`: `String`, required
    - `email`: `String`, required
    - `password`: `String`, required
    - `role`: `String`, required
  - Expected response (status: `201`):
    ```json
      {
        "message": "account registered",
        "newUser":
        {
          "_id": "<generatedId>",
          "name": "<registeredName>",
          "email": "<registeredEmail>",
          "password": "<hashedPassword>",
          "role": "<registeredRole>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "<detailedErrors>"
      }
      ```
      Notes:
      - ERROR `400` is caused by entering *empty name* or *empty email* or *duplicated email* or *email not valid format* or *empty password* or *empty role*

- **Login**
  - URL:
    - **`POST`** *`/login`*
  - Body:
    - `email`: `String`, required
    - `password`: `String`, required
  - Expected response (status: `200`):
    ```json
      {
        "message": "login success",
        "token": "<accessToken>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```json
      {
        "message": "invalid username / password"
      }
      ```

### CAR ROUTE

- **GET LIST OF CAR**
  - URL:
    - **`GET`** *`/cars`*
  - URL (filtered):
    - **`GET`** *`/cars?search=<KEYWORD>`*
  - Expected response (status: `200`):
    ```javascript
      {
        "message": "data found",
        "Cars": [
        {
          "_id": "<id>",
          "brand": "<string>",
          "type": "<string>",
          "year": "<number>",
          "policeNo": "<string>",
          "vin": "<string>",
          "price": "<number>",
          "currency": "<string>",
          "status": "<string>",
          "created": "<date>",
          "updated": "<date>"
        }
      ]}
    ```
  - Error responses:
    - status: `404`:
      ```javascript
        {
          "message": "..."
        }
      ```

- **CREATE NEW CAR**
  - Notes:
    - Authorization: only admin can access
  - URL:
    - **`POST`** *`/cars`*
  - Header(s):
    - `token`: `String`
  - Body:
    - `brand`:`String`
    - `type`:`String`
    - `year`:`Number`
    - `policeNo`:`String`
    - `vin`:`String`
    - `price`:`Number`
    - `currency`:`String`
    - `status`:`String`
  - Expected response (status: `201`):
    ```javascript
      {
        "message": "data created",
        "newCar":
        {
          "_id": "<id>",
          "brand": "<string>",
          "type": "<string>",
          "year": "<number>",
          "policeNo": "<string>",
          "vin": "<string>",
          "price": "<number>",
          "currency": "<string>",
          "status": "<string>",
          "created": "<date>",
          "updated": "<date>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is also Validation Error caused by entering *empty name* or *empty price* or *empty stock* or *negative value price* or or *negative value stock*
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    
- **GET CAR BY ID**
  - URL:
    - **`GET`** *`/cars/:id`*
  - Expected response (status: `200`):
    ```javascript
      {
        "message": "data found",
        "Car": 
        {
          "_id": "<id>",
          "brand": "<string>",
          "type": "<string>",
          "year": "<number>",
          "policeNo": "<string>",
          "vin": "<string>",
          "price": "<number>",
          "currency": "<string>",
          "status": "<string>",
          "created": "<date>",
          "updated": "<date>"
        }
      }
    ```
  - Error responses:
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

- **UPDATE CAR BY ID**
  - Notes:
    - Authorization: only admin can access
  - URL(s):
    - **`PUT`** *`/cars/:id`*
    - **`PATCH`** *`/cars/:id`*
    <br>Notes:
        - `PUT` method is used for updating all details of data
        - `PATCH` method is used for updating some details of data
  - Header(s):
    - `token`: `String`
  - Body:
    - `brand`:`String`
    - `type`:`String`
    - `year`:`Number`
    - `policeNo`:`String`
    - `vin`:`String`
    - `price`:`Number`
    - `currency`:`String`
    - `status`:`String`
  - Expected response (status: `201`):
    ```javascript
      {
        "message": "data updated",
        "updatedCar":
        {
          "_id": "<objectID>",
          "brand": "<string>",
          "type": "<string>",
          "year": "<number>",
          "policeNo": "<string>",
          "vin": "<string>",
          "price": "<number>",
          "currency": "<string>",
          "status": "<string>",
          "created": "<date>",
          "updated": "<date>"
        },
        "info": "<info-optional>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is also Validation Error caused by entering *empty name* or *empty price* or *empty stock* or *negative value price* or or *negative value stock*
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

- **DELETE CAR BY ID**
  - Notes:
    - Authorization: only admin can access
  - URL(s):
    - **`DELETE`** *`/cars/:id`*
  - Header(s):
    - `token`: `String`
  - Expected response (status: `200`):
    ```javascript
      {
        "message": "data deleted",
        "deletedCar":
        {
          "_id": "<id>",
          "brand": "<string>",
          "type": "<string>",
          "year": "<number>",
          "policeNo": "<string>",
          "vin": "<string>",
          "price": "<number>",
          "currency": "<string>",
          "status": "<string>",
          "created": "<createdAt>",
          "updated": "<updatedAt>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

### RENTITEM ROUTE

- **GET LIST OF RENTITEM**
  - URL:
    - **`GET`** *`/rentitems`*
  - URL (filtered):
    - **`GET`** *`/rentitems?search=<KEYWORD>`*
  - Expected response (status: `200`):
    ```javascript
      {
        "message": "data found",
        "Rentitems": [
        {
          "_id": "<id>",
          "daily": "<number>",
          "weekly": "<number>",
          "monthly": "<number>",
          "annually": "<number>",
          "currency": "<string>",
          "tax": "<number>",
          "discount": "<number>",
          "carId": "<string>",
          "created": "<date>",
          "updated": "<date>"
        }
      ]}
    ```
  - Error responses:
    - status: `404`:
      ```javascript
        {
          "message": "..."
        }
      ```

- **CREATE NEW RENTITEM**
  - Notes:
    - Authorization: only admin can access
  - URL:
    - **`POST`** *`/rentitems`*
  - Header(s):
    - `token`: `String`
  - Body:
    - `daily`:`Number`
    - `weekly`:`Number`
    - `monthly`:`Number`
    - `annually`:`Number`
    - `currency`:`String`
    - `tax`:`Number`
    - `discount`:`Number`
    - `carId`:`String`
  - Expected response (status: `201`):
    ```javascript
      {
        "message": "data created",
        "newRentitem":
        {
          "_id": "<id>",
          "daily": "<number>",
          "weekly": "<number>",
          "monthly": "<number>",
          "annually": "<number>",
          "currency": "<string>",
          "tax": "<number>",
          "discount": "<number>",
          "carId": "<string>",
          "created": "<date>",
          "updated": "<date>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is also Validation Error caused by entering *empty name* or *empty price* or *empty stock* or *negative value price* or or *negative value stock*
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    
- **GET RENTITEM BY ID**
  - URL:
    - **`GET`** *`/rentitems/:id`*
  - Expected response (status: `200`):
    ```javascript
      {
        "message": "data found",
        "Rentitem": 
        {
          "_id": "<id>",
          "daily": "<number>",
          "weekly": "<number>",
          "monthly": "<number>",
          "annually": "<number>",
          "currency": "<string>",
          "tax": "<number>",
          "discount": "<number>",
          "carId": "<string>",
          "created": "<date>",
          "updated": "<date>"
        }
      }
    ```
  - Error responses:
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

- **UPDATE RENTITEM BY ID**
  - Notes:
    - Authorization: only admin can access
  - URL(s):
    - **`PUT`** *`/rentitems/:id`*
    - **`PATCH`** *`/rentitems/:id`*
    <br>Notes:
        - `PUT` method is used for updating all details of data
        - `PATCH` method is used for updating some details of data
  - Header(s):
    - `token`: `String`
  - Body:
    - `daily`:`Number`
    - `weekly`:`Number`
    - `monthly`:`Number`
    - `annually`:`Number`
    - `currency`:`String`
    - `tax`:`Number`
    - `discount`:`Number`
    - `carId`:`String`
  - Expected response (status: `201`):
    ```javascript
      {
        "message": "data updated",
        "updatedRentitem":
        {
          "_id": "<objectID>",
          "daily": "<number>",
          "weekly": "<number>",
          "monthly": "<number>",
          "annually": "<number>",
          "currency": "<string>",
          "tax": "<number>",
          "discount": "<number>",
          "carId": "<string>",
          "created": "<date>",
          "updated": "<date>"
        },
        "info": "<info-optional>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is also Validation Error caused by entering *empty name* or *empty price* or *empty stock* or *negative value price* or or *negative value stock*
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

- **DELETE RENTITEM BY ID**
  - Notes:
    - Authorization: only admin can access
  - URL(s):
    - **`DELETE`** *`/rentitems/:id`*
  - Header(s):
    - `token`: `String`
  - Expected response (status: `200`):
    ```javascript
      {
        "message": "data deleted",
        "deletedRentitem":
        {
          "_id": "<id>",
          "daily": "<number>",
          "weekly": "<number>",
          "monthly": "<number>",
          "annually": "<number>",
          "currency": "<string>",
          "tax": "<number>",
          "discount": "<number>",
          "carId": "<string>",
          "created": "<createdAt>",
          "updated": "<updatedAt>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

### RENTLIST ROUTE

- **GET LIST OF RENTLIST**
  - URL:
    - **`GET`** *`/rentlists`*
  - URL (filtered):
    - **`GET`** *`/rentlists?search=<KEYWORD>`*
  - Expected response (status: `200`):
    ```javascript
      {
        "message": "data found",
        "Rentlists": [
        {
          "_id": "<id>",
          "customer": "<string>",
          "type": "<string>",
          "startPeriod": "<string>",
          "endPeriod": "<string>",
          "rentItemId": "<string>",
          "created": "<date>",
          "updated": "<date>"
        }
      ]}
    ```
  - Error responses:
    - status: `404`:
      ```javascript
        {
          "message": "..."
        }
      ```

- **CREATE NEW RENTLIST**
  - Notes:
    - Authorization: only admin can access
  - URL:
    - **`POST`** *`/rentlists`*
  - Header(s):
    - `token`: `String`
  - Body:
    - `customer`:`String`
    - `type`:`String`
    - `startPeriod`:`String`
    - `endPeriod`:`String`
    - `rentItemId`:`String`
  - Expected response (status: `201`):
    ```javascript
      {
        "message": "data created",
        "newRentlist":
        {
          "_id": "<id>",
          "customer": "<string>",
          "type": "<string>",
          "startPeriod": "<string>",
          "endPeriod": "<string>",
          "rentItemId": "<string>",
          "created": "<date>",
          "updated": "<date>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is also Validation Error caused by entering *empty name* or *empty price* or *empty stock* or *negative value price* or or *negative value stock*
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    
- **GET RENTLIST BY ID**
  - URL:
    - **`GET`** *`/rentlists/:id`*
  - Expected response (status: `200`):
    ```javascript
      {
        "message": "data found",
        "Rentlist": 
        {
          "_id": "<id>",
          "customer": "<string>",
          "type": "<string>",
          "startPeriod": "<string>",
          "endPeriod": "<string>",
          "rentItemId": "<string>",
          "created": "<date>",
          "updated": "<date>"
        }
      }
    ```
  - Error responses:
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

- **UPDATE RENTLIST BY ID**
  - Notes:
    - Authorization: only admin can access
  - URL(s):
    - **`PUT`** *`/rentlists/:id`*
    - **`PATCH`** *`/rentlists/:id`*
    <br>Notes:
        - `PUT` method is used for updating all details of data
        - `PATCH` method is used for updating some details of data
  - Header(s):
    - `token`: `String`
  - Body:
    - `customer`:`String`
    - `type`:`String`
    - `startPeriod`:`String`
    - `endPeriod`:`String`
    - `rentItemId`:`String`
  - Expected response (status: `201`):
    ```javascript
      {
        "message": "data updated",
        "updatedRentlist":
        {
          "_id": "<objectID>",
          "customer": "<string>",
          "type": "<string>",
          "startPeriod": "<string>",
          "endPeriod": "<string>",
          "rentItemId": "<string>",
          "created": "<date>",
          "updated": "<date>"
        },
        "info": "<info-optional>"
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
      - ERROR `400` is also Validation Error caused by entering *empty name* or *empty price* or *empty stock* or *negative value price* or or *negative value stock*
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

- **DELETE RENTLIST BY ID**
  - Notes:
    - Authorization: only admin can access
  - URL(s):
    - **`DELETE`** *`/rentlists/:id`*
  - Header(s):
    - `token`: `String`
  - Expected response (status: `200`):
    ```javascript
      {
        "message": "data deleted",
        "deletedRentlist":
        {
          "_id": "<id>",
          "customer": "<string>",
          "type": "<string>",
          "startPeriod": "<string>",
          "endPeriod": "<string>",
          "rentItemId": "<string>",
          "created": "<createdAt>",
          "updated": "<updatedAt>"
        }
      }
    ```
  - Error responses:
    - status: `400`:
      ```javascript
      {
        "message": "<authentication message>"
      }
      ```
      Notes:
      - Messages:
        - no token assigned
        - not allowed to access
        - not recognized input data
    - status: `401`:
      ```javascript
      {
        "message": "unauthorized to access"
      }
      ```
    - status: `404`:
      ```javascript
        {
          "message": "data not found"
        }
      ```

[comment]: # (reserved for adding new model)