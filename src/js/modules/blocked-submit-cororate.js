document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.wpcf7-form');
    if (!form) return;

    const forbiddenDomains = [
        'gmail', 'yahoo', 'yandex', 'mail', 'outlook', 'hotmail',
        'aol', 'icloud', 'msn', 'live', 'zoho', 'protonmail'
    ];

    const isCorporateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return false;

        const emailDomain = email.split('@')[1]?.toLowerCase();
        const domainWithoutTLD = emailDomain?.split('.')[0];
        return emailDomain && !forbiddenDomains.some(domain => domainWithoutTLD === domain);
    };

    const extendCF7Validation = () => {
        const emailInput = form.querySelector('input[name="email"]');
        if (!emailInput) return;

        const validateEmail = () => {
            const emailValue = emailInput.value.trim();

            if (!isCorporateEmail(emailValue)) {
                emailInput.classList.add('wpcf7-not-valid');
                emailInput.setAttribute('aria-invalid', 'true');

                const errorEvent = new Event('wpcf7invalid', {
                    bubbles: true,
                    detail: { input: emailInput }
                });
                emailInput.dispatchEvent(errorEvent);
                return false;
            }

            emailInput.classList.remove('wpcf7-not-valid');
            emailInput.setAttribute('aria-invalid', 'false');
            return true;
        };

        emailInput.addEventListener('input', () => {
            const isValid = validateEmail();
            console.log('valid', isValid);

        });
        emailInput.addEventListener('blur', () => {
            const isValid = validateEmail();
            console.log('valid', isValid);
        });

    };

    form.addEventListener('submit', (event) => {
        const emailInput = form.querySelector('input[name="email"]');
        if (!emailInput) return;

        const isValid = isCorporateEmail(emailInput.value.trim());

        if (!isValid) {
            event.preventDefault();
            const errorEvent = new CustomEvent('wpcf7invalid', {
                bubbles: true,
                detail: { input: emailInput }
            });
            form.dispatchEvent(errorEvent);
        }
    });

    extendCF7Validation();
});
