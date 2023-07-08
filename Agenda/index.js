const contactInput = document.querySelector("#contact-input");
const phoneInput = document.querySelector("#phone-input");
const formBtn = document.querySelector("#form-btn");
const form = document.querySelector("#form");
const list = document.querySelector("#list");
const PHONE_REGEX = /^[0](412|414|416|426|424|212)[0-9]{7}$/;
const CONTACT_REGEX = /^[A-ZÑ][a-zñ]{2,10} [A-ZÑ][a-zñ]{4,16}$/;
let contactValidation = false;
let phoneValidation = false;
let isValidateName = true;
let isValidatePhone = true;
const menuIcon = document.querySelector("#bars-icon");
const MenuContainer = document.querySelector(".menu-container");
const editBtn = document.querySelector("#edit-btn");
const user = JSON.parse(localStorage.getItem('users'));
const exitBtn = document.querySelectorAll(".exit-icon");
console.log(user);

(()=>{
  if (!user) {
    window.location.href = `../index.html`;
  }
})()

// validar la informacion
const validateInput = (input, isValidedRegex, texShow) => {
  formBtn.disabled = contactValidation && phoneValidation ? false : true;
  if (input.value === "") {
    input.classList.remove("wrong", "correct");
    texShow?.classList.remove("show");
  } else if (isValidedRegex) {
    input.classList.add("correct");
    input.classList.remove("wrong");
    texShow?.classList.remove("show");
  } else {
    input.classList.remove("correct");
    input.classList.add("wrong");
    texShow?.classList.add("show");
  }
};

contactInput.addEventListener("input", (e) => {
  contactValidation = CONTACT_REGEX.test(contactInput.value);
  const texShow = form.children[1];
  validateInput(contactInput, contactValidation, texShow);
});

phoneInput.addEventListener("input", (e) => {
  phoneValidation = PHONE_REGEX.test(phoneInput.value);
  const texShow = form.children[3];
  validateInput(phoneInput, phoneValidation, texShow);
});

// se agrega en la base de datos y en el html 
form.addEventListener("submit",async (e) => {
  e.preventDefault();
   const responseJSON = await fetch(`http://localhost:3000/agenda`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({contact: contactInput.value, phone: phoneInput.value, user: user.username}),
    });
    const response = await responseJSON.json();
    // console.log(response);
  const li = document.createElement("li");
  li.innerHTML = `
  <li class="agenda" id="${response.id}">
    <input class="agendado" type="text" value="${response.contact}" readonly>
    <input class="agendado" type="text" value="${response.phone}" readonly>
    <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
    <button class="edit-btn" disabled><svg class="svg-edit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg></button>
  </li>
  `;
  list.append(li);
  contactInput.value = "";
  phoneInput.value = "";
  validateInput(contactInput);
  validateInput(phoneInput);
  contactValidation = false;
  phoneValidation = false;
  formBtn.disabled = true;
  // localStorage.setItem("listaContactos", list.innerHTML);
});

list.addEventListener("click",async (e) => {
  if (e.target.closest(".delete-btn")) {
     const id = e.target.closest(".delete-btn").parentElement.id;
    await fetch(`http://localhost:3000/agenda/${id}`, {method: 'DELETE'});
    // aqui se borra del html 
    e.target.closest(".delete-btn").parentElement.remove();
    // localStorage.setItem("listaContactos", list.innerHTML);
  }

  // if de editar 
  if (e.target.closest(".edit-btn")) {
    // con estas dos variables obtengo la informacion al momento de editar
    const getItemContact = e.target.closest(".edit-btn").parentElement.children[0].value;
    const getItemPhone = e.target.closest(".edit-btn").parentElement.children[1].value;
    // console.log(getItemContact, getItemPhone);
    const id = e.target.closest(".edit-btn").parentElement.id;
    // console.log(id);
    const body = JSON.stringify({contact: getItemContact, phone: getItemPhone, user: user.username});
    // console.log(body);
          await fetch(`http://localhost:3000/agenda/${id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json'
          },
          body: body,
  });
    // console.log(response);
    const editIcon = e.target.closest(".edit-btn");
    const editInput = editIcon.parentElement.children[0];
    const editInput2 = editIcon.parentElement.children[1];
    editInput.addEventListener("input", (e) => {
      isValidateName = CONTACT_REGEX.test(editInput.value);
      validateInput(editInput, isValidateName);
    });
    editInput2.addEventListener("input", (e) => {
      isValidatePhone = PHONE_REGEX.test(editInput2.value);
      validateInput(editInput2, isValidatePhone);
    });
    if (editIcon.classList.contains("editando") && isValidateName && isValidatePhone
    ) {
      editIcon.classList.remove("editando");
      editInput.setAttribute("value", editInput.value);
      editInput.setAttribute("readonly", "true");
      editInput.classList.remove("editing");
      editInput2.setAttribute("value", editInput2.value);
      editInput2.setAttribute("readonly", "true");
      editInput2.classList.remove("editing");
      editInput.classList.remove("correct");
      editInput2.classList.remove("correct");
      editIcon.innerHTML = `
      <svg class="svg-edit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
          `;
      // localStorage.setItem("listaContactos", list.innerHTML);
    } else {
      editIcon.classList.add("editando");
      editInput.removeAttribute("readonly");
      editInput.classList.add("editing");
      editInput2.removeAttribute("readonly");
      editInput2.classList.add("editing");
      const end = editInput.value.length;
      editInput.setSelectionRange(end, end);
      editInput.focus();
      editIcon.innerHTML = `
      <svg class="svg-edit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" ><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
            `;
    }
  }
});
// para cerrar sesion 
exitBtn.forEach(element => {
  element.addEventListener("click",async (e) => {
    localStorage.removeItem('users');
    window.location.href = `../index.html`;
  });
})
// menu movil 
menuIcon.addEventListener("click", (e) => {
  MenuContainer.classList.toggle("show-menu");
});

const getAgenda = async () => {
  const response = await fetch (`http://localhost:3000/agenda`, {method: 'GET'});
  const agenda = await response.json();
  const userAgenda = agenda.filter(contacto => contacto.user === user.username);
  console.log(userAgenda);
  userAgenda.forEach(element => {
    const li = document.createElement("li");
  li.innerHTML = `
  <li class="agenda" id="${element.id}">
    <input class="agendado" type="text" name="contact" value="${element.contact}" readonly>
    <input class="agendado" type="text" name="phone" value="${element.phone}" readonly>
    <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
    <button class="edit-btn" disabled><svg class="svg-edit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg></button>
  </li>
  `;
  list.append(li);
  });
}
getAgenda();

// (() => {
//   const localList = localStorage.getItem("listaContactos");
//   list.innerHTML = localList;
// })();
