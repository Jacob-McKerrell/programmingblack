const express = require('express')
const fs = require('fs');
const { json } = require('stream/consumers');
const { fileURLToPath } = require('url');
const {v4: uuidv4} =require("uuid")

const app = express()

let data_dir = "./data"

app.use(express.static('client'));
app.use(express.json())
app.use("/form", express.static("./client/form.html"))

loadJson = function(jsonpath) {
    return JSON.parse(
        fs.readFileSync(data_dir + jsonpath, 'utf8')
    );
}

saveJson = function(jsonpath, value) {
    fs.writeFileSync(
        data_dir + jsonpath, JSON.stringify(value)
    );
}
const cars = require(data_dir + "/cars.json")
const customers = require(data_dir + "/customers.json")
const bookings = require(data_dir + "/bookings.json")




read = function(req, resp, jsonpath){
    const entities = loadJson(jsonpath)
    filteredEntities = filter_entity_list(req, entities)
    if (filteredEntities){
        resp.status(200).send(filteredEntities)
    }
    else{
        resp.status(404).send(filteredEntities)
    }
}

read_entity = function(req, resp, jsonpath){
    const entities = loadJson(jsonpath)
    let id = req.params.id
    sent = false
    for (i in entities){
        var entity = JSON.parse(JSON.stringify(entities[i]))
        if (entity.id == id){
            resp.status(200).send(entity)
            sent = true
        }
    }
    if (sent==false){
        resp.status(404).send("404 not found")
    }
}

create = function(req, resp, jsonpath, attributes){
    console.log("Attributes", attributes)
    let entities = loadJson(jsonpath)
    id = uuidv4()
    console.log(attributes)
    if (attributes.includes("id") == false){
        newEntity = {"id": id}
    }
    else{
        newEntity ={}
    }
    for (a in attributes){
        attribute = attributes[a]
        console.log(attribute, req.body[attribute])
        try{
            newEntity[attribute] = req.body[attribute].toLowerCase()
        }catch{
            newEntity[attribute] = req.body[attribute]
        }
    }
    entities.push(newEntity)
    saveJson(jsonpath, entities);
    resp.status(200).send(newEntity)

}

update = function(req, resp, jsonpath){

    

    req.query.id = req.params.id
    let ignore_list = []
    for (param in req.query){
        if (param != "id"){
            ignore_list.push(param)
        }
    }
    let allEntities = loadJson(jsonpath)
    filteredCars = filter_entity_list(req, allEntities, ignore=ignore_list)
    let entity = filteredCars[0]

    index = allEntities.indexOf(entity)
    allEntities.splice(index, 1)
    

    for (param in req.query){
        if (param != "id"){
            entity[param] = req.query[param]
        }
    }
    
    if (allEntities.includes(entity) == false){resp.status(404)}
    allEntities.push(entity)
    saveJson(jsonpath, allEntities)
    resp.status(200).send(entity)
}

remove = function(req, resp, jsonpath){
    id = req.params.id
    const allEntities = loadJson(jsonpath)
    filteredEntities = filter_entity_list(req, allEntities)
    console.log(filteredEntities)
    sent = false
    for (i in filteredEntities){
        entity = filteredEntities[i]
        console.log(entity)
        if (entity.id == id){
            index = filteredEntities.indexOf(entity)
            if (index != -1) {
                filteredEntities.splice(index, 1)
            }
            saveJson(jsonpath, filteredEntities);
            resp.status(204).send()
            sent = true
            break
        }
    }
    if (sent == false){
        console.log("NOT FOUND")
        resp.status(404).send("404 not found")
    }
}




//CAR ENTITY//
app.get("/api/cars", function(req, resp){
    console.log("HEREEE CREATING NEW CAR")
    read(req, resp, "/cars.json")
})

app.get("/api/cars/:id", function(req, resp){ 
    read_entity(req,resp, "/cars.json")
})

app.post("/api/cars/", function(req, resp){
    console.log(req.body, req.body["make"], req.body["model"])
    attributes = ["make", "model", "capacity", "available"]
    create(req, resp, "/cars.json", attributes)
})

app.patch("/api/cars/:id/", function(req, resp){
    update(req, resp, "/cars.json")
})

app.delete("/api/cars/:id/", function(req, resp){
    remove(req, resp, "/cars.json")
})


//CUSTOMER ENTITY//
app.get("/api/customers", function(req, resp){
    read(req, resp, "/customers.json")
})

app.get("/api/customers/:id", function(req, resp){ 
    read_entity(req,resp, "/customers.json")
})

app.post("/api/customers/", function(req, resp){
    attributes = ["firstname", "surname", "email"]
    create(req, resp, "/customers.json", attributes)
})

app.patch("/api/customers/:id/", function(req, resp){
    update(req, resp, "/customers.json")
})

app.delete("/api/customers/:id/", function(req, resp){
    remove(req, resp, "/customers.json")
})
//BOOKING ENTITY//

app.get("/api/bookings", function(req, resp){
    read(req, resp, "/bookings.json")
})

app.get("/api/bookings/:id", function(req, resp){ 
    read_entity(req,resp, "/bookings.json")
  })

app.post("/api/bookings/", function(req, resp){
    attributes = ["customerid", "carid", "date"]
    create(req, resp, "/bookings.json", attributes)
})

app.patch("/api/bookings/:id/", function(req, resp){
    update(req, resp, "/bookings.json")
})

app.delete("/api/bookings/:id/", function(req, resp){
    remove(req, resp, "/bookings.json")
})





filter_entity_list = function(req, entity_list, ignore=[]){
  filteredlist = entity_list
  removeditemIDs = []
  for (let i in entity_list)
    {  
      var entity = JSON.parse(JSON.stringify(entity_list[i]))
      for (param in req.query)
      {
        console.log(param)  
        if (entity[`${param}`] != req.query[param])
        {
          if (ignore.includes(param) == false){
            removeditemIDs.push(entity.id)
          }
        }
        filteredlist = filteredlist.filter( ( el ) => !removeditemIDs.includes( el.id ) );
      } 
    }
    var jsonresponse = JSON.parse(JSON.stringify(filteredlist))
    return jsonresponse
}









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


module.exports = {
    app,
    setDataDir: (dir) => {
        data_dir = dir;
    }
}