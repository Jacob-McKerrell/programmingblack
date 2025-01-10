function post(entity, relativeURL){
  console.log(relativeURL)
  url = window.location.origin + relativeURL
  const response = fetch(url,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(entity)
    })
    .then(response => response.json())
    .catch( (error) => alert("UNABLE TO CONNECT TO SERVER, ITEM NOT ADDED\n\n"+error))
    return response
}
async function create_new_car(car_details){
  console.log("Creating Car")
  response = await post(car_details, "/api/cars")
  console.log(response)

}
//render_car_admin(create_new_car)


function get(relativeURL, queries, successfunction){
  const url = new URL(relativeURL, window.location.href);//
  if (queries){
    for (let i =0; i < queries.length; i++)
    {
      param = queries[i]
      if (param.value != "")
        {
          url.searchParams.append(param.name, param.value);
        }     
    }
  }
    response = fetch(url.href)
    .then(response => response.json())
    .catch( (error) => alert("UNABLE TO CONNECT TO SERVER\n\n"+error))
    console.log("RESPONSE: ", response, url.href)
    return response
  
   
}



//This function is responsible for filtering and displaying cars



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
async function get_customer_details_from_email(email)
{
  queries = [{"name": "email", "value": email}]
  const customers = await get("/api/customers", queries)
  if (customers){
    return customers[0]
  }   
}

async function patch(relativeURL, entity, queries){
  const url = new URL(relativeURL + "/" + entity.id, window.location.href);
  if (queries){
    for (let i =0; i < queries.length; i++)
    {
      param = queries[i]
      if (param.value != "")
        {
          url.searchParams.append(param.name, param.value);
        }     
    }
  }
  const response = await fetch(url,
    {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(entity)
    });
  return response.json()
}

function create_new_customer(customer_details, status){
  return post(customer_details, "/api/customers")
}

function change_car_availability_status(car_details, status){
  car_details.available = status
  const url = new URL("/api/cars/" + car_details.id, window.location.href);
  url.searchParams.append("available", car_details.available);
  const response = fetch(url,
    {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(car_details)
    })
  .then(response => response.json())
  .catch( (error) => alert("UNABLE TO CONNECT TO SERVER, ITEM NOT UPDATED\n\n"+error))

  return response
}

function create_new_booking(car_details, customer_details){
  const booking_details = {"customerid": customer_details.id, "carid": car_details.id}
  change_car_availability_status(car_details, "no")
  return post(booking_details, '/api/bookings')

}



booking_buttons = document.querySelectorAll(".booking-button")

for(let button of booking_buttons){
  let clickable_parent = img.parentElement.parentElement.parentElement
  clickable_parent.addEventListener("click", () => {
      img.classList.remove("invisible")
  })
}


function modify_car_availability(){
    const response = fetch(window.location.href+"/api/cars/carid?available=no",
      {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
            },
      });
  }







/*const button = document.getElementById("my_button")
button.addEventListener("search", async function(event){
    console.log()
    event.preventDefault()
    const response = await fetch("/car/find")
    let body = await response.text()
    document.getElementById("carlist").innerHTML=body
})
const boxElem = document.querySelector(".carlist");*/

function get_list_of_values(entities, attribute){
  let values = []
  for (i in entities){
    entity = entities[i]
    if (values.includes(entity[attribute]) == false){
      values.push(entity[attribute])
    }
  }
  values = values.sort()
  return values
  
}




/// RENDERING FUNCTIONS///
function createElement(name, container, IDName, innerText) {
  var element = document.createElement(name);
  if(IDName) {
      element.id = IDName;
  }
  if(container) {
      container.appendChild(element);
  }
  if(innerText) {
      element.innerText = innerText;
  }
  return element;
}


function render_car_admin(create_new_car) {
  console.log("RENDERING CAR ADMIIN")
  //This Function is responsible for adding new cars when button is pressed
  const form = document.getElementById('my_form');
  form.addEventListener('submit', async function(event){
    event.preventDefault();
    create_new_car(Object.fromEntries(new FormData(form).entries()));   
  })

  const button = document.getElementById("reset_availabilty")
  button.addEventListener('submit', async function(event){
    event.preventDefault();
    console.log("DO THIS FAMMMM")
    allcars = await get("/api/cars", queries=[])
    if (allcars){
      for (i in cars){
        car_details = cars[i]
        console.log("DO THIS FAMMMM")
        change_car_availability_status(car_details, "yes");   
      }
    }
    
  })
}

function render_customer_login(){
  // Create a form dynamically
  div = document.getElementById("content")
  var form = createElement("form", div, "customer_email_form");

  createElement("H3", form, "", "Enter Email to view your Bookings")
  // Create an input element for Email
  var PWD = createElement("input", form);
  PWD.setAttribute("type", "text");
  PWD.setAttribute("name", "email");
  PWD.setAttribute("placeholder", "Email@example.com");

  // Create a submit button
  var s = createElement("input", form);
  s.setAttribute("type", "submit");
  s.setAttribute("value", "Submit");


  form.addEventListener('submit', async function(event)
  {
    event.preventDefault();
    customer_email = Object.fromEntries(new FormData(form).entries()).email
    const customer_details = await get_customer_details_from_email(customer_email);
    if (customer_details){
      render_customer_bookings(customer_details)
    }
    else{
      console.log("USER DOESNT EXIST")
      render_customer_info_form(customer_email)
    }
  })
}





function render_car_filter(){
 // <form id="search-cars" method="get" class="form-group">
   // <h3>Make</h1><input name="make" type="text" class="car-attribute form-control">
   // Model<input name="model" type="text" class="car-attribute form-control">
    //Capacity <input name="capacity" type="text", class="car-attribute form-control">
    //<input name="available" value="yes", class="car-attribute invisibleinfo form-control">
 // </form>
 
  div = document.getElementById("content")
  var form = createElement("FORM", div)

  createElement("H3", form,"", "Make")
  var ID = createElement("INPUT", form, undefined)
  ID.setAttribute("name", "make")
  ID.setAttribute("type", "text")
  ID.setAttribute("class", "car-attribute form-control")

  createElement("H3", form,"", "Model")
  var ID = createElement("INPUT", form, undefined)
  ID.setAttribute("name", "model")
  ID.setAttribute("type", "text")
  ID.setAttribute("class", "car-attribute form-control")

  createElement("H3", form,"", "Capacity")
  var ID = createElement("INPUT", form, undefined, "Capacity")
  ID.setAttribute("name", "capacity")
  ID.setAttribute("type", "text")
  ID.setAttribute("class", "car-attribute form-control")

  //set availability criteria
  var  available = createElement("INPUT", form)
  available.setAttribute("name", "available")
  available.setAttribute("value", "yes")
  available.setAttribute("class", "car-attribute form-control")




  var button = createElement("INPUT", form, "clickme")
  button.setAttribute("type", "submit");
  button.setAttribute("value", "Submit");

 


  form.addEventListener('submit', async function(event)
  {
    event.preventDefault()
    const queries = document.querySelectorAll(".car-attribute")
    console.log(queries.value)
    carlist = await get("/api/cars", queries)
    console.log("CARLIST:", carlist)
    if (carlist){
        console.log(carlist)
        render_car_list(carlist)      
        console.log("TAHTS ALL")
      }     
  }
  );
}





function render_car_list(carlist, buttons=true){
  div = document.getElementById('content')
  div.innerHTML = ''
  for (let i =0; i < carlist.length; i++)
  {
    car = carlist[i]
    console.log("CAR IS HRER",car)
    container = createElement("DIV", div)
    container.setAttribute("class", car.available)
    createElement("H1",  container, undefined, car.make + " " + car.model.toUpperCase());
    createElement("P",  container, undefined, "Capacity: " + car.capacity + " Persons");
    if (buttons){
      const button = render_car_selection_button(car, container, render_email_form,)
    }
  }    
}


async function render_car_selection_button(instance,div, render_email_form){
  const button = createElement("BUTTON", div, instance.id, "Book This Car")
  button.addEventListener('click', async function(event)
        {
          car = await get("/api/cars/"+button.id)
          if (car){
            console.log("CAR", car)
            render_email_form(car)
          }
          
          
        })
  return button 
}

function render_email_form (car_details)
{
  div = document.getElementById('content')
  div.innerHTML = ""
  createElement("H1", div, undefined, "Please enter Name and Email Address to book " + car_details.make.toUpperCase() + " " + car_details.model.toUpperCase())

  // Create a form dynamically
  var form = createElement("form", div, "customer_email_form");

  // Create an input element for Email
  var PWD = createElement("input", form);
  PWD.setAttribute("type", "text");
  PWD.setAttribute("name", "email");
  PWD.setAttribute("placeholder", "Email@example.com");

  // Create a submit button
  var s = createElement("input", form);
  s.setAttribute("type", "submit");
  s.setAttribute("value", "Submit");

  console.log("PAGE UPDATED")

  form.addEventListener('submit', async function(event)
  {
    event.preventDefault();
    customer_email = Object.fromEntries(new FormData(form).entries()).email
    const customer_details = await get_customer_details_from_email(customer_email);
    if (customer_details){
      create_new_booking(car_details, customer_details)
      render_customer_bookings(customer_details)


    }
    else{
      console.log("rendering info")
      render_customer_info_form(customer_email, car_details)
    }
  })
}




function render_customer_info_form(email, car_details){
  div = document.getElementById("content")
  div.innerHTML = ""
  createElement("H1", div, undefined, "Continue Setting Up Account for " + email)
  
  // Create a form dynamically
  var form = createElement("form", div, "customer_info_form");

  // Create an input element for Firstname
  var ID = createElement("input", form);
  ID.setAttribute("type", "text");
  ID.setAttribute("name", "firstname");
  ID.setAttribute("placeholder", "firstname");
  
  // Create an input element for Surname
  var ID = createElement("input", form);
  ID.setAttribute("type", "text");
  ID.setAttribute("name", "surname");
  ID.setAttribute("placeholder", "surname");

  // Create a submit button
  var s = createElement("input", form); 
  s.setAttribute("type", "submit");
  s.setAttribute("value", "Submit");


  form.addEventListener('submit', async function(event){
    event.preventDefault()
    console.log("INFO BUTTON PRESSED")
    customer_details = Object.fromEntries(new FormData(form).entries())
    customer_details.email = email
    customer_details = await create_new_customer(customer_details)
    if (car_details){
        create_new_booking(car_details, customer_details)
        modify_car_availability()
        render_customer_bookings(customer_details)
    }
    else{
      console.log("customer Added")
      div = document.getElementById("content")
      createElement("H2", div, undefined, customer_details.email + "Added as a customer")
    }


  })
}


function render_created_customer_message(){
  
}


async function render_customer_bookings(customer_details){
  console.log("HERE MATEY")
  let queries = [{"name": "customerid", "value": customer_details.id}]
  let bookings = await get("/api/bookings", queries)
  if (bookings){
    carlist = []
    for (i in bookings){
      booking_details = bookings[i]
      let queries = [{"name": "id", "value": booking_details.carid}]
      car_details = await get("/api/cars", queries)
      if (car_details){
        carlist.push(car_details[0])
      }
    }
    console.log(carlist, carlist.length)
    render_car_list(carlist, buttons=false)
  }
}


//render_customer_login()
//render_car_filter()
render_car_admin(create_new_car)