const contactInput = document.querySelector("#contact-input");
const phoneInput = document.querySelector("#phone-input");
const formBtn = document.querySelector("#form-btn");
const form = document.querySelector("#form");
const list = document.querySelector("#list");
const PHONE_REGEX = /^[0](412|414|416|426|424|212)[0-9]{7}$/;
const CONTACT_REGEX = /^[A-ZÑ][a-zñ]{2,} [A-ZÑ][a-zñ]{4,16}$/;
let contactValidation = false;
let phoneValidation = false;

contactInput.addEventListener("input", (e) => {
  contactValidation = CONTACT_REGEX.test(contactInput.value);
  const texShow = form.children[1];
  if (contactInput.value === "") {
    contactInput.classList.remove("wrong", "correct");
    texShow.classList.remove("show");
  } else if (contactValidation) {
    contactInput.classList.add("correct");
    contactInput.classList.remove("wrong");
    texShow.classList.remove("show");
  } else {
    contactInput.classList.remove("correct");
    contactInput.classList.add("wrong");
    texShow.classList.add("show");
  }
});
