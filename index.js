const contactInput = document.querySelector("#contact-input");
const phoneInput = document.querySelector("#phone-input");
const formBtn = document.querySelector("#form-btn");
const form = document.querySelector("#form");
const list = document.querySelector("#list");
const PHONE_REGEX = /^[0](412|414|416|426|424|212)[0-9]{7}$/;
const CONTACT_REGEX = /^[A-ZÑ][a-zñ]{2,} [A-ZÑ][a-zñ]{4,16}$/;
let contactValidation = false;
let phoneValidation = false;

const validateInput = (input, isValidedRegex, texShow) => {
  if (input.value === "") {
    input.classList.remove("wrong", "correct");
    texShow.classList.remove("show");
  } else if (isValidedRegex) {
    input.classList.add("correct");
    input.classList.remove("wrong");
    texShow.classList.remove("show");
  } else {
    input.classList.remove("correct");
    input.classList.add("wrong");
    texShow.classList.add("show");
  }
}

contactInput.addEventListener("input", (e) => {
  contactValidation = CONTACT_REGEX.test(contactInput.value);
  const texShow = form.children[1];
    validateInput(contactInput, contactValidation, texShow)
});

phoneInput.addEventListener("input", (e) => {
    phoneValidation = PHONE_REGEX.test(phoneInput.value);
    const texShow = form.children[3];
      validateInput(phoneInput, phoneValidation, texShow)
  });
