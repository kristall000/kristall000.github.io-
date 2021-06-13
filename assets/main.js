//выезжающие меню-иконка 
// let menu = document.querySelector('.nav')
// let menuBtn = document.querySelectorAll('.nav__btn')

let menubtn = document.querySelectorAll('.nav__item');
for (item of menubtn) {
  item.onclick = function () {
    document.getElementById('nav-check').checked = false;
  }
}

//Форма обратной связи

let btnOrder = document.getElementById('form___order')
const form = document.getElementById('form___fdbck');
btnOrder.onclick = async function () {
  const fdbckInfo = {
    fdbck__type: form.type.value.trim(),
    fdbck__name: form.name.value.trim().replace(/\d/g, ''),
    fdbck__phone: form.phone.value.trim().replace(/\s/g, ''),
    fdbck__mail: form.mail.value.trim(),
    fdbck__text: form.text.value.trim()
  }

  let correctLevel, errorname = 'Запрос не может быть отправлен:';
  let mailExists, phoneExists;
  let typeValid, nameValid, EmailValid, PhoneValid, textValid;
  const
    allTypes = ['coop', 'privacy_security', 'func_request', 'review', 'question'],
    regEMail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i,
    // regPhone = /^\+?[7-8]\(?\d{3}\)?\d{3}(-?\d{2}){2}$/;
    regPhone = /^(\+?7|8)?9\d{9}$/;

  typeValid = allTypes.indexOf(fdbckInfo.fdbck__type) != -1;

  nameValid = fdbckInfo.fdbck__name.length > 0 && fdbckInfo.fdbck__name.length < 50;

  mailExists = fdbckInfo.fdbck__mail != '';
  EmailValid = regEMail.test(fdbckInfo.fdbck__mail);

  phoneExists = fdbckInfo.fdbck__phone != "" && fdbckInfo.fdbck__phone != '+7(___)___-__-__';
  PhoneValid = regPhone.test(fdbckInfo.fdbck__phone.replace(/\D/g, ''));

  textValid = fdbckInfo.fdbck__text.length > 9;

  if (!typeValid)
    errorname += '<br>• Выберите тему обращения.';
  if (!nameValid) {
    if (fdbckInfo.fdbck__name.length == 0)
      errorname += '<br>• Имя должно быть заполнено, не может содержать цифры.';
    if (fdbckInfo.fdbck__name.length > 50)
      errorname += '<br>• Слишком длинное имя (не более 50 символов).';
  }
  if (!mailExists && !phoneExists)
    errorname += '<br>• Заполните хотя-бы один контакт для связи с Вами.';
  else {
    if (phoneExists && !PhoneValid)
      errorname += '<br>• Проверьте правильность ввода вашего номера телефона.';
    if (mailExists && !EmailValid)
      errorname += '<br>• Проверьте правильность ввода вашей электронной почты.';
  }
  if (!textValid)
    errorname += '<br>• Длина текста обращения не может быть меньше 10 символов.';

  correctLevel = errorname == 'Запрос не может быть отправлен:';

  const errorbox = document.querySelector('.fdbck__result');
  errorbox.classList.add('fdbck__result--active');
  if (!correctLevel) {
    errorbox.style = '';
    errorbox.innerHTML = errorname;
    return;
  }
  else {
    errorbox.innerHTML = 'Запрос успешно отправлен!';
    errorbox.style = 'background-color: #4CAF50';
  }

  const fdbckInfoJSON = JSON.stringify(fdbckInfo)
  // console.log(fdbckInfoJSON);

  const response = await fetch('https://kidskills.herokuapp.com/api/fdbck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: fdbckInfoJSON
  })
  // if (response.ok){
  //   console.log(await response.json())
  // }
}

//Маска номера телефона
var phone_form = document.getElementById('online_phone'),
  phone_mask = new IMask(phone_form, {
    mask: '{+7} ( 000 ) 000 - 00 - 00',
    lazy: true
  });

//Позиция прокрутки
const scrollPos = () => window.pageYOffset || document.documentElement.scrollTop;


// навигация по сайту 
let heder = document.querySelector('.header');
let head_height = heder.clientHeight;
const anchors = document.querySelectorAll('a[href*="#"]');

for (let anchor of anchors) {
  anchor.addEventListener("click", function (event) {
    event.preventDefault();
    const blockID = anchor.getAttribute('href')
    let block = document.getElementById(blockID.substr(1, blockID.length - 1)); //#hid2
    // console.log(head_height);
    let jmp = block.offsetTop;
    if (scrollPos() > block.offsetTop)
      jmp = jmp - head_height;
    window.scrollTo({
      top: jmp,
      behavior: 'smooth'
    })
  })
}

//Скрытие / Показ шапки при прокрутке вниз / вверх

let lastScroll = 0;
const defaultOffsetScroll = 200;
const headerIsHidden = () => heder.classList.contains('header__hide');

window.addEventListener('scroll', function () {
  if (scrollPos() > lastScroll && !headerIsHidden() && scrollPos() > defaultOffsetScroll) {
    heder.classList.add('header__hide');
  }
  else if (scrollPos() < lastScroll && headerIsHidden()) {
    heder.classList.remove('header__hide');
  }
  lastScroll = scrollPos();
})

// спойлеры
const spoilers = document.querySelectorAll('.spoilers__item');
for (item of spoilers) {
  item.addEventListener('click', function () {
    if (this.classList.contains('active')) {
      this.classList.remove('active');
    }
    else {
      // for (el of spoilers) {
      //     el.classList.remove('active');
      // }
      this.classList.add('active');
    }
  })
}




//Слайдер
getEvent = function () {
  return (event.type.search('touch') !== -1) ? event.touches[0] : event;
}


let _slider = document.querySelector('.slider'),
  slides = document.getElementsByName('slider'),
  sliderInner = _slider.querySelector('.slider__slides__inner'),
  sliderInner_X,
  // _slider__width = () => _slider.clientWidth,
  _slider__width,
  swipeThreshold,
  offsetX_start,
  offsetX_end,
  differ,
  speed_firstX = 0,
  speed_secondX,
  movespeed,
  canmove = false;

function getSlideNum() {
  for (var i = 0; i < slides.length; i++) {
    if (slides[i].checked) {
      return i;
    }
  }
}

function next() {
  slides[(getSlideNum() + 1) % slides.length].checked = true;
}
function prev() {
  let num = getSlideNum() - 1;
  if (num < 0)
    num = slides.length - 1;

  slides[num].checked = true;
}

function move_start() {
  // console.log('start');
  offsetX_start = speed_firstX = getEvent().clientX;

  sliderInner_X = _slider__width * (getSlideNum());

  canmove = false; // избежание события одиночного клика

  _slider.removeEventListener('mousedown', move_start);
  _slider.addEventListener('mousemove', move_MOVING);
  _slider.addEventListener('mouseup', move_end);
  _slider.addEventListener('mouseleave', move_end);

  _slider.removeEventListener('touchstart', move_start);
  _slider.addEventListener('touchmove', move_MOVING);
  _slider.addEventListener('touchend', move_end);
  _slider.addEventListener('touchcancel', move_end);
}

function move_MOVING() {
  // console.log('moving');
  let currX = speed_secondX = getEvent().clientX;

  movespeed = Math.abs(speed_secondX - speed_firstX) * 100 / _slider__width;

  speed_firstX = currX;

  differ = offsetX_start - currX;

  var nextX = -(sliderInner_X + differ);

  canmove = true;

  sliderInner.style.transition = `none`;
  sliderInner.style.transform = `translateX(${nextX}px)`;
}

function move_end() {
  // console.log('end!');
  // offsetX_end = getEvent().clientX;
  // differ = offsetX_end - offsetX_start;

  // console.log(movespeed);

  if (Math.abs(differ) > swipeThreshold && canmove) {
    if (differ > 0) {
      next();
    } else {
      prev();
    }
  }

  sliderInner.style.transition = ``;
  sliderInner.style.transform = ``;

  _slider.addEventListener('mousedown', move_start);
  _slider.removeEventListener('mousemove', move_MOVING);
  _slider.removeEventListener('mouseup', move_end);
  _slider.removeEventListener('mouseleave', move_end);

  _slider.addEventListener('touchstart', move_start);
  _slider.removeEventListener('touchmove', move_MOVING);
  _slider.removeEventListener('touchend', move_end);
  _slider.removeEventListener('touchcancel', move_end);
}

_slider.addEventListener('mousedown', move_start);
_slider.addEventListener('touchstart', move_start);


function init() {
  _slider__width = _slider.clientWidth;
  swipeThreshold = _slider__width * 0.1;
  // console.log('REZISE UPDATE');
}

init();
window.addEventListener('resize', init);