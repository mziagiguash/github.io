import { el, setChildren } from 'redom';
import Inputmask from 'inputmask';
import { isEmail } from 'validator';

export function createPayForm() {
  const form = el('form', {
    className: 'form d-flex flex-column',
    action: '#',
  });

  const cardNumberLabel = el('label', {
    className: 'mb-3 position-relative card-number-label',
    for: 'cardNumber',
  });

  const cardNumberInput = el('input', {
    className: 'form-control card-number-input',
    id: 'cardNumber',
    placeholder: 'Номер карты',
    'data-valid': 'false',
    required: true,
  });

  const cardNumberErrorMessage = el(
    'p',
    'Введите номер карты в нужном формате XXXX XXXX XXXX XXXX',
    {
      className: 'error-message position-absolute text-danger',
      style: { top: '-25px', left: '10px', display: 'none' },
    }
  );

  const cardExpirationDateLabel = el('label', {
    className: 'mb-3 position-relative card-expiration-date-label',
    for: 'cardExpirationDate',
  });

  const cardExpirationDateInput = el('input', {
    className: 'form-control card-expiration-date-input',
    id: 'cardExpirationDate',
    placeholder: 'ММ/ГГ',
    'data-valid': 'false',
    required: true,
  });

  const cardExpirationDateErrorMessage = el(
    'p',
    'Введите срок действия карты в формате ММ/ГГ',
    {
      className: 'error-message position-absolute text-danger',
      style: { top: '-25px', left: '10px', display: 'none' },
    }
  );

  const cardCvcCvvLabel = el('label', {
    className: 'mb-3 position-relative card-cvc-cvv-label',
    for: 'cardCvcCvv',
  });

  const cardCvcCvvInput = el('input', {
    className: 'form-control card-cvc-cvv-input',
    id: 'cardCvcCvv',
    placeholder: 'CVC/CVV',
    'data-valid': 'false',
    required: true,
  });

  const cardCvcCvvErrorMessage = el(
    'p',
    'Введите CVC/CVV (3 цифры на обороте карты)',
    {
      className: 'error-message position-absolute text-danger',
      style: { top: '-25px', left: '10px', display: 'none' },
    }
  );

  const cardEmailLabel = el('label', {
    className: 'mb-3 position-relative card-email-label',
    for: 'cardEmail',
  });

  const cardEmailInput = el('input', {
    className: 'form-control card-email-input',
    id: 'cardEmail',
    placeholder: 'E-mail',
    'data-valid': 'false',
    required: true,
  });

  const cardEmailErrorMessage = el('p', 'Email должен содержать "@" и "."', {
    className: 'error-message position-absolute text-danger',
    style: { top: '-25px', left: '10px', display: 'none' },
  });

  const cardFormButton = el('button', 'Оплатить', {
    className: 'btn btn-primary w-25',
    disabled: true,
  });

  setChildren(cardNumberLabel, [cardNumberInput, cardNumberErrorMessage]);
  setChildren(cardExpirationDateLabel, [
    cardExpirationDateInput,
    cardExpirationDateErrorMessage,
  ]);
  setChildren(cardCvcCvvLabel, [cardCvcCvvInput, cardCvcCvvErrorMessage]);
  setChildren(cardEmailLabel, [cardEmailInput, cardEmailErrorMessage]);

  setChildren(form, [
    cardNumberLabel,
    cardExpirationDateLabel,
    cardCvcCvvLabel,
    cardEmailLabel,
    cardFormButton,
  ]);

  const maskNumberCard = Inputmask('9999 9999 9999 9999 [99]');
  maskNumberCard.mask(cardNumberInput);

  const maskExpirationDate = Inputmask('99/99');
  maskExpirationDate.mask(cardExpirationDateInput);

  const maskCvcCvv = Inputmask('999');
  maskCvcCvv.mask(cardCvcCvvInput);

  const maskEmail = Inputmask({
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
  maskEmail.mask(cardEmailInput);

  function validateInput(inputElement, errorMessageElement, validatorFn) {
    const isValid = validatorFn(inputElement.value);
    inputElement.classList.toggle('error', !isValid);
    errorMessageElement.style.display = isValid ? 'none' : 'block';
    return isValid;
  }

  cardNumberInput.addEventListener('input', () => {
    validateInput(cardNumberInput, cardNumberErrorMessage, (value) =>
      value.replace(/\s/g, '').length === 16
    );
    toggleSubmitButton();
  });

  cardExpirationDateInput.addEventListener('input', () => {
    validateInput(
      cardExpirationDateInput,
      cardExpirationDateErrorMessage,
      (value) => /^(\d{2}\/\d{2})$/.test(value)
    );
    toggleSubmitButton();
  });

  cardCvcCvvInput.addEventListener('input', () => {
    validateInput(cardCvcCvvInput, cardCvcCvvErrorMessage, (value) =>
      /^\d{3}$/.test(value)
    );
    toggleSubmitButton();
  });

  cardEmailInput.addEventListener('input', () => {
    validateInput(cardEmailInput, cardEmailErrorMessage, isEmail);
    toggleSubmitButton();
  });

  function toggleSubmitButton() {
    const isFormValid = validateFormFields();
    cardFormButton.disabled = !isFormValid;
  }

  function validateFormFields() {
    const cardNumberValid = !cardNumberInput.classList.contains('error');
    const expiryDateValid = !cardExpirationDateInput.classList.contains('error');
    const cvvValid = !cardCvcCvvInput.classList.contains('error');
    const emailValid = !cardEmailInput.classList.contains('error');

    return cardNumberValid && expiryDateValid && cvvValid && emailValid;
  }

  function showSuccessMessage() {
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
  }

  function showErrorMessage() {
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
  }

  cardFormButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (validateFormFields()) {
      showSuccessMessage();
    } else {
      showErrorMessage();
    }
  });

  return {
    form,
    cardNumberLabel,
    cardNumberInput,
    cardNumberErrorMessage,
    cardExpirationDateLabel,
    cardExpirationDateInput,
    cardExpirationDateErrorMessage,
    cardCvcCvvLabel,
    cardCvcCvvInput,
    cardCvcCvvErrorMessage,
    cardEmailLabel,
    cardEmailInput,
    cardEmailErrorMessage,
    cardFormButton,
  };
}

export default createPayForm;
