export const inputFile = () => {

    const inputElement = document.querySelector('.form__file-input');
    if (!inputElement) return;
    const fileListContainer = document.querySelector('.form__file-list');
    let errorContainer = null;
    let dataTransfer = new DataTransfer();
    const form = inputElement.closest('form');

    form.addEventListener('submit', function (event) {
        const isAnyFileUploading = Array.from(fileListContainer.children).some(fileItem => !fileItem.classList.contains('complete'));

        if (isAnyFileUploading) {
            event.preventDefault();
            showError('Wait for the files to load before submitting the form.');
        } else {
            clearErrors();
        }
    });

    inputElement.addEventListener('change', function (event) {

        let filesToAdd = Array.from(event.target.files);
        let errorMessages = [];


        if (filesToAdd.length + fileListContainer.children.length > 3) {
            errorMessages.push('You can only attach up to 3 files.');
        }

        filesToAdd.forEach(file => {
            if (file.size > 15728640) {
                errorMessages.push(`File ${file.name} exceeds the maximum size limit of 15 MB.`);
            } else if (fileListContainer.children.length < 3 && dataTransfer.items.length < 3) {
                dataTransfer.items.add(file);
            }
        });

        inputElement.files = dataTransfer.files;
        updateFileList();

        if (errorMessages.length > 0) {
            showError(errorMessages.join(" "));
        } else {
            clearErrors();
        }
    });

    function clearErrors() {
        if (errorContainer) {
            errorContainer.remove();
            errorContainer = null;
        }
    }

    function showError(message) {
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'form__file-error';
            fileListContainer.after(errorContainer);
        }
        errorContainer.textContent = message;
    }




    function updateFileList() {
        const existingFiles = new Set(Array.from(fileListContainer.children).map(item => item.dataset.fileName));

        Array.from(inputElement.files).forEach(file => {
            if (!existingFiles.has(file.name) && fileListContainer.children.length < 3 && file.size <= 15728640) {
                const fileItem = createFileItem(file);
                fileListContainer.appendChild(fileItem);
                uploadFile(file, fileItem);
            }
        });

        Array.from(fileListContainer.children).forEach(child => {
            if (!Array.from(inputElement.files).find(file => file.name === child.dataset.fileName)) {
                fileListContainer.removeChild(child);
            }
        });

        fileListContainer.classList.toggle('empty', fileListContainer.children.length === 0);
    }



    function createFileItem(file) {
        const fileItem = document.createElement('div');
        const fileHeader = document.createElement('div');
        const fileColumn = document.createElement('div');
        const fileName = document.createElement('div');
        const fileSize = document.createElement('div');
        const removeButton = document.createElement('button');

        const fileBottom = document.createElement('div');
        const fileProgress = document.createElement('div');
        const progressBar = document.createElement('div');
        const filePercent = document.createElement('div');

        fileItem.className = 'form__file-item';
        fileHeader.className = 'form__file-header';
        fileColumn.className = 'form__file-column';
        fileName.className = 'form__file-name';
        fileSize.className = 'form__file-size';
        removeButton.className = 'form__file-remove icon-delete';
        fileBottom.className = 'form__file-bottom';
        fileProgress.className = 'form__file-progress';
        progressBar.className = 'form__file-progressbar';
        filePercent.className = 'form__file-percent';

        fileName.textContent = file.name;
        fileSize.textContent = `(${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        filePercent.textContent = '0%';
        removeButton.type = 'button';
        removeButton.addEventListener('click', function () {
            fileItem.remove();
            updateDataTransfer(file);
        });

        fileProgress.appendChild(progressBar);
        fileColumn.appendChild(fileName);
        fileColumn.appendChild(fileSize);

        fileHeader.appendChild(fileColumn);
        fileHeader.appendChild(removeButton);

        fileBottom.appendChild(fileProgress);
        fileBottom.appendChild(filePercent);

        fileItem.appendChild(fileHeader);
        fileItem.appendChild(fileBottom);

        fileItem.dataset.fileName = file.name;
        return fileItem;
    }

    function updateDataTransfer(fileToRemove) {
        const files = Array.from(dataTransfer.files).filter(file => file !== fileToRemove);
        dataTransfer.items.clear();
        files.forEach(file => dataTransfer.items.add(file));
        inputElement.files = dataTransfer.files;
        updateFileList();
        clearErrors();
    }

    function uploadFile(file, fileItem) {

        const progressBar = fileItem.querySelector('.form__file-progressbar');
        const filePercent = fileItem.querySelector('.form__file-percent');
        const fileName = fileItem.querySelector('.form__file-name');

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload.php');

        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percentage = Math.round((event.loaded / event.total) * 100);
                progressBar.style.width = percentage + '%';
                filePercent.textContent = percentage + '%';
            }
        };

        xhr.onerror = function () {
            fileName.textContent = 'Upload error: Could not upload the file';
            fileName.classList.add('upload-error');
        };

        xhr.onload = function () {
            if (xhr.status == 200) {
                filePercent.textContent = '100%';
                fileItem.classList.add('complete');
            } else {
                fileName.textContent = 'Upload error: ' + xhr.statusText;
                fileName.classList.add('upload-error');

            }
        };

        const formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);
    }

}