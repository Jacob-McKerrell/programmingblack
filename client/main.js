
// THIS SET OF FUNCTIONS IS RESPONSIBLE for the API requests//
//---------------------------------------------------------------------------------------------------------------------------------------------------
function post(entity, relativeURL){
  /* calls post request at /api/{realtiveURL} with {entity} passed in as the body */
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

async function get(relativeURL, queries){
  /* calls get request at /api/{realtiveURL} with {queries} passed in as queries */
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
    console.log("URL:", url.href)
    response = await fetch(url.href)
    .then(response => response.json())
    .catch( (error) => alert("UNABLE TO CONNECT TO SERVER\n\n"+error))
    console.log("RESPONSE: ", response, url.href)
    return response
  
   
}

function remove(relativeURL, itemID){
  /* calls delete request at /api/{realtiveURL} with {queries} passed in as queries */
  console.log(relativeURL)
  url = window.location.origin + relativeURL + "/" + itemID
  const response = fetch(url,
    {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
          },
    })
}

async function patch(relativeURL, entity, queries){
  /* calls delete request at /api/{realtiveURL} with {queries} 
  passed in as queries and {entity} as a body*/
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
//---------------------------------------------------------------------------------------------------------------------------------------------------







async function create_new_car(car_details){
  response = await post(car_details, "/api/cars")
}
//render_car_admin(create_new_car)




async function filter_out_unavailable_cars(car_list, date){

  /* Takes a list of cars (already filtered by attributes in the form) - ({car_list}) and removes any which are already booked on a given date ({date})) */

  queries = [{"name":"date", "value": date}]
  bookings = await get("/api/bookings", queries)

  booking_car_ids = []
  for (let booking of bookings){
    booking_car_ids.push(booking.carid)
  }

  filtered_list = []
  for (let car of car_list){
    if (booking_car_ids.includes(car.id) == false){
      filtered_list.push(car)
    }
  }
  return filtered_list
}



//This function is responsible for filtering and displaying cars



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
async function get_customer_details_from_email(email)
{
  /* takes an email as an input ({email}) and returns
   the customer entity associated wit this email, or an 
   empty list otherwise */

  queries = [{"name": "email", "value": email}]
  const customers = await get("/api/customers", queries)
  if (customers.length != 0){
    console.log('here')
    console.log(customers)
    return customers[0]
  }  
  else{
    const empty = []
    return empty
  } 
}



function create_new_customer(customer_details, status){
  return post(customer_details, "/api/customers")
}

function change_car_availability_status(car_details, status){
  /* FUNCTION IS NOT UTILISED BUT EFFECTIVELY CALLED A PATCH REQUEST */
  const url = new URL("/api/cars/" + car_details.id, window.location.href);
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

async function create_new_booking(car_details, customer_details, date){
  console.log("DATE FOR BOOKING", date)
  const booking_details = {"customerid": customer_details.id, "carid": car_details.id, "date": date}
  return post(booking_details, "/api/bookings")
}


// UTILITY FUNCTIONS //

function title_case(string){
  return string[0].toUpperCase() + string.substring(1).toLowerCase()
 
 }


/// THESE SET OF FUNCTIONS ARE RESPONSIBLE FOR DISPLAYING THE HTML TO THE WEBPAGE ///


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

function render_customer_login(date){
  console.log("CUSTOMER LOGIN")
  // Create a form dynamically
  div = document.getElementById("content")
  var form = createElement("form", div, "customer_email_form");

  createElement("H3", form, "", "Enter email to view your bookings")
  // Create an input element for Email
  var email = createElement("input", form);
  email.setAttribute("type", "text");
  email.setAttribute("name", "email");
  email.setAttribute("placeholder", "Email@example.com");
  email.setAttribute("class", "form-control")


  // Create a submit button
  var s = createElement("input", form);
  s.setAttribute("type", "submit");
  s.setAttribute("value", "Submit");
  s.setAttribute("class", "btn btn-info")


  form.addEventListener('submit', async function(event)
  {
    event.preventDefault();
    customer_email = Object.fromEntries(new FormData(form).entries()).email
    console.log("EMAIL:", customer_email)
    const customer_details = await get_customer_details_from_email(customer_email);
    console.log("DETAILS:", customer_details)
    if (customer_details.length != 0){
      console.log("PLEASE DONT SEE THIS")
      customer_bookings = await get_customer_bookings(customer_details)
      console.log("BOOKINGS:", customer_bookings)
      div.innerHTML = ""
      if (customer_bookings){
        welcomestring = "Welcome Back " + title_case(customer_details.firstname)+ " Here are your Bookings!"  
        createElement("H1", div, "", welcomestring)
        console.log("titleAppearing!?")
        render_car_list_page(customer_bookings, div,date,  buttontype="cancel")
        //render_customer_info_form(customer_email)
      }
      else{
        welcomestring = "Hi " + title_case(customer_details.firstname) + "It looks like you dont have any bookings - check out what cars we have on offer"
      }
    }
    if (customer_details.length == 0){
      console.log("USER DOESNT EXIST")
      render_customer_info_form(customer_email, date)
    }
  })
}

function render_car_filter(){
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


  var date = createElement("INPUT", form, "dateinput")
  date.setAttribute("type", "date")
  date.setAttribute("name", "date")
  date.setAttribute("required", "true")
  date.setAttribute("class", "form-control")

  var button = createElement("INPUT", form, "clickme")
  button.setAttribute("type", "submit");
  button.setAttribute("value", "Submit");
  button.setAttribute("class", "btn btn-info")

 


  form.addEventListener('submit', async function(event)
  {
    event.preventDefault()
    const queries = document.querySelectorAll(".car-attribute")
    dateObject = document.getElementById("dateinput")
    carlist = await get("/api/cars", queries)
    console.log("CARLIST:", carlist)
    if (carlist){
        console.log("OLD CCARLIST", carlist)
        console.log(queries)
        console.log("Date:", dateObject.value)
        console.log(carlist)
        carlist = await filter_out_unavailable_cars(carlist,dateObject.value)
        div = document.getElementById('content')
        div.innerHTML = ''
        if (carlist.length !=0){
          render_car_list_page(carlist, div, dateObject.value, buttontype="book")   
        }
        else{
          createElement("H3", div, undefined, "Im sorry, we dont have any cars available matching your filter criteria")
        }   
        console.log("TAHTS ALL")
      }     
  }
  );
}

function render_image(div, file_name){
  const image = createElement("IMG", div)
  image.setAttribute("src", file_name)
  image.setAttribute("width", "75%")
  image.setAttribute("class", "img-fluid")

}

async function render_customer_bookings(customer_details, date){
  carlist = await get_customer_bookings(customer_details)
  console.log("CARLIST:", carlist)
  div = document.getElementById("content")
  div.innerHTML = ""
  createElement("H2",div,undefined, "Here are your bookings "+customer_details.firstname)
  render_car_list_page(carlist ,div, date, buttontype="cancel")
}

function render_car_list_page(carlist,div,date, buttontype="book"){
  console.log("HERRREEE", carlist)
  for (let i =0; i < carlist.length; i++)
  {
    car = carlist[i]
    console.log("CAR IS HRER",car)
    container = createElement("DIV", div)
    container.setAttribute("class", "w-100 h-25 d-inline-flex p-2 bd-highlight container py-3")
    //Alternates the order of the image and the text
    if (i%2 != 0){
      file_name = "assets/img/" + car.make + "-" + car.model +".jpg"
      render_image(container, file_name)
    }
    //END
    const info = createElement("DIV", container)
    info.setAttribute("class", "bg-info w-25")
    createElement("H2",  info, undefined, car.make.toUpperCase() + " " + car.model.toUpperCase());
    createElement("H3",  info, undefined, "Capacity: " + car.capacity + " Persons");
    if (car.date){
      date = car.date
      createElement("H4", info, undefined, car.date)
    }
    else{
      createElement("H4", info, undefined, date)

    }
    if (buttontype=="book"){
      const button = render_car_selection_button(car, info, "Book This Car", render_email_form,date)
    }
    else{
      const button = render_car_selection_button(car, info, "Cancel Booking", delete_booking, date)
    }
    //Alternates the order of the image and the text#
    if (i%2 == 0){
      file_name = "assets/img/" + car.make + "-" + car.model +".jpg"
      render_image(container, file_name)
    }
    //END
    createElement("SPACER", div)
  }    
}

async function delete_booking(car, date){
 let queries = [{"name": "carid", "value": car.id}, {"name":"date", "value": date}]

  booking_to_delete = await get("/api/bookings", queries)
  console.log("DELETE BOOKING")
  console.log(booking_to_delete)
  await remove("/api/bookings", booking_to_delete[0].id)

  div = document.getElementById("content")
  div.innerHTML = ""
  createElement("H2",div, undefined, "Booking for " + car.make + " " + car.model + " on the " + date + " cancelled")
}

async function render_car_selection_button(instance,div, text, button_function, date){
  
  const button = createElement("BUTTON", div, instance.id, text)
  button.setAttribute("class", "btn btn-primary align-middle")
  button.addEventListener('click', async function(event)
        {
          car = await get("/api/cars/"+button.id)
          if (car){
            console.log("CAR", car)
            button_function(car, date)
          }
          
          
        })
  return button 
}

function render_email_form (car_details, date)
{
  div = document.getElementById('content')
  div.innerHTML = ""
  createElement("H1", div, undefined, "Please enter Name and Email Address to book " + car_details.make.toUpperCase() + " " + car_details.model.toUpperCase())

  // Create a form dynamically
  var form = createElement("form", div, "customer_email_form");

  // Create an input element for Email
  var email = createElement("input", form);
  email.setAttribute("type", "text");
  email.setAttribute("name", "email");
  email.setAttribute("placeholder", "Email@example.com");
  email.setAttribute("required", "true")
  email.setAttribute("class", "form-control")

  // Create a submit button
  var s = createElement("input", form);
  s.setAttribute("type", "submit");
  s.setAttribute("value", "Submit");
  s.setAttribute("class", "btn btn-info")

  console.log("PAGE UPDATED")

  form.addEventListener('submit', async function(event)
  {
    event.preventDefault();
    customer_email = Object.fromEntries(new FormData(form).entries()).email
    const customer_details = await get_customer_details_from_email(customer_email);
    if (customer_details.length != 0){
      create_new_booking(car_details, customer_details, date)
      render_customer_bookings(customer_details, date)


    }
    else if (customer_details.length == 0){
      console.log("rendering info")
      render_customer_info_form(customer_email, car_details, date)
    }
  })
}

function render_customer_info_form(email, car_details, date){
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
  ID.setAttribute("required", "true")
  ID.setAttribute("class", "form-control")
  
  // Create an input element for Surname
  var ID = createElement("input", form);
  ID.setAttribute("type", "text");
  ID.setAttribute("name", "surname");
  ID.setAttribute("placeholder", "surname");
  ID.setAttribute("required", "true")
  ID.setAttribute("class", "form-control")




  // Create a submit button
  var s = createElement("input", form); 
  s.setAttribute("type", "submit");
  s.setAttribute("value", "Submit");
  s.setAttribute("class", "btn btn-info")




  form.addEventListener('submit', async function(event){
    event.preventDefault()
    console.log("INFO BUTTON PRESSED")
    customer_details = Object.fromEntries(new FormData(form).entries())
    customer_details.email = email
    customer_details = await create_new_customer(customer_details)
    if (car_details){
        console.log("DATE TO BE DAATED:", date)
        create_new_booking(car_details, customer_details, date)
        console.log("BookingCreated")
        render_customer_bookings(customer_details)
    }
    else{
      console.log("customer Added")
      div = document.getElementById("content")
      createElement("H2", div, undefined, customer_details.email + "Added as a customer")
      render_customer_bookings(customer_details)
    }


  })
}

async function get_customer_bookings(customer_details){
  console.log("HERE MATEY", customer_details.id)
  let queries = [{"name": "customerid", "value": customer_details.id}]
  let bookings = await get("/api/bookings", queries)
  if (bookings){
    carlist = []
    used_carids = []
    for (i in bookings){
      booking_details = bookings[i]
      let queries = [{"name": "id", "value": booking_details.carid}]
      car_details = await get("/api/cars", queries)
      used_carids.push(booking_details.carid)
      if (car_details){
        for (j in car_details){
          console.log(car_details)
          car_details[j].date = booking_details.date
          carlist.push(car_details[j])
        }
      }
    }
    console.log(carlist, carlist.length)
    return carlist
  }
}

function render_home_page(){
  div = document.getElementById("content")
  div.innerHTML = ""
  p = createElement("P", div, undefined, "Welcome to our Car booking service! - Explore our range of incredible cars")
  render_car_filter()
}

function render_login_page(){
  div = document.getElementById("content")
  div.innerHTML = ""
  p = createElement("P", div, undefined, "Log in to view and manage your booking")
  render_customer_login()
}

render_home_page()
