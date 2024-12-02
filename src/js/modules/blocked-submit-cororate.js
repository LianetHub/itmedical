document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.wpcf7-form');
    if (!form) return;

    const emailWrap = form.querySelector('[data-name="email"]');
    if (!emailWrap) return;

    const emailInput = emailWrap.querySelector('input[name="email"]');
    if (!emailInput) return;

    const submitButton = form.querySelector('input[type="submit"]');
    if (!submitButton) return;

    const forbiddenDomains = [
        'gmail.com', 'yahoo.com', 'yandex.ru', 'mail.ru', 'outlook.com', 'hotmail.com',
        'aol.com', 'icloud.com', 'msn.com', 'live.com', 'zoho.com', 'protonmail.com'
    ];

    const isCorporateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;

        const emailDomain = email.split('@')[1];
        return emailDomain && !forbiddenDomains.includes(emailDomain.toLowerCase());
    };

    const getEmailTip = () => {
        let emailTip = emailWrap.querySelector('.wpcf7-not-valid-tip');
        if (!emailTip) {
            emailTip = document.createElement('span');
            emailTip.classList.add('wpcf7-not-valid-tip');
            emailTip.setAttribute('aria-hidden', 'true');
            emailWrap.appendChild(emailTip);
        }
        return emailTip;
    };

    const validateEmailInput = () => {
        const emailValue = emailInput.value.trim();
        const emailTip = getEmailTip();

        if (isCorporateEmail(emailValue)) {
            emailInput.classList.remove('wpcf7-not-valid');
            emailInput.setAttribute('aria-invalid', 'false');
            emailTip.setAttribute('aria-hidden', 'true');
            emailTip.textContent = '';
            submitButton.disabled = false;
        } else {
            emailInput.classList.add('wpcf7-not-valid');
            emailInput.setAttribute('aria-invalid', 'true');
            emailTip.setAttribute('aria-hidden', 'false');
            emailTip.classList.add('aria-hidden', 'false');
            emailTip.textContent = 'Please use a corporate email address.';
            submitButton.disabled = true;
        }
    };

    emailInput.addEventListener('input', validateEmailInput);

    form.addEventListener('submit', (event) => {
        const emailValue = emailInput.value.trim();
        const emailTip = getEmailTip();

        if (!isCorporateEmail(emailValue)) {
            event.preventDefault();
            emailInput.classList.add('wpcf7-not-valid');
            emailInput.setAttribute('aria-invalid', 'true');
            emailTip.setAttribute('aria-hidden', 'false');
            emailTip.textContent = 'Please use a corporate email address.';
            submitButton.disabled = true;
            emailInput.focus();
        }
    });

});

