IN ORDER TO RUN THE SERVER RUN THE FOLLOWING LINES ON A COMMAND LINE IN THE CORRECT DIRECTORY
`npm install`  n
`npm start`

# REST API

The API provides details for the following entities
`cars`, `customers`, `bookings`

Which can be accessed under the `http:localhost:8080/api/{ENTITY}` URL

All three entities utilise the same functions and these are:

`GET list of entities`  
`GET individual entity`  
`POST`  
`PATCH`  
`DELETE`
## Entity Attributes
### Cars
  
`id` - A unique randomly generated uuid for a specific car  
`make` - A string detailing what company makes the car  
`model` - A string detailing the exact model of the car  
`capacity` - An integer detailing how many people the car can hold.  

  
```json
{
  "id": "d958b359-556a-4d80-b5ca-13dcf9461306",
  "make": "audi",
  "model": "a1",
  "capacity": "5"
}
```

### Customers
  
    
`id` - A unique randomly generated uuid for a specific car   
`firstname` - A string detailing the first name of the customer  
`surname` - A string detailing the surname of the customer  
`email` - A string detailing the email address of the customer  
  

 Example
```json
{
    "id": "14f4d38b-7789-4917-8cec-ddc6eebe648a",
    "firstname": "jacob",
    "surname": "mckerrell",
    "email": "jacobmckerrell@gmail.com"
  }
```

### Bookings
  
     
`id` - A unique randomly generated uuid for a specific car  
`customerid` - corresponds to the id of a customer instance  
`carid` - corresponds to the id of a car instance  
`date` - A string detailing the date that the booking is for

```json
{
    "id": "0e7752a7-283c-49d2-a29e-40485a8478ed",
    "customerid": "83feda52-8725-4b76-bf7d-b040141882f9",
    "carid": "73d77597-87bd-47be-939d-56781f55fa05",
    "date": "2025-01-28"
}
```




## Some examples using cars
### A list of car entities (GET)

`GET /api/cars` will return *all* the cars in the json file.

```sh
curl "http://localhost:8080/api/cars" \
  -H "Accept: application/json"
```
```json
[
  {
    "id": "d958b359-556a-4d80-b5ca-13dcf9461306",
    "make": "audi",
    "model": "a1",
    "capacity": "5"
  },
  {
    "id": "73d77597-87bd-47be-939d-56781f55fa05",
    "make": "audi",
    "model": "q5",
    "capacity": "5"
  },
  {
    "id": "563838e3-3391-43c7-88bb-22bf84fd3820",
    "make": "vw",
    "model": "up",
    "capacity": "3",
    "available": "yes"
  }
  {
    "id":"d1ee288b-bdc9-42bc-b701-3d16bfe2ced8",
    "make":"ford",
    "model":"fiesta",
    "capacity":"5"
  }
]
```
### A list of car entities that satisfy search criteria (GET)

You can specify query parameters for any of the attributes, to narrow the results.
```sh
curl "http://localhost:8080/api/cars?make=audi&capacity=5" \
  -H "Accept: application/json"
```
`200 OK`
```json
[
  {
    "id": "d958b359-556a-4d80-b5ca-13dcf9461306",
    "make": "audi",
    "model": "a1",
    "capacity": "5"
  },
  {
    "id": "73d77597-87bd-47be-939d-56781f55fa05",
    "make": "audi",
    "model": "q5",
    "capacity": "5"
  }
]
```
`404 Not Found` if no entities satisfy all these criteria

### Details for a specific entity (GET)
  
  
GET /api/cars/:id will return the car with the specified id
  
  
```sh
curl "http://localhost:8080/api/cars/d958b359-556a-4d80-b5ca-13dcf9461306" \
  -H "Accept: application/json"
```
`200 OK`
```json
{
  "id": "d958b359-556a-4d80-b5ca-13dcf9461306",
  "make": "audi",
  "model": "a1",
  "capacity": "5"
}
```
`404 Not Found` if entity ID does not exist

### Create a new entity (POST)
```sh
curl "http://localhost:8080/api/cars" \
  -H "ContentType: application/json" \
  -H "Accept: application/json" \
  -d '{
     "make": "audi",
     "model": "new-a1",
     "capacity": "3"
   }'
```
```json
{
  "id": "bda3d38e-a9f3-4072-b4e6-12c476a99709",
  "make": "audi",
  "model": "new-a1",
  "capacity": "3"
}
```
### Update an existing entity (PATCH)
```sh
curl -X PATCH "http://localhost:8080/api/cars/bda3d38e-a9f3-4072-b4e6-12c476a99709" \
  -H "ContentType: application/json" \
  -H "Accept: application/json" \
  -d '{
     "capacity": "4"
   }'
```
```json
{
  "id": "bda3d38e-a9f3-4072-b4e6-12c476a99709",
  "make": "audi",
  "model": "new-a1",
  "capacity": "4"
}
```

### Remove an entity (DELETE)
```sh
curl -X DELETE "http://localhost:8080/api/cars/bda3d38e-a9f3-4072-b4e6-12c476a99709" \
  -H "Accept: application/json"
```
`201 No Content`
or `404 Not Found` if entity does not exist



All of these functions work the same for the other entities.