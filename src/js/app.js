"use strict";

import * as devFunctions from './modules/functions.js';


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
    devFunctions.lazy();
    devFunctions.intInputMask();
    devFunctions.formSubmit();
    devFunctions.spollers();
    devFunctions.inputFile();


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

        if (target.classList.contains('cases__btn')) {
            const caseBtns = document.querySelectorAll('.cases__btn');
            const caseContents = document.querySelectorAll('.cases__content');

            caseBtns.forEach(caseBtn => caseBtn.classList.remove('active'));
            caseContents.forEach(caseContent => caseContent.classList.remove('active'));

            let currentBtnIndex = getIndexInParent(target);

            caseBtns[currentBtnIndex].classList.add('active');
            caseContents[currentBtnIndex].classList.add('active');

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

        if (target.tagName === 'A' && target.getAttribute('href') === '#contacts') {


            const contactsBlock = document.getElementById('contacts');
            const form = contactsBlock.querySelector('form');

            const firstInput = form.querySelector('input');

            if (firstInput) {

                setTimeout(() => {
                    firstInput.focus();
                }, 1000)
            }
        }

    });



    document.addEventListener('keydown', (e) => {

        if (e.key === "Escape") {
            if (document.querySelector('.search').classList.contains('active')) {
                hideSearch()
            }
        }

    });


    // Функция для выполнения скроллинга к якорю
    function scrollToAnchor(anchor) {
        const targetElement = document.querySelector(anchor);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Обработчик кликов по якорям
    function handleAnchorClick(event) {
        // Предотвращаем стандартное поведение браузера
        event.preventDefault();

        // Получаем якорь из href ссылки
        const anchor = event.currentTarget.getAttribute('href');

        // Выполняем скроллинг к якорю
        scrollToAnchor(anchor);

        // Обновляем URL без перезагрузки страницы
        history.pushState(null, '', anchor);
    }

    // Навешиваем обработчики на все ссылки с якорями
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function (link) {
        link.addEventListener('click', handleAnchorClick);
    });

    // Скроллинг к якорю при загрузке страницы
    const initialAnchor = window.location.hash;
    if (initialAnchor) {
        scrollToAnchor(initialAnchor);
    }


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


    if (document.querySelector('.blog__slider')) {
        new Swiper('.blog__slider', {
            slidesPerView: "auto",
            spaceBetween: 37,
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

    if (document.querySelector('.solutions__list')) {
        getConditionSlider('.solutions__list', {
            slidesPerView: "auto",
            spaceBetween: 20,
            slideToClickedSlide: true
        })
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

        const headerObserver = new IntersectionObserver(callback);
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
                // event.preventDefault();
                autoResize();
            }
        });
    });


    // case sidebar animation

    const caseSections = document.querySelectorAll('.case__block');

    if (caseSections.length > 0) {

        const navLinks = document.querySelectorAll('.case__sidebar-link');
        const header = document.querySelector('.header');
        let isScrolling = false;

        function getHeaderHeight() {
            return header ? header.offsetHeight : 0;
        }

        function animOnScroll() {

            if (isScrolling) return;

            let currentSection = null;
            const headerHeight = getHeaderHeight();

            for (let i = 0; i < caseSections.length; i++) {
                const section = caseSections[i];
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerHeight;
                const sectionBottom = sectionTop + sectionHeight;

                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    currentSection = section;
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            }

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

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            const headerHeight = getHeaderHeight();
            const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

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
