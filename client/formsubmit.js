const post = async function(formJSON, url){
  const response = await fetch(url,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
          },
        body: formJSON
    });
    let body = await response.text()
    return body
}






//This Function is responsible for adding new cars when button is pressed
const form = document.getElementById('my_form');
form.addEventListener('submit', async function(event){
    event.preventDefault();
    const formData = new FormData(form);
    const formJSON = JSON.stringify(Object.fromEntries(formData.entries()));
    console.log("Form data", formJSON);
    let body = post(formJSON, "http://127.0.0.1:3000/api/cars")
    document.getElementById('content').innerHTML="ADDED";
})


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
      carlistdiv = document.getElementById('carlist')
      carlistdiv.innerHTML = ''
      for (i in carlist)
      {
        car = carlist[i]
        createElement("H1",  carlistdiv, undefined, car.make + " " + car.model.toUpperCase());
        createElement("P",  carlistdiv, undefined, "Capacity: " + car.capacity + " Persons");
        const booking_button = create_booking_button()
      }    
      
    } catch(e) 
    {
      alert(e); // Displays the Error if something goes wrong!
    }     
  }
);

create_booking_button = function(){
  console.log(car.id)
  const booking_button = createElement("BUTTON", carlistdiv, car.id, "Book This Car")
  booking_button.addEventListener('click', async function(event)
        {
          const car_url = "http://127.0.0.1:3000/api/cars/" + booking_button.id
          console.log(car_url)
          response = await fetch(car_url);
          const car = await response.json();
          display_email_form(car) 
          await on_email_submit()
        })
  return booking_button
  
}



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
display_email_form = function(car)
{
  

  carlistdiv = document.getElementById('carlist')
  carlistdiv.innerHTML = ""
  customerdetailsdiv = document.getElementById("customerdetails")
  createElement("H1", customerdetailsdiv, undefined, "Please enter Name and Email Address to book " + car.make.toUpperCase() + " " + car.model.toUpperCase())
  
  // Create a form dynamically
  var form = createElement("form", customerdetailsdiv, "customer_form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "submit.php");

  // Create an input element for password
  var PWD = createElement("input", form);
  PWD.setAttribute("type", "text");
  PWD.setAttribute("name", "emailID");
  PWD.setAttribute("placeholder", "Email@example.com");

  // Create a submit button
  var s = createElement("input", form);
  s.setAttribute("type", "submit");
  s.setAttribute("value", "Submit");

  console.log("PAGE UPDATED")
}
on_email_submit = function()
{
  const custform = document.getElementById("customer_form");
  custform.addEventListener('submit', async function(event)
    {
      console.log("BUTTON PRESSEDDD")
      event.preventDefault();
      const emailID = new FormData(custform);
      const emailJSON = (Object.fromEntries(emailID.entries()));
      console.log("Form data", emailJSON);
      get_or_create_customer(emailJSON)
    })

}
get_or_create_customer = async function(emailJSON)
{

  //GET CUSTOMER IF EMAIL ALREADY EXISTS
  cust_emailID = emailJSON.emailID
  emailJSON = JSON.stringify(emailJSON)
  url = new URL("http://127.0.0.1:3000/api/customers")
  url.searchParams.append("email", cust_emailID)
  var response = await fetch(url.href)
  const customers = await response.json()
  console.log("CUSTOMERS", customers, url.href)
  if (customers.length != 0)
    {
    console.log("HERE")
    return customers[0]
    }

  // OR CREATE CUSTOMER IF IT IS A NEW CUSTOMER
  console.log("CREATING NEW CUSTOMER")
  create_customer(cust_emailID)  
}

display_name_form = function()
{

    customerdetailsdiv = document.getElementById("customerdetails")
    customerdetailsdiv.innerHTML = ""
    createElement("H1", customerdetailsdiv, undefined, "Continue Setting Up Account for " + cust_emailID)
    
    // Create a form dynamically
    var form = createElement("form", customerdetailsdiv, "customer_form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "submit.php");

    // Create an input element for emailID
    var ID = createElement("input", form);
    ID.setAttribute("type", "text");
    ID.setAttribute("name", "firstname");
    ID.setAttribute("placeholder", "firstname");
    
    // Create an input element for emailIDs
    var ID = createElement("input", form);
    ID.setAttribute("type", "text");
    ID.setAttribute("name", "surname");
    ID.setAttribute("placeholder", "surname");

    // Create a submit button
    var s = createElement("input", form); 
    s.setAttribute("type", "submit");
    s.setAttribute("value", "Submit");

}

create_customer = async function(cust_emailID)
  {
    display_name_form()
    const custform = document.getElementById("customer_form");
    custform.addEventListener('submit', async function(event)
      {
      event.preventDefault();
      const formData = new FormData(custform);
      const formJSON = (Object.fromEntries(formData.entries()));
      formJSON.email = cust_emailID
      console.log("Form data", formJSON);
      JSONform = JSON.stringify(formJSON)
      post(JSONform, "http://127.0.0.1:3000/api/customers")
      }
    )
    } 

book_car = async function(car, customer)
{
  console.log(car)
  JSONform = JSON.stringify({"customerid": customer.id, "carid": car.id})
  let body = post(JSONform, 'http://127.0.0.1:3000/api/bookings')
  document.getElementById('content').innerHTML="ADDED", body;

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