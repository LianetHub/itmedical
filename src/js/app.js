"use strict";

import * as devFunctions from './modules/functions.js';

(function checkMixBlendModeSupport() {
    const supportsBlendMode = window.CSS && CSS.supports('mix-blend-mode', 'screen');

    const onBodyReady = (callback) => {
        if (document.body) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };

    onBodyReady(() => {

        if (!supportsBlendMode) {
            document.body.classList.add('no-mix-blend-mode');
            return;
        }

        const video = document.createElement('video');
        video.style.mixBlendMode = 'screen';
        document.body.appendChild(video);

        const computedStyle = getComputedStyle(video).mixBlendMode;

        if (computedStyle !== 'screen') {
            document.body.classList.add('no-mix-blend-mode-video-support');
        } else {
            document.body.classList.add('mix-blend-mode-video-support');
        }

        document.body.removeChild(video);
    });
})();

document.addEventListener('DOMContentLoaded', () => {


    //  init Fancybox
    if (typeof Fancybox !== "undefined" && Fancybox !== null) {

        Fancybox.bind("[data-fancybox]", {
            Toolbar: {
                display: {
                    right: ["fullscreen", "thumbs", "close"]
                }
            }
        });

    }


    devFunctions.isWebp();
    devFunctions.OS();
    devFunctions.observeTheme();
    devFunctions.lazy();
    devFunctions.intInputMask();
    // devFunctions.formSubmit();
    devFunctions.spollers();
    // devFunctions.inputFile();
    // devFunctions.shareLinks();


    // init selects

    document.querySelectorAll('.select')?.forEach(element => {
        new devFunctions.CustomSelect(element);
    });

    if (document.querySelector('.main__video')) {
        if (window.innerWidth >= 1200) {
            document.querySelector('.main__video').setAttribute('autoplay', true);
            document.querySelector('.main__video').play();
            // if (document.querySelector('.main__play')) {
            //     document.querySelector('.main__play').classList.add('active')
            // }
        }
    }


    // event handlers

    document.addEventListener('click', (e) => {

        const target = e.target;



        if (target.classList.contains('search__btn')) {
            if (document.querySelector('.search').classList.contains('active')) {
                hideSearch()
            } else {
                getSearch()
            }
        }

        if (target.classList.contains('search__form') || target.classList.contains('search__close')) {
            hideSearch()
        }

        if (target.closest('.icon-menu')) {
            getMenu()
        }

        if (target.classList.contains('menu__arrow')) {

            let subMenu = target.nextElementSibling;

            if (document.querySelector('.menu__arrow.active') !== target) {

                if (document.querySelector('.submenu.open')) {
                    document.querySelector('.submenu.open').classList.remove('open');
                }
                if (document.querySelector('.menu__arrow.active')) {
                    document.querySelector('.menu__arrow.active').classList.remove('active');
                }

            }

            subMenu.classList.toggle('open');
            target.classList.toggle('active');

        }

        if (target.classList.contains('crm-benefits__tab')) {
            const tabBtns = document.querySelectorAll('.crm-benefits__tab');
            const tabContents = document.querySelectorAll('.crm-benefits__tabs-item');

            tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
            tabContents.forEach(tabContent => tabContent.classList.remove('active'));

            let currentBtnIndex = getIndexInParent(target);

            tabBtns[currentBtnIndex].classList.add('active');
            tabContents[currentBtnIndex].classList.add('active');

        }


        if (target.classList.contains('solutions__link')) {
            const solutionsBtns = document.querySelectorAll('.solutions__link');
            const solutionsContents = document.querySelectorAll('.solutions__item');

            solutionsBtns.forEach(solutionsBtn => solutionsBtn.classList.remove('active'));
            solutionsContents.forEach(solutionsContent => solutionsContent.classList.remove('active'));

            let currentBtnIndex = getIndexInParent(target);

            solutionsBtns[currentBtnIndex].classList.add('active');
            solutionsContents[currentBtnIndex].classList.add('active');

        }

        // if (target.classList.contains('main__play')) {
        //     togglePlayVideo()
        // }

        if (target.closest('a')?.getAttribute('href') === '#contacts') {


            const contactsBlock = document.getElementById('contacts');
            const form = contactsBlock.querySelector('form');

            if (!form) return;

            const firstInput = form.querySelector('input:not([type="hidden"])');
            if (!firstInput) return;


            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        firstInput.focus();
                        observer.disconnect();
                    }
                });
            });
            observer.observe(contactsBlock);
        }

        if (target.classList.contains('copy-btn')) {
            e.preventDefault()
            let textToCopy = target.getAttribute('href');

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(function () {
                    showTooltip(target);
                }).catch(function (err) {
                    console.error('Ошибка при копировании: ', err);
                });
            } else {
                let textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    showTooltip(target);
                } catch (err) {
                    console.error('Ошибка при копировании: ', err);
                }
                document.body.removeChild(textArea);
            }
        }

        if (target.classList.contains('form__succes-btn')) {
            target.closest('._success').classList.remove('_success')
        }

    });



    document.addEventListener('keydown', (e) => {

        if (e.key === "Escape") {
            if (document.querySelector('.search').classList.contains('active')) {
                hideSearch()
            }
        }

    });





    // function togglePlayVideo() {
    //     const video = document.querySelector('.main__video');
    //     const playButton = document.querySelector('.main__play');

    //     if (video.paused == true) {
    //         video.play();
    //         // video.classList.add('play');
    //         playButton.classList.add('active');
    //     } else {
    //         video.pause();
    //         // video.classList.remove('play');
    //         playButton.classList.remove('active');
    //     }
    // }

    function getSearch() {
        document.querySelector('.search').classList.add('active');
        setTimeout(() => {
            document.querySelector('.search__form-input').focus();
        }, 500)
    }

    function hideSearch() {
        document.querySelector('.search').classList.remove('active');
    }

    function getMenu() {
        document.querySelector('.header').classList.toggle('open-menu');
        devFunctions.toggleLocking();
    }


    function getIndexInParent(node) {
        var children = node.parentNode.childNodes;
        var num = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == node) return num;
            if (children[i].nodeType == 1) num++;
        }
        return -1;
    }

    function showTooltip(element) {
        element.innerHTML += '<span class="tooltip">Link Copied!</span>';

        setTimeout(function () {
            let tooltip = element.querySelector('.tooltip');
            tooltip.classList.remove('fade');
            tooltip.classList.add('fade');
            setTimeout(function () {
                let tooltip = element.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            }, 500);
        }, 2000);
    }


    // sliders
    if (document.querySelector('.blog__slider')) {
        new Swiper('.blog__slider', {
            slidesPerView: "auto",
            spaceBetween: 37,
            watchOverflow: true,
            navigation: {
                nextEl: '.blog__next',
                prevEl: '.blog__prev'
            },
            pagination: {
                el: '.blog__slider-pagination',
                clickable: true,
            },
            breakpoints: {
                1199.98: {
                    slidesPerView: 3,
                }
            }
        })
    }

    if (document.querySelector('.results__slider')) {
        new Swiper('.results__slider', {
            slidesPerView: "auto",
            spaceBetween: 37,
            pagination: {
                el: '.results__pagination',
                clickable: true,
            },
            breakpoints: {
                1199.98: {
                    slidesPerView: 3,
                }
            }
        })
    }

    if (document.querySelector('.case__slider')) {
        new Swiper('.case__slider', {
            slidesPerView: "auto",
            spaceBetween: 25,
            watchOverflow: true,
            pagination: {
                el: '.case__slider-pagination',
                clickable: true,
            },
            breakpoints: {
                991.98: {
                    slidesPerView: 2,
                },
                1199.98: {
                    slidesPerView: 4,
                }
            }
        })
    }

    if (document.querySelector('.ai__slider')) {

        const pagination = document.querySelector('.ai__pagination');
        const mobileContainer = document.querySelector('.ai__controls-mobile');
        const originalParent = pagination.parentNode;

        new Swiper('.ai__slider', {
            slidesPerView: 1,
            watchOverflow: true,
            loop: true,
            pagination: {
                el: pagination,
                clickable: true,
            },
            navigation: {
                nextEl: ".ai__next",
                prevEl: ".ai__prev",
            },
            on: {
                resize: () => {
                    if (window.innerWidth < 992) {
                        if (pagination.parentNode !== mobileContainer) {
                            mobileContainer.appendChild(pagination);
                        }
                    } else {
                        if (pagination.parentNode !== originalParent) {
                            originalParent.appendChild(pagination);
                        }
                    }
                },
                init: () => {

                    if (window.innerWidth < 992) {
                        if (pagination.parentNode !== mobileContainer) {
                            mobileContainer.appendChild(pagination);
                        }
                    }
                }
            }
        })
    }

    if (document.querySelector('.related-cases__slider')) {


        new Swiper('.related-cases__slider', {
            slidesPerView: "auto",
            spaceBetween: 1,

            watchOverflow: true,
            navigation: {
                nextEl: ".related-cases__next",
                prevEl: ".related-cases__prev",
            },
            pagination: {
                el: ".related-cases__pagination",
                clickable: true
            },

        })



    }

    if (document.querySelector('.awards__slider')) {
        new Swiper('.awards__slider', {
            slidesPerView: 1,
            spaceBetween: 37,
            pagination: {
                el: '.awards__pagination',
                clickable: true,
            },
            breakpoints: {
                575.98: {
                    slidesPerView: 2,
                },
                766.98: {
                    slidesPerView: 3,
                },
                991.98: {
                    slidesPerView: 4,
                },
                1199.98: {
                    slidesPerView: 5,
                }
            }
        })
    }

    if (document.querySelector('.solutions__list')) {
        getConditionSlider('.solutions__list', {
            slidesPerView: "auto",
            spaceBetween: 20,
            slideToClickedSlide: true
        })
    }

    if (document.querySelector('.reviews__list')) {
        getConditionSlider('.reviews__list', {
            slidesPerView: 1,
            spaceBetween: 20,
            autoHeight: true,
            pagination: {
                el: ".reviews__pagination",
                clickable: true
            },
            breakpoints: {
                766.98: {
                    slidesPerView: 2,

                }
            },

        }, () => window.innerWidth <= 992)
    }

    function getConditionSlider(sliderName, options, condition = () => window.innerWidth <= 1200) {


        let init = false;
        let swiper = null;

        function getSwiper() {

            const currentCondition = condition();

            if (currentCondition) {
                if (!init) {
                    init = true;
                    swiper = new Swiper(sliderName, options);
                }
            } else if (init) {
                swiper.destroy();
                swiper = null;
                init = false;
            }
        }
        getSwiper();
        window.addEventListener("resize", getSwiper);
    }


    // header animation

    const headerElement = document.querySelector('.header');
    if (headerElement) {
        const callback = function (entries, observer) {
            if (entries[0].isIntersecting) {
                headerElement.classList.remove('scroll');
            } else {
                headerElement.classList.add('scroll');
            }
        };

        const observerOptions = {
            root: null,
            threshold: 0,
        };

        const headerObserver = new IntersectionObserver(callback, observerOptions);

        headerObserver.observe(headerElement);
    }


    const textareas = document.querySelectorAll('.form__textarea');

    textareas.forEach(textarea => {

        function autoResize() {
            textarea.style.height = '3.375rem';
            textarea.style.height = (textarea.scrollHeight / 16) + 'rem';
        }


        textarea.addEventListener('input', autoResize);


        textarea.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                autoResize();
            }
        });
    });


    // Общая функция для обработки секций и ссылок
    function handleSectionAnimation(sectionsSelector, linksSelector) {
        const sections = document.querySelectorAll(sectionsSelector);
        const navLinks = document.querySelectorAll(linksSelector);
        const header = document.querySelector('.header');
        let isScrolling = false;

        function getHeaderHeight() {
            return header ? header.offsetHeight : 0;
        }

        function animOnScroll() {
            if (isScrolling) return;

            let currentSection = null;
            const headerHeight = getHeaderHeight() * 3;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerHeight;
                const sectionBottom = sectionTop + sectionHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    currentSection = section;
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            if (currentSection) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === currentSection.id) {
                        link.classList.add('active');
                    }
                });
            }
        }

        function onNavLinkClick(event) {
            event.preventDefault();
            isScrolling = true;

            const targetId = event.target.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            const headerHeight = getHeaderHeight();
            const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            navLinks.forEach(link => link.classList.remove('active'));
            event.target.classList.add('active');

            window.setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }

        window.addEventListener('scroll', animOnScroll);
        window.addEventListener('resize', animOnScroll);
        animOnScroll();

        navLinks.forEach(link => {
            link.addEventListener('click', onNavLinkClick);
        });
    }

    // Инициализация для различных секций
    handleSectionAnimation('.case__block', '.case__sidebar-link');
    handleSectionAnimation('.policy__body-section', '.policy__sidebar-link');


    function initStatsAnimation() {
        document.querySelectorAll('.stats__item-num')?.forEach(item => {
            const percentageEl = item.querySelector('.percentage');
            const percentage = parseInt(percentageEl.textContent);
            const circle = item.querySelector('.progress-ring');
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;

            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference;

            let hasAnimated = false;

            function startAnimation() {
                if (hasAnimated) return;
                hasAnimated = true;

                let currentNum = 0;
                const duration = 1000;
                const startTime = performance.now();

                function animateNumber(time) {
                    const progress = Math.min((time - startTime) / duration, 1);
                    currentNum = Math.round(progress * percentage);
                    percentageEl.innerHTML = `${currentNum}<small>%</small>`;

                    if (progress < 1) {
                        requestAnimationFrame(animateNumber);
                    }
                }

                function animateCircle() {
                    let startOffset = circumference;
                    let endOffset = circumference * (1 - percentage / 100);
                    let startTime = performance.now();

                    function step(time) {
                        let progress = Math.min((time - startTime) / duration, 1);
                        circle.style.strokeDashoffset = startOffset - progress * (startOffset - endOffset);

                        if (progress < 1) {
                            requestAnimationFrame(step);
                        }
                    }

                    requestAnimationFrame(step);
                }

                requestAnimationFrame(animateNumber);
                requestAnimationFrame(animateCircle);
            }

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startAnimation();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(item);
        });
    }


    if (document.querySelector('.stats')) {
        initStatsAnimation()
    }



})


// slideToggle

HTMLElement.prototype.slideToggle = function (duration, callback) {
    if (this.clientHeight === 0) {
        _s(this, duration, callback, true);
    } else {
        _s(this, duration, callback);
    }
};

HTMLElement.prototype.slideUp = function (duration, callback) {
    _s(this, duration, callback);
};

HTMLElement.prototype.slideDown = function (duration, callback) {
    _s(this, duration, callback, true);
};

function _s(el, duration, callback, isDown) {

    if (typeof duration === 'undefined') duration = 400;
    if (typeof isDown === 'undefined') isDown = false;

    el.style.overflow = "hidden";
    if (isDown) el.style.display = "block";

    var elStyles = window.getComputedStyle(el);

    var elHeight = parseFloat(elStyles.getPropertyValue('height'));
    var elPaddingTop = parseFloat(elStyles.getPropertyValue('padding-top'));
    var elPaddingBottom = parseFloat(elStyles.getPropertyValue('padding-bottom'));
    var elMarginTop = parseFloat(elStyles.getPropertyValue('margin-top'));
    var elMarginBottom = parseFloat(elStyles.getPropertyValue('margin-bottom'));

    var stepHeight = elHeight / duration;
    var stepPaddingTop = elPaddingTop / duration;
    var stepPaddingBottom = elPaddingBottom / duration;
    var stepMarginTop = elMarginTop / duration;
    var stepMarginBottom = elMarginBottom / duration;

    var start;

    function step(timestamp) {

        if (start === undefined) start = timestamp;

        var elapsed = timestamp - start;

        if (isDown) {
            el.style.height = (stepHeight * elapsed) + "px";
            el.style.paddingTop = (stepPaddingTop * elapsed) + "px";
            el.style.paddingBottom = (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop = (stepMarginTop * elapsed) + "px";
            el.style.marginBottom = (stepMarginBottom * elapsed) + "px";
        } else {
            el.style.height = elHeight - (stepHeight * elapsed) + "px";
            el.style.paddingTop = elPaddingTop - (stepPaddingTop * elapsed) + "px";
            el.style.paddingBottom = elPaddingBottom - (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop = elMarginTop - (stepMarginTop * elapsed) + "px";
            el.style.marginBottom = elMarginBottom - (stepMarginBottom * elapsed) + "px";
        }

        if (elapsed >= duration) {
            el.style.height = "";
            el.style.paddingTop = "";
            el.style.paddingBottom = "";
            el.style.marginTop = "";
            el.style.marginBottom = "";
            el.style.overflow = "";
            if (!isDown) el.style.display = "none";
            if (typeof callback === 'function') callback();
        } else {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}


