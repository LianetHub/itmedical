"use strict";

document.addEventListener('DOMContentLoaded', () => {

	const forms = document.querySelectorAll("form.contacts__request, .contacts__request > .wpcf7 > form ");
	forms.forEach(form => {
		form.addEventListener("submit", formSend);
	})

	document.addEventListener("input", (e) => {
		let target = e.target;
		if (target.classList.contains('_error')) {
			formRemoveError(target)
		}
	})
	document.addEventListener("change", (e) => {
		let target = e.target;
		if (target.classList.contains('_error')) {
			formRemoveError(target)
		}
	})


	async function formSend(e) {
		const form = e.target;
		const portalId = 144397095;
		const formGuid = '161a42bc-521e-479d-9083-7895938f524c';
		const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

		e.preventDefault();

		let error = formValidate(form);
		let formData = new FormData(form);

		if (error === 0) {
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

	function formValidate(form) {
		let error = 0;
		let formReq = form.querySelectorAll("[data-required]");

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.name == "email") {
				if (!emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else if (input.type == "text") {
				if (input.value === "") {
					formAddError(input);
					error++;
				}
			} else if (input.name == "message") {
				if (input.value.length < 1) {
					formAddError(input);
					error++;
				}
			} else if (input.name == "phone") {
				if (!phoneTest(input)) {
					formAddError(input);
					error++;
				}
			} else if (input.type == "checkbox") {
				if (!input.checked) {
					formAddError(input);
					error++;
				}
			}
		}
		return error;
	}

	function formAddError(input) {

		input.classList.add("_error");
		let form = input.closest('.form');
		let errorMessage = form.querySelector('.form__error-message');
		if (form && errorMessage) {
			errorMessage.classList.add('visible');
		}
	}

	function formRemoveError(input) {
		input.classList.remove("_error");
		let form = input.closest('.form');
		let errorMessage = form.querySelector('.form__error-message');

		if (form && errorMessage && (form.querySelectorAll('._error').length === 0)) {
			errorMessage.classList.remove('visible');
		}
	}

	function emailTest(input) {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let result = re.test(String(input.value).toLowerCase());
		return result;
	}

	function phoneTest(input) {
		let value = input.value.length > 0 ? input.value.match(/\d/g).join('') : input.value;

		return /^\d[\d\(\)\-]{4,14}\d$/g.test(value);
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

})

