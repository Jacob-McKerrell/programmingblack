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



function render_car_admin() {
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



render_car_admin()




