export function observeTheme() {
    function setFaviconAndAppleIcon(faviconURL, appleIconURL) {
        const favicon = document.getElementById('favicon');
        const appleIcon = document.getElementById('apple-icon');

        if (favicon) {
            favicon.href = faviconURL;
        }

        if (appleIcon) {
            appleIcon.href = appleIconURL;
        }
    }

    function updateThemeIcons() {
        const isDarkMode = matchMedia('(prefers-color-scheme: dark)').matches;
        console.log(isDarkMode);
        const timestamp = new Date().getTime(); // Это помогает избежать кэширования

        if (isDarkMode) {
            setFaviconAndAppleIcon(`/favicon-32x32-dark.png?v=${timestamp}`, `/apple-touch-icon-dark.png?v=${timestamp}`);
        } else {
            setFaviconAndAppleIcon(`/favicon-32x32-light.png?v=${timestamp}`, `/apple-touch-icon-light.png?v=${timestamp}`);
        }
    }

    // Изначальная установка темы
    updateThemeIcons();

    // Обработка изменения темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeIcons);



}