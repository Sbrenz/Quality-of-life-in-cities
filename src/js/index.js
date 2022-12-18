import "../css/style.css";

//STRUCTURE

const mainPage = document.createElement("div");

mainPage.classList.add("mainPage");

document.body.appendChild(mainPage);

mainPage.innerHTML = `
<h1>Hey there, what's up ? <br>
Write a name of a city and find out its quality of life !</h1>

<div id="formDiv">
    <form>
        <input class="input" type="text" id="textInput" placeholder="enter the name of a city" required/>
        <button class="btn" type="submit">search</button>
    </form>
    <div id="doneBox"></div>
</div>
<div id="summary"></div>
<div id="categories"></div>`;

const formDiv = document.getElementById("formDiv");
formDiv.classList.add("formDiv");

const form = document.forms[0];

const textInput = document.getElementById("textInput");
textInput.classList.add("input");

const btn = document.querySelector("button");
btn.classList.add("btn");

const summary = document.getElementById("summary");

const categories = document.getElementById("categories");

const doneBox = document.getElementById("doneBox");
doneBox.classList.add("doneBox");

//EVENT ON BUTTON

form.addEventListener("submit", (e) => {
  e.preventDefault();
  summary.innerHTML = "";
  categories.innerHTML = "";
  api(correctInput(textInput.value));
});
const correctInput = (input) => input.toLowerCase().replace(" ", "-");

// TELEPORT API
const handleErrors = (res) => {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res;
};

const api = async (city) => {
  await fetch(`https://api.teleport.org/api/urban_areas/slug:${city}/scores/`)
    .then(handleErrors)
    .then(async (res) => {
      if (res.status !== 404) {
        const text = await res.json();
        const { categories, summary } = text;

        // DECRIPTION
        const par = document.getElementById("summary");
        par.insertAdjacentHTML("afterbegin", summary);
        par.classList.add("sumstyle");

        // CATEGORIES
        categories.forEach((e) => {
          const el = document.createElement("p");
          el.textContent = `${e.name}: ${e.score_out_of_10.toFixed(1)}`;
          document.getElementById("categories").appendChild(el);
        });
        return;
      }
    })
    .catch((e) => {
      showError(
        "This city is not available or you're having an error from the server, check your connection.<br>"
      );
    })
    .finally(() => (doneBox.innerHTML = "Thanks !"));
};

// ERROR FOR THE LANGUAGE
const showError = (e) => {
  summary.innerHTML = `${e} Please write in english.`;
  categories.innerHTML = "";
};
