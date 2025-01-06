const form = document.getElementById('my_form');
form.addEventListener('submit', async function(event){
    event.preventDefault();
    const formData = new FormData(form);
    const formJSON = JSON.stringify(Object.fromEntries(formData.entries()));
    console.log("Form data", formJSON);
    const response = await fetch('http://127.0.0.1:3000/api/car/add',
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

const button = document.getElementById("my_button")
const attributes = document.querySelectorAll(".car-attribute")
button.addEventListener('click', async function(event){
    const Url = new URL("http://127.0.0.1:3000/cars/find/");
    for (let i =0; i < attributes.length; i++)
    {
        param = attributes[i]
        console.log(param)
        
          if (param.value != "")
          {
             console.log("ADDING")
             console.log(param.value)
             console.log(param.name)
              Url.searchParams.append(param.name, param.value);

          }
        
    }
   

    console.log(Url.href)




    try{
      let response = await fetch(Url.href);
      
      let carlist = await response.json();
      document.getElementById('carlist').innerHTML = ''
      for (i in carlist){
        car = carlist[i]
        document.getElementById('carlist').innerHTML += `<h1>${car.make.toUpperCase()} ${car.model.toUpperCase()}</h1>`
        document.getElementById('carlist').innerHTML += `<p>Capacity: ${car.capacity}</p>`
      }
       


    } catch(e) {
      alert(e);
    }
  });



/*const button = document.getElementById("my_button")
button.addEventListener("search", async function(event){
    console.log()
    event.preventDefault()
    const response = await fetch("/car/find")
    let body = await response.text()
    document.getElementById("carlist").innerHTML=body
})
const boxElem = document.querySelector(".carlist");*/