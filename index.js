
//*********** Начало - Раздел элементы в HTML **********

const $wr = document.querySelector('[data-wr]') //Элемент в HTML для добавления всех карточек
const $popup = document.querySelector('[data-popup]') //Элемент в HTML для добавления карточки (popup)
const $popupWr = document.querySelector('[data-popup_wr]') //Элемент в HTML раздел с модальным окном (popup)
const $openModalBtn = document.querySelector('[data-action="add"]') //Элемент в HTML кнопка для добавления карточки
const $modalsWr = document.querySelector('[data-models_wr]') //Элемент в HTML раздел с модальным окном (Form)
const $cancelModalBtn = document.querySelector('[data-action="cancel"]') //Элемент в НТМL с модальным окном (Form) кнопка (Отмена)

//*********** Конец - Раздел элементы в HTML **********

//*********** Начало - Раздел Касса с API **********

const CONFIG_API = { //Не изменяемые значения API
    url: "http://sb-cats.herokuapp.com/api/2/rmasslove", //URL для взаимодействия с сервером
    headers: { //Заголовки
        "Content-type": "application/json",
    },
};

class Api {  //Класс с методами работы API
    constructor(config) {
        this.url = config.url;
        this.headers = config.headers;
    }

    async getAllCats() {  //получить информацию обо всех котах
        try {
            const responseData = await fetch(`${this.url}/show`)  //Запрос на сервер      
            return responseData.json() //Преобразованный json() ответ

        }   catch (error) { //Отлов ошибки
            throw new Error(error)
        }                  
    }

    getAllCatsIds() {  //(Незадействован) получить массив всех существующих id 
        fetch(`${this.url}/ids`); //Запрос на сервер
    }

    async getCatById(id) {  //получить информацию об одном котике по id 
        try {
            const responseData = await fetch(`${this.url}/show/${id}`); //Запрос на сервер
            return responseData.json() //Преобразованный json() ответ

        }   catch (error) { //Отлов ошибки
            throw new Error(error)
        }
        
    }

    async createCat(data) {  //добавить нового кота (id, name - обязательно!)
        try {
            const responseData = await fetch(`${this.url}/add`, { //Отправка данных на сервер
            method: "POST", //Метод
            headers: this.headers,  //Заголовок
            body: JSON.stringify(data), //Преобразование данных для отправки через json() 
            })

        }   catch (error) { //Отлов ошибки
            throw new Error(error)
        }
    }

    updateCat(id, updateCat) {  //(Незадействован) изменить информацию о коте (запрещено менять id и name) 
        fetch(`${this.url}/update/${id}`, {  //Отправка данных на сервер
            method: "PUT",  //Метод
            headers: this.headers,  //Заголовок
            body: JSON.stringify(updateCat),  //Преобразование данных для отправки через json()
        });
    }

    async deleteCat(id) {  //удалить кота
        try {
            const responseData = await fetch(`${this.url}/delete/${id}`, {  //Отправка данных на сервер
                method: "DELETE",  //Метод           
            })

        }   catch (error) { //Отлов ошибки
            throw new Error(error)
        }       
    }
}

const api = new Api(CONFIG_API); //Создание экземпляра класса

//*********** Конец - Раздел Касса с API **********

//*********** Начало - Раздел с шаблонами для карточек **********

const generateOllCardsHTML = (post) => {  //Создание всех карточек по шаблону
    return `
    <div class="col" data-card_id=${post.id}>
        <div class="card" style="background-color: #a9c2d3;">
            <img src="${post.img_link}" class="card-img-top" alt="${post.name}">
            <div class="card-body">
                <h5 class="card-title">${post.name}</h5>                
                <p class="card-text">${post.favourite}</p>                              
            </div>
        </div>
    </div>
    `
}

const generateCardHTML = (post) => {  //Создание одной карточи по шаблону
    return `
    <div class="col_popup" data-popup_id=${post.id}>
        <div class="card" style="background-color: #a9c2d3;">
            <img src="${post.img_link}" class="card-img-top" alt="${post.name}">
            <div class="card-body">
                <h5 class="card-title">${post.name}</h5>
                <p class="card-text">${post.description}</p>
                <p class="card-text">Возраст: ${post.age} (лет)</p>
                <p class="card-text">${post.rate}</p>
                <p class="card-text">${post.favourite}</p>
                <button data-action="delete" class="btn btn-danger">Удалить</button>
                <button data-action="show" class="btn btn-success">Изменить</button>
                <button data-action="cancel" type="button" class="btn btn-primary">Отмена</button>
            </div>
        </div>
    </div>
    `
}

//*********** Конец - Раздел с шаблонами для карточек **********

//api.getAllCatsIds();  //Получить id всех котов
//api.getCatById(3); //Получить кота по id
/*api.createCat({ //Создать кота
    "id": 8,
    "name": "Макс",
    "rate": 0,
    "age": 5,
    "description": "Суровый",
    "favourite": false,
    "img_link": "https://img2.fonwall.ru/o/nn/kot-koshka-trava.jpg"
});*/
/*api.updateCat(10, { //Изменить кота
    "age": 7,    
});*/

//*********** Начало - Раздел с функцией "Добавление всех карточек" **********

api.getAllCats().then((responseDataJson) => {  //Добавить карточки в HTML
    responseDataJson.data.forEach(post => $wr.insertAdjacentHTML('beforeend', generateOllCardsHTML(post))) //Метод добавления
    const objOllCards = responseDataJson.data //Сохраняем объект с данными по всем карточкам
    setCardLocalStorage('ollCardsData', objOllCards) //Вызов функции сохранение объекта с данными в LocalStorage
}).catch((alert)); 

//*********** Конец - Раздел с функцией "Добавление всех карточек" **********

//*********** Начало - Раздел с (popup) окном (изменения и удаления) карточек **********

let $cardWr //Переменная для хранения элемента с id в HTML
let catId //Переменная для хранения id карточки

$wr.addEventListener("click", (Event) => { //Событие клика по картачкам

    $cardWr = Event.target.closest('[data-card_id]') //Определяем элемент с id в HTML
    catId = $cardWr.dataset.card_id  //Определение id карточки
    
    api.getCatById(catId).then((responseDataJson) => {  //Добавить карточку (popup) в HTML
        $popup.insertAdjacentHTML('beforeend', generateCardHTML(responseDataJson.data)) //Метод добавления
        $popupWr.classList.remove('popup_hidden') //Удаление скрывающего класса (display: none;) для (popup) окна
        document.body.classList.add('blur') //Добавление класса для наложения 'blur'
        
        const objCatById = responseDataJson.data //Сохраняем объект с данными 1 карточки
        
        setCardLocalStorage('cardData', objCatById) //Вызов функции сохранение объекта с данными в LocalStorage
        const objCardData = getCardLocalStorage('cardData') //Вызов функции получение объекта с данными карточки из LocalStorage
        console.log('objCardData', objCardData) //Служебный вывод в консоль для отладки

    }).catch((alert));
    $popup.addEventListener("click", clickPopupCard) //Добавление обработчика события на (Popup)
})

const clickPopupCard = (Event) => { //Событие клика по крточке (popup)

    const $popupEl = Event.target.closest('[data-popup_id]') //Определяем элемент с id в HTML

    if (Event.target.dataset.action == "cancel") { //Клик по кнопке "Отмена" => закрытие (popup) окна
        clickButtonCancel($popupEl) //Вызов функции "Отмена"
        
    } else {

        if (Event.target.dataset.action == "show") {  //Действия для клика на кнопку "Изменить"
            clickButtonShow($popupEl) //Вызов функции редактирования карточки
            
        } else {

            if (Event.target.dataset.action == "delete") { //Действия для клика на кнопку "Удалить"
                clickButtonDelete($popupEl) //Вызов функции "Удаления" карточки                                  
            } 
        }
    }
}

const clickButtonCancel = ($popupEl) => { //Функция "Отмена" (popup)
    
    $popupEl.remove() //Метод удаления карточки из (popup)
    $popupWr.classList.add('popup_hidden')  //Добавление скрывающего класса (display: none;) для (popup) окна
    document.body.classList.remove('blur') //Удаление класса для наложения 'blur'
    $popup.removeEventListener("click", clickPopupCard) //Снятие обработчика события на (Popup)
}

const clickButtonDelete = ($popupEl) => { //Функция "Удаления" карточки

    if (confirm('Вы уверены?')) { //Вызов сообщения подтверждения действия на удаление
                    
        api.deleteCat(catId).then(() => {  //Удалить карточку из HTML
        
            $cardWr.remove() //Метод удаления
            $popupEl.remove() //Метод удаления карточки из (popup)
            $popupWr.classList.add('popup_hidden')  //Добавление скрывающего класса (display: none;) для (popup) окна
            document.body.classList.remove('blur') //Удаление класса для наложения 'blur'
            $popup.removeEventListener("click", clickPopupCard) //Снятие обработчика события на (Popup)
            deleteCardFromLocalStorage('cardData') //Вызов функции удаления объекта с данными карточки из LocalStorage
        
        }).catch(alert)
    } 
}

const clickButtonShow = ($popupEl) => { //Вызов функции редактирования карточки
    console.log('clickButtonShow', $popupEl) //Служебный вывод в консоль для отладки
}

//*********** Конец - Раздел с (popup) окном (изменения и удаления) карточек **********

//*********** Начало - Раздел с модальным окном "Добавление карточки" **********

const submitAddCatForm = (Event) => { //Событие клика по кнопке для модального окна с добавлением карточки
    Event.preventDefault()  //Отмена действия для формы (Form) по умолчанию (отмена перезагрузки страницы)

    const data = Object.fromEntries(new FormData(Event.target).entries()) //Получение всех данных из формы (Form) модального окна

    data.id = Number(data.id)  //Преобразования части данных из form name="add_cat"
    data.rate = Number(data.rate) //Преобразования части данных из form name="add_cat"
    data.favourite = data.favourite == 'on' //Преобразования части данных из form name="add_cat"

    api.createCat(data).then(() => { //Добавить новую карточку в HTML
        $wr.insertAdjacentHTML('beforeend', generateOllCardsHTML(data)) //Метод добавления
        $modalsWr.classList.add('hidden')  //Добавление скрывающего класса (display: none;) для модального окна
        Event.target.reset() //Очищает поля формы (Form) модального окна
        document.body.classList.remove('blur') //Удаление класса для наложения 'blur'
    }).catch(alert)    
}

$openModalBtn.addEventListener('click', () => { //Клик по кнопке "Добавить" => открытие модального окна
    $modalsWr.classList.remove('hidden') //Удаление скрывающего класса (display: none;) для модального окна
    document.body.classList.add('blur') //Добавление класса для наложения 'blur'
    document.forms.add_cat.addEventListener('submit', submitAddCatForm) //Добавление обработчика события на (Form)

    $cancelModalBtn.addEventListener('click', () => { //Клик по кнопке "Отмена" => закрытие модального окна
        $modalsWr.classList.add('hidden')  //Добавление скрывающего класса (display: none;) для модального окна
        document.body.classList.remove('blur') //Удаление класса для наложения 'blur'
        document.forms.add_cat.removeEventListener('submit', submitAddCatForm) //Снятие обработчика события с (Form)
    })
})

//*********** Конец - Раздел с модальным окном "Добавление карточки" **********

//*********** Начало - Раздел с добавлением данными 1 карточки в LocalStorage **********

const setCardLocalStorage = (key, data) => { //Функция добавление в LocalStorage
    
    this.key = key //Значения (key)
    this.data = data //Значения (data)
    const strData = JSON.stringify(data) //Преобразование данных объекта в строковое значение
    localStorage.setItem(this.key, strData) //Метод добавление в LocalStorage
}

const getCardLocalStorage = (key) => { //Функция получения из LocalStorage
    
    this.key = key //Значения (key)
    const strData = localStorage.getItem(key) //Преобразование данных из строкового значения в объект
    return JSON.parse(strData) //Метод получения из LocalStorage    
}  

const deleteCardFromLocalStorage = (key) => { //Функция удаления из LocalStorage
    
    this.key = key //Значения (key)
    localStorage.removeItem(key) //Метод удаления из LocalStorage
}
 
//*********** Конец - Раздел с добавлением данными 1 карточки в LocalStorage **********