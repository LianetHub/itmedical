"use strict";

document.addEventListener('DOMContentLoaded', () => {

	const defaultSettings = {
		form_guid: "4e51554c-e02d-4831-adf7-e4ce1dc392eb",
		gtm_event: "contact_form_submit",
		redirect_to_thanks_page: false,
		redirect_url: ""
	};

	const formSettingsDataSafe = typeof formSettingsData !== 'undefined' ? formSettingsData : {};
	const { formSettings = defaultSettings, formSettings2 } = formSettingsDataSafe;
	const hasFormSettings2 = typeof formSettings2 !== 'undefined';


	let hubspotSent = false;
	let reCaptchaPassed = false;
	let akismetPassed = false;

	document.addEventListener('wpcf7mailsent', async function (event) {
		const response = event.detail.apiResponse;
		event.target.reset = function () { };
		if (response && response.status === 'mail_sent') {
			reCaptchaPassed = true;
			akismetPassed = true;
			checkAllConditions(event.target);
			console.log("Contact Form 7: Успешная отправка Hubspot, reCAPTCHA и Akismet прошли проверку.");
		}
	}, false);

	document.addEventListener('wpcf7invalid', function () {
		console.log("Contact Form 7: Ошибка при проверке формы, возможно, reCAPTCHA или Akismet не прошли проверку.");
		reCaptchaPassed = false;
		akismetPassed = false;
	});

	document.addEventListener('wpcf7spam', function (event) {
		console.log("Contact Form 7: Форма отклонена как спам, Akismet не прошел проверку.");
		akismetPassed = false;

		let form = event.target;
		let errorMessage = form.querySelector('.spam-error-message');

		if (!errorMessage) {
			errorMessage = document.createElement('div');
			errorMessage.classList.add('form__error-message', 'spam-error-message', 'visible');
			errorMessage.textContent = 'Your data has not been checked for spam. Try introducing yourself to the author later.';
			form.appendChild(errorMessage);
		}
	});


	document.addEventListener('wpcf7submit', function (event) {
		let form = event.target;
		let errorMessage = form.querySelector('.spam-error-message');
		if (errorMessage) {
			errorMessage.remove();
		}
	});

	async function checkAllConditions(form) {
		if (reCaptchaPassed && akismetPassed) {
			let isFirstForm = false;
			let config = formSettings;

			if (hasFormSettings2) {
				isFirstForm = form.closest('.wpcf7').id === 'wpcf7-f1756-o1';
				config = isFirstForm ? formSettings : formSettings2;
			}

			await sendToHubspot(form, config);
			sendGtmEvent(config.gtm_event || formSettings.gtm_event);
		}
	}

	async function sendToHubspot(form, config) {
		console.log('form', form);

		const portalId = 7649479;
		const formGuid = config.form_guid;
		const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

		let formData = new FormData(form);
		form.classList.add("_sending");

		let hubspotData = {
			fields: [],
			context: {
				pageUri: window.location.href,
				pageName: document.title
			}
		};

		let fileUploadPromises = [];
		let fileFields = [];

		formData.forEach((value, key) => {
			if (key.startsWith('_wpcf7') || key.indexOf('_wpcf7') === 0) {
				return;
			}

			if (value instanceof File) {
				if (value.size > 0) {
					fileUploadPromises.push(uploadFile(value).then(url => {
						if (url) {
							fileFields.push({ "name": key.toString(), "value": url });
						}
					}));
				}
			} else {
				if (key === 'nda') {
					value = value === 'on' ? 'true' : 'false';
				}

				if (value && value.toString().trim() !== '') {
					hubspotData.fields.push({
						"name": key.toString(),
						"value": value.toString()
					});
				}
			}
		});

		const utmParams = getUTMParams();

		Object.entries(utmParams).forEach(([key, value]) => {
			if (value) {
				hubspotData.fields.push({
					"name": key,
					"value": value
				});
			}
		});


		try {
			await Promise.all(fileUploadPromises);
			hubspotData.fields.push(...fileFields);

			let response = await fetch(hubspotUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(hubspotData)
			});

			if (response.ok) {
				hubspotSent = true;

				if (config.redirect_to_thanks_page) {
					window.location.href = '/thank-you/';
				} else {
					form.classList.remove("_sending");
					form.classList.add('_success');
					setTimeout(() => {
						form.classList.remove('_success');
						form.reset();
						hubspotSent = false;
					}, 10000);
				}

				if (config.redirect_url && config.redirect_url.length > 0) {
					window.open(config.redirect_url, '_blank');
				}

				console.log("Success sending");
			} else {
				form.classList.remove("_sending");
				console.error("Form submission error:", await response.json());
			}
		} catch (error) {
			form.classList.remove("_sending");
			console.error("Error uploading files:", error);
		}
	}

	async function uploadFile(file) {
		const formData = new FormData();
		formData.append('file', file);

		try {
			let response = await fetch('/upload.php', {
				method: 'POST',
				body: formData
			});

			let result = await response.json();
			if (result.status) {
				const currentUrl = window.location.origin;
				return `${currentUrl}/uploads/${file.name}`;
			} else {
				console.error("File upload error:", result.message);
				return null;
			}
		} catch (error) {
			console.error("File upload failed:", error);
			return null;
		}
	}

	function sendGtmEvent(eventName) {

		console.log("GTM Event Submited", "Event Name:", eventName);
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			'event': eventName,
			'v_category': 'Contact Form',
			'v_action': 'Submit',
			'v_label': 'Contact Form Submission',
			'v_value': 1
		});
	}

	function getUTMParams() {
		const params = new URLSearchParams(window.location.search);
		return {
			utm_source: params.get('utm_source') || '',
			utm_medium: params.get('utm_medium') || '',
			utm_campaign: params.get('utm_campaign') || ''
		};
	}



});