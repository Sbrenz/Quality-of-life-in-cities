import '../css/style.css';

//STRUCTURE

const mainPage = document.createElement('div');
mainPage.classList.add('mainPage');
document.body.appendChild(mainPage);

mainPage.innerHTML = `
<h1>Write a name of a city and find out its quality of life</h1>

<div id="formDiv">
    <form>
        <input type="text" id="textInput" placeholder="enter the name of a city" required/>
        <button type="submit">search</button>
    </form>
</div>
<div id="summary"></div>
<div id="categories"></div>`;

const formDiv = document.getElementById('formDiv');
formDiv.classList.add('formDiv');

const form = document.forms[0];
const textInput = document.getElementById("textInput");
const summary = document.getElementById("summary");
const categories = document.getElementById("categories");


//EVENT ON BUTTON

form.addEventListener("submit", (e) => {
  e.preventDefault();
  summary.innerHTML = "";
  categories.innerHTML = "";
  api(correctInput(textInput.value));
});
const correctInput = (input) => input.toLowerCase().replace(" ", "-");


// TELEPORT API 

const api = async (city) => {
  
    const res = await fetch(`https://api.teleport.org/api/urban_areas/slug:${city}/scores/`);

    if (res.status !== 404) {
      const text = await res.json();
      const { categories, summary } = text;

      // DECRIPTION

      const par = document.getElementById("summary");
      par.insertAdjacentHTML("afterbegin", summary);

      // CATEGORIES 

      categories.forEach((e) => {
        const el = document.createElement("p");
        el.textContent = `${e.name}: ${e.score_out_of_10.toFixed(1)}`;
        document.getElementById("categories").appendChild(el);
      });
      return;
    }else{
      showError("This city is not available.");
    }
};

// ERROR FOR THE LANGUAGE

const showError = (errorMessage) => {
  summary.innerHTML = `${errorMessage} Please write in english.`;
  categories.innerHTML = "";
};