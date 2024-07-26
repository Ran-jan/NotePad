//***  SELECT ITEMS  *** */
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-all");

//edit option
let editElement;
let editFlag = false;
let editID = "";

//****  Event LISTENERS  ****** */
form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);

window.addEventListener("DOMContentLoaded", setUpItems);

//******FUNCTIONS******** */

function addItem(e) {
  e.preventDefault();
  const value = grocery.value;

  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItems(id, value);

    //display alert
    displayAlert("Item Added to List", "success");
    //show items container
    container.classList.add("show-container");
    //add to localstorage
    addToLocalStorage(id, value);

    //set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Changed Successfully", "success");
    //edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Please Enter a Value", "danger");
    setBackToDefault();
  }
}

//Display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove alert
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
}

//clear all items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));
  }

  displayAlert("Removed All Items", "danger");

  container.classList.remove("show-container");
  setBackToDefault();
  localStorage.removeItem("list");
}

//edit item
function editOne(e) {
  const element = e.currentTarget.parentElement.parentElement;

  //set editItem variable;
  editElement = e.currentTarget.parentElement.previousElementSibling;

  grocery.value = editElement.innerHTML;

  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";
}

//delete item
function deleteOne(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }

  displayAlert("Item Removed", "danger");
  setBackToDefault();

  //remove from local storage
  removeFromLocalStorage(id);
}

//set back to Default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "ADD";
}

//***** LOCAL STORAGE ******* */
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalItems();
  console.log(items);

  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getLocalItems();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalItems();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });

  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalItems() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

//setup items after reload
function setUpItems() {
  let items = getLocalItems();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItems(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItems(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  //add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
                        <div class="btn-container">
                            <a class="edit-btn" aria-labelledBy="Edit">
                                <img src="./assets/edit.png" alt="edit" class="edit-btn">
                            </a>
                            <a class="delete-btn" aria-labelledBy="Delete">
                                <img src="./assets/delete.png" alt="edit" class="delete-btn">
                            </a>
                        </div>`;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");

  deleteBtn.addEventListener("click", deleteOne);
  editBtn.addEventListener("click", editOne);
  //append child to parent
  list.appendChild(element);
}
