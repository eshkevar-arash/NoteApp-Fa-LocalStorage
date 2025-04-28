


const list = document.querySelector('.list');
const cover = document.querySelector('.cover');
const bodyElem = document.querySelector('body');
const addBox = document.querySelector('.add-box');

const popupForm = document.querySelector('.popup-form');
const popupTitle = document.querySelector('.popup__header p');
const popupFormInput = document.querySelector('.popup-form__input');
const popupFormArea = document.querySelector('.popup-form__textarea');
const popupFormSubmitBtn = document.querySelector('.popup-form__submit');
const popupCloseBtn = document.querySelector('.popup_close');

let flag = null
let notArray = []
let currentTitle,currentCaption,currentTime,currentDate,index,newLI,row,targetBox
let targetIndex
let resultArray = []
let result
function getIranTime() {
    const now = new Date();
    // اختلاف زمانی ایران با UTC (3 ساعت و 30 دقیقه)
    const iranOffset = 3.5 * 60 * 60 * 1000; // میلی‌ثانیه
    // تبدیل به زمان ایران
    const iranTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + iranOffset);
    return iranTime;
}

function getTime() {
    const iranTime = getIranTime();
    const hours = iranTime.getHours().toString().padStart(2, '0');
    const minutes = iranTime.getMinutes().toString().padStart(2, '0');
    let time = `${hours}:${minutes}`;
    time = convertToPersianNumbers(time)
    return time
}

function getCurrentDate() {
    // تنظیم locale به فارسی
    moment.locale('fa');

    // دریافت تاریخ فعلی به شمسی
    const now = moment().format('jYYYY/jMM/jDD dddd');
    const parts = now.split(' ');

    // تجزیه تاریخ
    const dateParts = parts[0].split('/');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const weekday = parts[1];

    // نام ماه به فارسی
    const monthNames = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    result = `(${weekday}) ${day} ${monthNames[parseInt(month)-1]} ${year}`
    result = convertToPersianNumbers(result)
    return result
}
function convertToPersianNumbers(input) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return input.replace(/\d/g, function(match) {
        return persianNumbers[parseInt(match)];
    });
}

function setLocalstorage(){
    localStorage.setItem('localNotArray', JSON.stringify(notArray));
}
function popupShow(){
    cover.classList.add('show')
    popupFormInput.value = ''
    popupFormInput.focus()
    popupFormArea.value = ''
}
function coverHide(){
    cover.classList.remove('show')
    menuHide()
}
function noteAddFunc(){
    flag = true
    popupTitle.textContent = 'اضافه کردن یادداشت جدید'
    popupFormSubmitBtn.textContent = 'اضافه کردن'
}
function noteEditFunc(){
    flag = false
    popupTitle.textContent = 'ویرایش یادداشت'
    popupFormSubmitBtn.textContent = 'ویرایش'
}
function findIndexInfo(title){
    index = notArray.findIndex(function (row){
        return row.title === title.toUpperCase()
    })
    return index
}
function menuHide(){
    Array.from(document.querySelectorAll('.menu')).forEach(function (m){
        m.classList.remove('show')
    })
}
function menuShow(tag){
    let menuTarget = tag.parentElement.parentElement.lastElementChild
    Array.from(document.querySelectorAll('.menu')).forEach(function (m){
        if (m !== menuTarget){
            m.classList.remove('show')
        }
    })
    menuTarget.classList.add('show')
}
function returnInformationBox(li){
    let title = li.querySelector('.note-box__title').textContent
    let caption = li.querySelector('.note-box__caption').textContent
    let time = li.querySelector('.note-box__time').textContent
    let date = li.querySelector('.note-box__date').textContent
    return [title , caption , time , date]
}
function removeItemFunc(tag){
    Swal.fire({
        title: 'حذف آیتم',
        text: 'آیا مطمئن هستید که می‌خواهید آیتم مورد نظر را حذف کنید؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'بلی',
        cancelButtonText: 'خیر',
    }).then((result) => {
        if (result.isConfirmed) {
            targetBox = tag.parentElement.parentElement
            resultArray = returnInformationBox(targetBox)
            index = findIndexInfo(resultArray[0])
            notArray.splice(index, 1);
            setLocalstorage()
            targetBox.remove()
        }
    });
}
function editItemFunc(tag){
    targetBox = tag.parentElement.parentElement
    resultArray = returnInformationBox(targetBox)
    console.log(resultArray)
    popupShow()
    noteEditFunc()
    popupFormInput.value = resultArray[0]
    popupFormArea.value = resultArray[1]
    targetIndex = findIndexInfo(resultArray[0])
    notArray[index].title= ''
}
function notAppendToHtml(title , caption , time , date){
    title = title.toUpperCase()
    let newLI = document.createElement('li')
    newLI.className = 'item note-box'
    newLI.innerHTML = `
        <h4 class="note-box__header">
            <span class="note-box__title">${title}</span>
            <span class="note-box__time">${time}</span>
        </h4>
        <div class="note-box__caption">${caption}</div>
        <div class="note-box__footer">
            <button type="button" class="note-box__icon" onclick="menuShow(this)">
                <svg width="15" height="5">
                    <use href="#icon-dots" />
                </svg>
            </button>
            <span class="note-box__date">${date}</span>
        </div>
        <ul class="menu">
            <li class="menu__item" onclick="editItemFunc(this)">
                <svg width="20" height="20">
                    <use href="#icon-edit" />
                </svg>
                ویرایش
            </li>
            <li class="menu__item" onclick="removeItemFunc(this)">
                <svg width="20" height="20">
                    <use href="#icon-delete" />
                </svg>
                حذف
            </li>
        </ul>
    `
    row={
        title: title,
        caption: caption,
        time: time,
        date: date
    }
    notArray.push(row)
    return newLI
}
function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'خطا',
        text: message,
        confirmButtonText: 'باشه'
    });
}
addBox.addEventListener('click', ()=> {
    popupShow()
    noteAddFunc()
})

bodyElem.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        coverHide()
    }
});
bodyElem.addEventListener('click', function (event) {
    let noteBoxIcon= event.target.closest('.note-box__icon')
    let menu = event.target.closest('.menu')
    if (!menu && !noteBoxIcon){
        menuHide()
    }
});

popupForm.addEventListener('submit', event => {
    event.preventDefault()
})
popupCloseBtn.addEventListener('click', coverHide)

popupFormSubmitBtn.addEventListener('click', ()=> {
    if (flag){
        currentTitle = popupFormInput.value.trim()
        currentCaption = popupFormArea.value.trim()
        if (currentTitle){
            index = findIndexInfo(currentTitle)
            if (index === -1){
                currentTime = getTime();
                currentDate = getCurrentDate();
                newLI = notAppendToHtml(currentTitle, currentCaption,currentTime, currentDate)
                list.appendChild(newLI)
                setLocalstorage()
            }else {
                showError('شما مجاز به وارد کردن آیتم تکراری نیستید')
            }
        }else {
            showError('عنوان یادداشت نباید خالی باشد')
        }

    }else {
        Swal.fire({
            title: 'حذف آیتم',
            text: 'آیا مطمئن هستید که می‌خواهید آیتم مورد نظر را ویرایش کنید؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'بلی',
            cancelButtonText: 'خیر',
        }).then((result) => {
            if (result.isConfirmed) {
                let newTitle = popupFormInput.value.toUpperCase()
                let newCaption = popupFormArea.value
                index = findIndexInfo(newTitle)
                if (index === -1){
                    targetBox.querySelector('.note-box__title').textContent = newTitle
                    targetBox.querySelector('.note-box__caption').textContent = newCaption
                    notArray[targetIndex]['title'] = newTitle
                    notArray[targetIndex]['caption'] = newCaption
                }else {
                    targetBox.querySelector('.note-box__title').textContent = resultArray[0]
                    targetBox.querySelector('.note-box__caption').textContent = newCaption
                    notArray[targetIndex]['title'] = resultArray[0]
                    notArray[targetIndex]['caption'] = newCaption
                    showError('این مورد قبلا اضافه شده')
                }
                setLocalstorage()
            }
        });

    }
    coverHide()
})

window.onload = function (){
    let getLocalNoteArray = JSON.parse(localStorage.getItem('localNotArray'));
    console.log('getLocalNoteArray: ', getLocalNoteArray);
    if (getLocalNoteArray != null) {
        let fragmentElement = document.createDocumentFragment()
        getLocalNoteArray.forEach(function (row){
           let newLI = notAppendToHtml(row.title , row.caption , row.time , row.date)
            fragmentElement.appendChild(newLI)
        })
        list.appendChild(fragmentElement)
        setLocalstorage()
    }
}



