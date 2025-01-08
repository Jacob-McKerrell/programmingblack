
//This Function is responsible for adding new cars
const form = document.getElementById('my_form');
form.addEventListener('submit', async function(event){
    event.preventDefault();
    const formData = new FormData(form);
    const formJSON = JSON.stringify(Object.fromEntries(formData.entries()));
    console.log("Form data", formJSON);
    const response = await fetch('http://127.0.0.1:3000/api/cars',
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
              },
            body: formJSON
        });
    let body = await response.text();
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
        const booking_button = createElement("BUTTON", carlistdiv, car.id, "Book This Car")

        booking_button.addEventListener('click', async function(event)
        {
          const car_url = "http://127.0.0.1:3000/api/cars/" + booking_button.id
          console.log(car_url)
          response = await fetch(car_url);
          const car = await response.json();
          console.log("HERE", car)
          create_customer_details(car)

          
        }
        )
      }    
      
    } catch(e) 
    {
      alert(e); // Displays the Error if something goes wrong!
    }     
  }
);

create_customer_details = async function(car)
{
  
  carlistdiv = document.getElementById('carlist')
  carlistdiv.innerHTML = ""
  customerdetailsdiv = document.getElementById("customerdetails")
  createElement("H1", customerdetailsdiv, undefined, "Please enter Name and Email Address to book " + car.make.toUpperCase() + " " + car.model.toUpperCase())
  
  // Create a form dynamically
  var form = createElement("form", customerdetailsdiv, "customer_form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "submit.php");

  // Create an input element for emailID
  var ID = createElement("input", form);
  ID.setAttribute("type", "text");
  ID.setAttribute("name", "name");
  ID.setAttribute("placeholder", "Name");

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
  const custform = document.getElementById("customer_form");
  custform.addEventListener('submit', async function(event)
    {
      console.log("BUTTON PRESSEDDD")
      event.preventDefault();
      const formData = new FormData(custform);
      const formJSON = JSON.stringify(Object.fromEntries(formData.entries()));
      console.log("Form data", formJSON);
      const response = await fetch('http://127.0.0.1:3000/api/customers',
          {
              method: 'POST',
              headers: 
                {
                  "Content-Type": "application/json"
                },
              body: formJSON
          }
        );
      let body = (await response.json());
      latest_item = body[body.length-1]

      var customer = latest_item
      book_car(car, customer)
    })
}








book_car = async function(car, customer)
{
  console.log(car)
  JSONform = JSON.stringify({"customerid": customer.id, "carid": car.id})
  const response = await fetch('http://127.0.0.1:3000/api/bookings',
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
          },
        body: JSONform
    });
let body = await response.text();
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