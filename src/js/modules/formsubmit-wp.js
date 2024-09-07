"use strict";

document.addEventListener('DOMContentLoaded', () => {

	const forms = document.querySelectorAll("form.contacts__request, .contacts__request > .wpcf7 > form ");
	forms.forEach(form => {
		form.addEventListener("submit", formSend);
	})

	async function formSend(e) {

		const form = e.target;
		const portalId = 144397095;
		const formGuid = '161a42bc-521e-479d-9083-7895938f524c';
		const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

		e.preventDefault();

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
				form.reset();
				form.classList.remove("_sending");
				form.classList.add('_success');
				setTimeout(() => {
					form.classList.remove('_success');
					form.reset()
				}, 10000)

				sendGtmEvent();

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


	function sendGtmEvent() {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			'event': 'contact_form_submit',
			'v_category': 'Contact Form',
			'v_action': 'Submit',
			'v_label': 'Contact Form Submission',
			'v_value': 1
		});
	}

});

