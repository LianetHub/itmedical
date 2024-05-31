export const beforeSlider = () => {

    const sliders = document.querySelectorAll('.before-slider');

    sliders.forEach(slider => {
        const sliderInput = slider.querySelector('.before-slider__input');
        const foreground = slider.querySelector('.before-slider__after');
        const sliderBtn = slider.querySelector('.before-slider__button');

        ["input", "change"].forEach((type) => {
            sliderInput.addEventListener(type, (e) => {
                const sliderPos = e.target.value;
                // foreground.style.width = `${sliderPos}%`;
                foreground.style.setProperty('--value', `${sliderPos}%`);
                // foreground.style.cssText = `--value: ${sliderPos}%`;
                sliderBtn.style.left = `calc(${sliderPos}% - 15px)`;
            });
        });
    })

}