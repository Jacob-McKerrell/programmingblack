async function post(entity, url){
  const response = await fetch(url,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(entity)
    });
    return await response.json()
}
function create_new_car(car_details){
  post(car_details, "http://127.0.0.1:3000/api/cars")
}
//render_car_admin(create_new_car)


//This function is responsible for filtering and displaying cars
const button = document.getElementById("my_button")
button.addEventListener('click', async function(event)
{
    // Obtains Attributes specified in the html form element and
    // produces a URL with the necessary queries to be sent to 
    // the server script get request at /cars/
    const attributes = document.querySelectorAll(".car-attribute")
    const url = new URL("http://127.0.0.1:3000/api/cars/");
    for (let i =0; i < attributes.length; i++)
    {
      param = attributes[i]
        if (param.value != "")
        {
          url.searchParams.append(param.name, param.value);
        }     
    }
    // Calls Get request at http://127.0.0.1:3000/api/cars/ with the relevant
    // parameters also included
    try
    {
      let response = await fetch(url.href);
      let carlist = await response.json();
      render_car_list(carlist)      
    } catch(e) 
    {
      alert(e); // Displays the Error if something goes wrong!
    }     
  }
);


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
async function get_customer_details_from_email(email)
{
  url = new URL("http://127.0.0.1:3000/api/customers")
  url.searchParams.append("email", email)
  var response = await fetch(url.href)
  const customers = await response.json()
  console.log("CUSTOMERS", customers, url.href, customers.length)
  if (customers.length == 0)
    {
    return undefined
    }
  else{
    return customers[0]
  }   
}



function create_new_customer(customer_details){
  post(customer_details, "http://127.0.0.1:3000/api/customers")
}

function create_new_booking(car_details, customer_details){
  const booking_details = {"customerid": customer_details.id, "carid": car_details.id}
  post(booking_details, 'http://127.0.0.1:3000/api/bookings')

}

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

booking_buttons = document.querySelectorAll(".booking-button")

for(let button of booking_buttons){
  let clickable_parent = img.parentElement.parentElement.parentElement
  clickable_parent.addEventListener("click", () => {
      img.classList.remove("invisible")
  })
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






/// RENDERING FUNCTIONS///

function render_car_admin(create_new_car) {
  console.log("RENDERING CAR ADMIIN")
  //This Function is responsible for adding new cars when button is pressed
  const form = document.getElementById('my_form');
  form.addEventListener('submit', async function(event){
    event.preventDefault();
    create_new_car(Object.fromEntries(new FormData(form).entries()));   
  })
}


function render_car_list(carlist){
  div = document.getElementById('content')
  div.innerHTML = ''
  for (i in carlist)
  {
    car = carlist[i]
    console.log(car)
    createElement("H1",  div, undefined, car.make + " " + car.model.toUpperCase());
    createElement("P",  div, undefined, "Capacity: " + car.capacity + " Persons");
    const button = render_car_selection_button(car, render_email_form)
  }    
}


render_car_selection_button = function(instance, render_email_form){
  const button = createElement("BUTTON", div, instance.id, "Book This Car")
  button.addEventListener('click', async function(event)
        {
          const url = "http://127.0.0.1:3000/api/cars/" + button.id
          response = await fetch(url);
          const car = await response.json();
          render_email_form(car) 
        })
  return button 
}

function render_email_form (car_details)
{
  div = document.getElementById('content')
  div.innerHTML = ""
  createElement("H1", div, undefined, "Please enter Name and Email Address to book " + car_details.make.toUpperCase() + " " + car_details.model.toUpperCase())

  // Create a form dynamically
  var form = createElement("form", div, "customer_form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "submit.php");

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
      create_new_booking(customer_email, car_details)
    }
    else{
      render_customer_info_form(customer_email, car_details)
    }
  })
}


function render_customer_info_form(email, car_details){
  div = document.getElementById("content")
  div.innerHTML = ""
  createElement("H1", div, undefined, "Continue Setting Up Account for " + email)
  
  // Create a form dynamically
  var form = createElement("form", div, "customer_form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "submit.php");

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
    customer_details = Object.fromEntries(new FormData(custform).entries())
    customer_details.email = email
    booking_details = get_booking_details(customer_details, car_details)
    add_new_booking(car_details, customer_details)

  })
}
