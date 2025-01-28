import './index.html';
import './assets/style.scss';
import './assets/normalize.css';

import { el, mount } from 'redom';
import { createPayForm } from './assets/components/Form';
import Inputmask from 'inputmask';
import cardValidator from 'card-validator';
import visaImage from './assets/img/visa.svg';
import mastercardImage from './assets/img/mastercard.svg';
import mirImage from './assets/img/mir.svg';
import { isEmail } from 'validator'; // Импорт функции isEmail из библиотеки validator

// Create elements and mount them
const container = el('div', { className: 'container pt-5' });
const headingFormPayPage = el('h1', 'Форма оплаты', {
  className: 'mb-4 fs-1 fw-medium text-body-tertiary',
});
const formContainer = el('div', { id: 'formContainer' });

const formCard = createPayForm();
formContainer.appendChild(formCard.form);

mount(container, headingFormPayPage);
mount(container, formContainer);
mount(document.body, container);

// Initialize Inputmasks
const maskNumberCard = new Inputmask('9999 9999 9999 9999 [99]');
maskNumberCard.mask(formCard.cardNumberInput);

const maskExpirationDate = new Inputmask('99/99');
maskExpirationDate.mask(formCard.cardExpirationDateInput);

const maskCvcCvv = new Inputmask('999');
maskCvcCvv.mask(formCard.cardCvcCvvInput);

const maskEmail = new Inputmask({
  mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
  greedy: false,
  onBeforePaste(pastedValue) {
    const newValue = pastedValue.toLowerCase();
    return newValue.replace('mailto:', '');
  },
  definitions: {
    '*': {
      validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
      casing: 'lower',
    },
  },
});
maskEmail.mask(formCard.cardEmailInput);

// Event listeners for form validation
formCard.cardNumberInput.addEventListener('blur', () => {
  const numberValidation = cardValidator.number(formCard.cardNumberInput.value);

  if (!numberValidation.isPotentiallyValid) {
    showErrorMessage(formCard.cardNumberErrorMessage, formCard.cardNumberInput);
    createDataValidAttributeFalse(formCard.cardNumberInput);
    updateFormDataValidity();
  } else {
    hideErrorMessage(formCard.cardNumberErrorMessage, formCard.cardNumberInput);
    createDataValidAttributeTrue(formCard.cardNumberInput);
    updateFormDataValidity();

    if (numberValidation.card) {
      handleCardTypeImage(numberValidation.card.type);
    }
  }
});

formCard.cardExpirationDateInput.addEventListener('blur', () => {
  const cardExpirationDate = cardValidator.expirationDate(formCard.cardExpirationDateInput.value);

  if (!cardExpirationDate.isPotentiallyValid) {
    showErrorMessage(formCard.cardExpirationDateErrorMessage, formCard.cardExpirationDateInput);
    createDataValidAttributeFalse(formCard.cardExpirationDateInput);
    updateFormDataValidity();
  } else {
    hideErrorMessage(formCard.cardExpirationDateErrorMessage, formCard.cardExpirationDateInput);
    createDataValidAttributeTrue(formCard.cardExpirationDateInput);
    updateFormDataValidity();
  }
});

formCard.cardCvcCvvInput.addEventListener('blur', () => {
  const cardCvcCvv = cardValidator.cvv(formCard.cardCvcCvvInput.value);

  if (!cardCvcCvv.isValid) {
    showErrorMessage(formCard.cardCvcCvvErrorMessage, formCard.cardCvcCvvInput);
    createDataValidAttributeFalse(formCard.cardCvcCvvInput);
    updateFormDataValidity();
  } else {
    hideErrorMessage(formCard.cardCvcCvvErrorMessage, formCard.cardCvcCvvInput);
    createDataValidAttributeTrue(formCard.cardCvcCvvInput);
    updateFormDataValidity();
  }
});

formCard.cardEmailInput.addEventListener('blur', () => {
  const emailValid = isEmail(formCard.cardEmailInput.value); // Использование функции isEmail для проверки

  if (!emailValid) {
    showErrorMessage(formCard.cardEmailErrorMessage, formCard.cardEmailInput);
    createDataValidAttributeFalse(formCard.cardEmailInput);
    updateFormDataValidity();
  } else {
    hideErrorMessage(formCard.cardEmailErrorMessage, formCard.cardEmailInput);
    createDataValidAttributeTrue(formCard.cardEmailInput);
    updateFormDataValidity();
  }
});

formCard.form.addEventListener('submit', e => {
  e.preventDefault();
  if (validateFormFields()) {
    alert('Оплата прошла успешно!');
  } else {
    alert('Пожалуйста, исправьте ошибки в форме, прежде чем продолжить.');
    const firstInvalidField = document.querySelector('.is-invalid');
    if (firstInvalidField) {
      firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// Helper functions
let imageElement;

function handleCardTypeImage(cardType) {
  imageElement?.remove();

  switch (cardType) {
    case 'visa':
      createImageLogoPaySystem(visaImage);
      break;
    case 'mastercard':
      createImageLogoPaySystem(mastercardImage);
      imageElement.style.top = '0';
      imageElement.style.height = '38px';
      break;
    case 'mir':
      createImageLogoPaySystem(mirImage);
      imageElement.style.top = '-6px';
      break;
    default:
      break;
  }

  mount(formCard.cardNumberLabel, imageElement);
}

function createImageLogoPaySystem(srcImage) {
  imageElement = el('img', {
    className: 'img-fluid position-absolute',
    src: srcImage,
    style: {
      top: '3px',
      right: '25px',
      width: '50px',
      borderRadius: '5px',
    },
  });
}

function createDataValidAttributeFalse(input) {
  input.setAttribute('data-valid', false);
}

function createDataValidAttributeTrue(input) {
  input.setAttribute('data-valid', true);
}

function showErrorMessage(errorMessage, input) {
  errorMessage.style.display = 'block';
  input.classList.add('is-invalid');
}

function hideErrorMessage(errorMessage, input) {
  errorMessage.style.display = 'none';
  input.classList.remove('is-invalid');
}

function updateFormDataValidity() {
  const cardNumberData = formCard.cardNumberInput.dataset.valid;
  const cardExpirationDateData = formCard.cardExpirationDateInput.dataset.valid;
  const cardCvcCvvData = formCard.cardCvcCvvInput.dataset.valid;
  const cardEmailData = formCard.cardEmailInput.dataset.valid;

  const isDisabled =
    cardNumberData !== 'true' ||
    cardExpirationDateData !== 'true' ||
    cardCvcCvvData !== 'true' ||
    cardEmailData !== 'true';

  formCard.cardFormButton.disabled = isDisabled;
}

function validateFormFields() {
  const cardNumberValid = !formCard.cardNumberInput.classList.contains('error');
  const expiryDateValid = !formCard.cardExpirationDateInput.classList.contains('error');
  const cvvValid = !formCard.cardCvcCvvInput.classList.contains('error');
  const emailValid = isEmail(formCard.cardEmailInput.value);

  return cardNumberValid && expiryDateValid && cvvValid && emailValid;
}
