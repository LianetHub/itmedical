"use strict";

document.addEventListener('DOMContentLoaded', () => {

	let hubspotSent = false;
	let reCaptchaPassed = false;
	let akismetPassed = false;

	document.addEventListener('wpcf7mailsent', async function (event) {
		const response = event.detail.apiResponse;
		if (response && response.status === 'mail_sent') {
			reCaptchaPassed = true;
			akismetPassed = true;
			checkAllConditions(event.target);
			console.log("Contact Form 7: Успешная отправка Hubspot, reCAPTCHA и Akismet прошли проверку.");
		}
	}, false);

	document.addEventListener('wpcf7invalid', function (event) {
		console.log("Contact Form 7: Ошибка при проверке формы, возможно, reCAPTCHA или Akismet не прошли проверку.");
		reCaptchaPassed = false;
		akismetPassed = false;
	});

	document.addEventListener('wpcf7spam', function () {
		console.log("Contact Form 7: Форма отклонена как спам, Akismet не прошел проверку.");
		akismetPassed = false;
	});

	async function checkAllConditions(form) {
		if (reCaptchaPassed && akismetPassed) {
			const isFirstForm = form.closest('.wpcf7').id === 'wpcf7-f1756-o1';
			form.classList.add('_success');
			await sendToHubspot(form, isFirstForm);
			sendGtmEvent(isFirstForm);
		}
	}

	async function sendToHubspot(form, isFirstForm) {
		const hubspotConfig = isFirstForm
			? { portalId: 7649479, formGuid: 'd7ff0db3-f159-47cd-9a04-3eb637456f25' }
			: { portalId: 7649479, formGuid: '4e51554c-e02d-4831-adf7-e4ce1dc392eb' };

		const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotConfig.portalId}/${hubspotConfig.formGuid}`;

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
			if (key.startsWith('_wpcf7')) {
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
				form.classList.remove("_sending");
				form.classList.add('_success');
				setTimeout(() => {
					form.classList.remove('_success');
					form.reset();
					hubspotSent = false;
				}, 10000);

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

	function sendGtmEvent(isFirstForm) {

		window.dataLayer = window.dataLayer || [];
		const eventName = isFirstForm ? 'clutch_landing_form_submit' : 'contact_form_submit';
		console.log("GTM Event Submited", "Event Name:", eventName);


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
