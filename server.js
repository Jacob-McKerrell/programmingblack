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















/* ADD NEW ITEM */
let cars = require("./data/cars.json")
app.post("/api/car/add", function(req, resp){
    //add new car
    console.log(cars)
    last_item = cars.slice(-1)
    console.log(last_item, last_item[0]["id"])
    let id = cars.slice(-1)[0]["id"] + 1
    let make = req.body.make
    let model = req.body.model
    let capacity = req.body.capacity
    let available = true
    let newCar = {"id": id, "make": make.toLowerCase(), "model": model.toLowerCase(), "capacity": capacity, "available": available}
    console.log("NEW CAR")
    console.log(newCar)
    cars.push(newCar)
    let carsText = JSON.stringify(cars)
    fs.writeFileSync('./data/cars.json', carsText)
    resp.send(carsText)

}
)






const get_parameters = function(req, resp, next){
  
  next()
}

const search_json = function(req, resp, next){
  console.log(make, model)
  console.log(cars)
  let cars = require("./data/cars.json")
  
}










app.get("/cars/find", function(req, resp)
{
  const cars = require("./data/cars.json")
  let id = req.query.id
  let make = req.query.make
  let model = req.query.model
  let available = req.query.available
  let capacity = req.query.capacity

  filteredCars = cars
  removedCarIDs = []
  
  for (let i in cars)
  {    
    var car = JSON.parse(JSON.stringify(cars[i]))
    for (param in req.query)
    {
     //console.log(car[`${param}`], req.query[param])
      if (car[`${param}`] != req.query[param])
      {
        removedCarIDs.push(car.id)
      }
    }
      
    
  }

  //console.log("REMOVED", removedCarIDs)
  filteredCars = filteredCars.filter( ( el ) => !removedCarIDs.includes( el.id ) );
  //console.log("FILTERED", filteredCars)

  const Url = new URL("http://127.0.0.1:3000/cars/find/");
  Url.searchParams.append("make", "Audi");
  console.log(Url.href)



  resp.send(filteredCars)

})






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
