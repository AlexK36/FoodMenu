window.addEventListener('DOMContentLoaded', function () {

    // Tabs

    let tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {

        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', function (event) {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadline = '2024-02-22';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor((t / (1000 * 60 * 60 * 24))),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor((t / (1000 * 60 * 60) % 24));

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal')


    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }


    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute("data-close") == "") {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 15000);
    // Модалка через 15 сек, чтобы не отвлекала

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Классы для создания карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        ".menu .container"
    ).render();

    // формы http c серваком

    const forms = this.document.querySelectorAll("form")

    const massage = {
        loading: "/img/form/spinner.svg",
        success: "Спасибо, мы скоро с вами свяжемся",
        faiure: "Ошибка, попробуйте еще раз."
    }

    forms.forEach(item => postData(item))

    function postData(form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const statusMassage = document.createElement("img")
            statusMassage.src = massage.loading
            statusMassage.style.cssText = `
            display: block;
            margin: 0 auto;
            `
            statusMassage.textContent = massage.loading
            form.append(statusMassage)

            const formData = new FormData(form);

            fetch("server.php", {
                method: "POST",
                body: formData
            })
                .then(response => response.text())
                .then(response => {
                    console.log(response);
                    showThanksModal(massage.success)
                    statusMassage.remove()
                })
                .catch(() => {
                    statusMassage.remove()
                    showThanksModal(massage.faiure)
                })
                .finally(() => form.reset())
        })
    }

    function showThanksModal(massage) {
        const previousModal = document.querySelector(".modal__dialog")
        previousModal.classList.add("hide");
        openModal()

        const thanksMod = document.createElement("div")
        thanksMod.classList.add("modal__dialog")
        thanksMod.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>&times;</div>
            <div class="modal__title">${massage}</div>
    </div>
        `

        document.querySelector(".modal").append(thanksMod)
        setTimeout(() => {
            thanksMod.remove();
            previousModal.classList.add("show");
            previousModal.classList.remove("hide");
            closeModal()

        }, 3000)
    }

    this.fetch("http://localhost:3000/menu")
        .then(response => response.json())
        .then(json => console.log(json))

    // Слайдер
    const sliders = document.querySelectorAll(".offer__slide"),
        prevSlider = document.querySelector(".offer__slider-prev"),
        nextSlider = document.querySelector(".offer__slider-next");

    document.querySelector("#total").textContent = getZero(sliders.length);

    function toggleSlider(index, slidesArr) {
        slidesArr.forEach((slide) => {
            slide.style.display = "none";
        });
        slidesArr[index].style.display = "block";
        document.querySelector("#current").textContent = getZero(index + 1);
    }

    let sliderIndex = 0;
    toggleSlider(sliderIndex, sliders);

    nextSlider.addEventListener("click", () => {
        sliderIndex++;
        if (sliderIndex == sliders.length) {
            sliderIndex = 0;
        }
        toggleSlider(sliderIndex, sliders);
    });
    prevSlider.addEventListener("click", () => {
        sliderIndex--;
        if (sliderIndex < 0) {
            sliderIndex = sliders.length - 1;
        }
        toggleSlider(sliderIndex, sliders);
    });
});