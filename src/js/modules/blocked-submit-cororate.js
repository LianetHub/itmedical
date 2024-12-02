// document.addEventListener('DOMContentLoaded', function () {
//     // Получаем форму по нужному action
//     const form = document.querySelector('form[action*="/gated-content/#wpcf7-f1729-o1"]');

//     // Находим поле email
//     const emailField = form.querySelector('input[name="email"]');

//     // Проверка на допустимые домены
//     const blockedDomains = /@(gmail\.com|yahoo\.com|yandex\.ru|mail\.ru|hotmail\.com|outlook\.com)$/;

//     // Функция для проверки email и управления состоянием кнопки отправки
//     function validateEmail() {
//         const emailValue = emailField.value;

//         // Проверка, не принадлежит ли почтовый адрес к заблокированным доменам
//         if (blockedDomains.test(emailValue)) {
//             emailField.setCustomValidity('Please use a corporate Email address (Gmail, Yahoo, Yandex, etc. are not acceptable).');
//             form.querySelector('input[type="submit"]').disabled = true; // Отключаем кнопку отправки
//         } else {
//             emailField.setCustomValidity(''); // Убираем сообщение об ошибке
//             form.querySelector('input[type="submit"]').disabled = false; // Включаем кнопку отправки
//         }
//     }

//     // Добавляем обработчик события ввода в поле email
//     emailField.addEventListener('input', validateEmail);
// });

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.wpcf7-form');
    const emailInput = form.querySelector('input[name="email"]');
    const submitButton = form.querySelector('input[type="submit"]');
    const errorContainer = form.querySelector('.wpcf7-response-output');
    const forbiddenDomains = [
        'gmail.com', 'yahoo.com', 'yandex.ru', 'mail.ru', 'outlook.com', 'hotmail.com'
    ];


    const isCorporateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;

        const emailDomain = email.split('@')[1];
        return emailDomain && !forbiddenDomains.includes(emailDomain.toLowerCase());
    };

    const validateEmailInput = () => {
        const emailValue = emailInput.value.trim();


        if (isCorporateEmail(emailValue)) {
            if (errorContainer) {
                errorContainer.textContent = '';
                errorContainer.classList.remove('wpcf7-validation-errors');
            }
            submitButton.disabled = false;
        } else {

            if (errorContainer) {
                errorContainer.textContent = 'Please use a corporate email address.';
                errorContainer.classList.add('wpcf7-validation-errors');
            }
            submitButton.disabled = true;
        }
    };

    emailInput.addEventListener('input', validateEmailInput);

    form.addEventListener('submit', (event) => {
        const emailValue = emailInput.value.trim();

        if (!isCorporateEmail(emailValue)) {
            event.preventDefault();


            if (errorContainer) {
                errorContainer.textContent = 'Please use a corporate email address.';
                errorContainer.classList.add('wpcf7-validation-errors');
            }


            emailInput.focus();
        }
    });


    validateEmailInput();
});

