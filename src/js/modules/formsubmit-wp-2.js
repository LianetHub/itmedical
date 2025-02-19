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

	document.addEventListener('wpcf7invalid', function () {
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
			await sendToHubspot(form);
			sendGtmEvent();
		}
	}

	async function sendToHubspot(form) {
		const portalId = 7649479;
		const formGuid = '16d63051-cb11-4877-8055-38d7f418e39b';
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

		formData.forEach((value, key) => {
			if (key.startsWith('_wpcf7') || key.indexOf('_wpcf7') === 0) {
				return;
			}

			if (key === 'nda') {
				return;
			}

			if (value && value.toString().trim() !== '') {
				hubspotData.fields.push({
					"name": key.toString(),
					"value": value.toString()
				});
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
				form.querySelector('.form').classList.add('_success');
				setTimeout(() => {
					form.querySelector('.form').classList.remove('_success');
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
			console.error("Error submitting form:", error);
		}
	}

	function sendGtmEvent() {
		console.log("GTM Event Submited", "Event Name:", "gated_content_form_submit");
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			'event': 'gated_content_form_submit',
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
