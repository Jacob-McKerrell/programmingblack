const express = require('express')
const fs = require('fs');

const app = express()
const hostname = '127.0.0.1';
const port = 3000;


app.use(express.static('client'));
app.use(express.json())
app.use("/form", express.static("./client/form.html"))




app.get('/cars/list', function (req, resp){
  let cars = require("./data/cars.json")
  resp.send(cars);
});



/* ADD NEW CAR */


get_next_id = function(entities, entity_name, id_name="id")
{
  console.log(entities.slice(-1))
  last_item = entities.slice(-1)
  let id = entity_name + parseInt(parseInt(entities.slice(-1)[0][id_name].slice(entity_name.length)) + 1)
  return id
}

app.post("/api/cars/", function(req, resp){
    //add new car
    let cars = require("./data/cars.json")
    let id = get_next_id(cars, "car")
    let make = req.body.make.toLowerCase()
    let model = req.body.model.toLowerCase()
    let capacity = req.body.capacity
    //let registration = req.body.registration.toLowerCase()
    let available = true
    let newCar = {"id": id, "make": make.toLowerCase(), "model": model.toLowerCase(), "capacity": capacity, "available": available}
    cars.push(newCar)
    let carsText = JSON.stringify(cars)
    fs.writeFileSync('./data/cars.json', carsText)
    resp.status(200).send(carsText)

}
)

app.post("/api/customers", function(req, resp)
{
  //add new customer
  console.log("ADDDING NOEW CUSGOMERRR")
  let customers = require("./data/customers.json")
  let id = get_next_id(customers, "customer")
  let firstname = req.body.firstname
  let surname = req.body.surname
  let email = req.body.email
  let newCustomer = {"id": id, "firstname": firstname, "surname": surname, "email": email} 
  customers.push(newCustomer)
  let customerText = JSON.stringify(customers)
  fs.writeFileSync("./data/customers.json", customerText)
  resp.status(200).send(customerText)
}
)

app.post("/api/bookings", function(req, resp){
  let bookings = require("./data/bookings.json")
  let bookingid = get_next_id(bookings, "booking", "bookingid")
  let customerid = req.body.customerid
  let carid = req.body.carid
  let newBooking = {"bookingid": bookingid, "customerid": customerid, "carid": carid} 
  bookings.push(newBooking)
  let bookingText = JSON.stringify(bookings)
  fs.writeFileSync("./data/bookings.json", bookingText)
  resp.status(200).send(bookingText)
})






filter_entity_list = function(req, entity_list){
  filteredlist = entity_list
  removeditemIDs = []
  for (let i in entity_list)
    {    
      var entity = JSON.parse(JSON.stringify(entity_list[i]))
      for (param in req.query)
      {
       //console.log(car[`${param}`], req.query[param])
        if (entity[`${param}`] != req.query[param])
        {
          removeditemIDs.push(entity.id)
        }
        filteredlist = filteredlist.filter( ( el ) => !removeditemIDs.includes( el.id ) );
      } 
    }
  return filteredlist
}
app.get("/api/cars", function(req, resp)
{
  const cars = require("./data/cars.json")
  filteredCars = filter_entity_list(req, cars)
  resp.status(200).send(filteredCars)
 }
)

app.get("/api/cars/:id", function(req, resp)
  { 
    const cars = require("./data/cars.json")
    let id = (req.params.id.toLowerCase())
    sent = false
    console.log(id)
    for (i in cars)
    {
      var car = JSON.parse(JSON.stringify(cars[i]))
      if (car.id == id)
      {
        resp.status(200).send(car)
        sent=true
      }
    }
    if (sent == false)
    {
      resp.status(404).send("Sorry, there doesn't exist a car with the id: " + id);
    }
  }
)

app.get("/api/bookings", function(req, resp)
{
  console.log("CALLED POST ON BOOKINGS")
  const bookings = require("./data/bookings.json")
  filteredCars = filter_entity_list(req, bookings)
  resp.send(filteredCars)
}
)

app.get("/api/customers/", function (req, resp)
{
  const customers = require("./data/customers.json")
  filteredCustomers = filter_entity_list(req, customers)
  resp.status(200).send(filteredCustomers)
})

app.get("/api/customers/:id", function(req, resp)
  { 
    const cars = require("./data/customers.json")
    let id = (req.params.id.toLowerCase())
    sent = false
    console.log(id)
    for (i in customers)
    {
      var car = JSON.parse(JSON.stringify(customers[i]))
      if (car.id == id)
      {
        resp.status(200).send(customer)
        sent=true
      }
    }
    if (sent == false)
    {
      resp.status(404).send("Sorry, there doesn't exist a customer with the id: " + id);
    }
  }
)






app.get('/random/:max', function(req, resp){
  max = parseInt(req.params.max)
  rand = Math.floor(Math.random()*max) +1
  console.log('Max via url is ' + max + ' rand is ' + rand)
  resp.send('' + rand)
})

app.get('/r', function(req, resp){
  max = parseInt(req.query.max)
  rand = Math.floor(Math.random()*max) +1
  console.log('Max via query is ' + max + ' rand is ' + rand)
  resp.send('' + rand)
})



/*THE BELOW CODE CAN BE USED TO OBTAIN PARAMETERS FROM THE URL*/
app.get('/users/:userId/books/:bookId', (req, res) => {
    res.send(req.params)
  })

/*THIS IS AN ALTERNATIVE METHOD TO DO THE SAME THING*/

app.get("/users", (req, res) => {
  id =parseInt(req.query.id)
  res.send(""+id)

})


/* ROUTE - when /example/c is accessed, it runs cb0 then cb1 then cb2 */
const cb0 = function (req, resp, next) {
    console.log('CB0')
    next()
  }
  
  const cb1 = function (req, resp, next) {
    console.log('CB1')
    next()
  }
  
  const cb2 = function (req, res) {
    res.send('Hello from C!')
  }
  
  app.get('/example/c', [cb0, cb1, cb2])






app.listen(3000, () =>{
    console.log(`server running at http://${hostname}:${port}/`)
}) 
