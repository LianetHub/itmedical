export const shareLinks = () => {
    var pageUrl = encodeURIComponent(window.location.href);
    var pageTitle = encodeURIComponent(document.querySelector('h1').textContent);

    // Получаем кнопки шеринга
    var facebookBtn = document.querySelector('.icon-facebook');
    var linkedinBtn = document.querySelector('.icon-linkedin');

    // Устанавливаем ссылки, если кнопки существуют
    if (facebookBtn) {
        https://www.facebook.com/sharer.php?p\[url\]=\*url 
        var facebookShareUrl = `https://www.facebook.com/sharer.php?p[url]=${pageUrl}&p[title]=${pageTitle}`;
        facebookBtn.setAttribute('href', facebookShareUrl);
    }

    if (linkedinBtn) {
        var linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}&title=${pageTitle}`;
        linkedinBtn.setAttribute('href', linkedinShareUrl);
    }
}