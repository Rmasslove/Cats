
//*********** Начало - Раздел элементы в HTML **********

const $wr = document.querySelector('[data-wr]') //Элемент в HTML для добавления всех карточек
const $popup = document.querySelector('[data-popup]') //Элемент в HTML для добавления карточки (popup)
const $popupWr = document.querySelector('[data-popup_wr]') //Элемент в HTML раздел с модальным окном (popup)
const $openModalBtn = document.querySelector('[data-action="add"]') //Элемент в HTML кнопка для добавления карточки
const $modalsWr = document.querySelector('[data-models_wr]') //Элемент в HTML раздел с модальным окном (Form)
const $cancelModalBtn = document.querySelector('[data-action="cancel"]') //Элемент в НТМL с модальным окном (Form) кнопка (Отмена)
const $modalUpdateWr = document.querySelector('[data-modalupdate_wr]')  //Элемент в HTML раздел с модальным окном (FormShow)


//*********** Конец - Раздел элементы в HTML **********

//*********** Начало - Раздел Касса с API **********

const CONFIG_API = { //Не изменяемые значения API
    url: "https://sb-cats.herokuapp.com/api/2/rmasslove", //URL для взаимодействия с сервером
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

    async getAllCatsIds() {  //(!) получить массив всех существующих id 
        try {
            const responseData = await fetch(`${this.url}/ids`); //Запрос на сервер      
            return responseData.json() //Преобразованный json() ответ

        }   catch (error) { //Отлов ошибки
            throw new Error(error)
        }        
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

    async updateCat(id, dataUpdate) {  //Изменить информацию о коте (запрещено менять id и name) 
        try {
            const responseData = await fetch(`${this.url}/update/${id}`, { //Отправка данных на сервер
                method: "PUT",  //Метод
                headers: this.headers,  //Заголовок
                body: JSON.stringify(dataUpdate),  //Преобразование данных для отправки через json()
            })

        }   catch (error) { //Отлов ошибки
            throw new Error(error)
        }        
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

const urlDefault = "https://bipbap.ru/wp-content/uploads/2020/11/raskraski-kotikov-92-min.jpg" //Картинка кота по умолчанию

const checked = "checked" //Переменная со значением "checked" в (checkbox) (FormUpdate) 

let resultUnicod = ""

const generateOllCardsHTML = (post) => {  //Создание всех карточек по шаблону
    return `
    <div class="col" data-card_id=${post.id}>
        <div class="card" style="background-color: #a9c2d3;">
            <img src="${post.img_link || urlDefault}" class="card-img-top" alt="${post.name}">
            <div class="card-body">
                <h5 class="card-title">${post.name}</h5>                
                <p class="card-text favourite_${post.favourite}"><i class="fa-solid fa-heart"></i></p>                              
            </div>
        </div>
    </div>
    `
}

const generateCardHTML = (post) => {  //Создание одной карточи по шаблону
    return `
    <div class="col_popup" data-popup_id=${post.id}>
        <div class="card" style="background-color: #a9c2d3;">
            <img src="${post.img_link || urlDefault}" class="card-img-top" alt="${post.name}">
            <div class="card-body">
                <h5 class="card-title">${post.name}</h5>
                <p class="card-text favourite_${post.favourite}"><i class="fa-solid fa-heart"></i></p>
                <p class="card-text">${post.description}</p>
                <p class="card-text">Возраст: ${post.age}</p>
                <p class="card-text">Рейтинг: ${resultUnicod}</p>                
                <button data-action="delete" class="btn btn-danger">Удалить</button>
                <button data-action="show" class="btn btn-success">Изменить</button>
                <button data-action="cancel" type="button" class="btn btn-primary">Отмена</button>
            </div>
        </div>
    </div>
    `
}

const generateFormShowHTML = (post) => {
    return `
    <div data-modal_update class="update-modal">
        <form name="update_cat">
          <div class="mb-3">          
            <p name="id">id - ${post.id}</p>          
          </div>
          <div class="mb-3">
            <h3 name="name">${post.name}</h3>
          </div>
          <div class="mb-3">
            <input
            placeholder="Возраст"
            name="age"
            value="${post.age}"
            type="number" 
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp">
          </div>        
          <div class="mb-3">
            <input
            placeholder="Рейтинг"
            name="rate"
            value="${post.rate}" 
            type="number" 
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <input
            placeholder="Описание"
            name="description"
            value="${post.description}" 
            type="text" 
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp">
          </div>          
          <div class="mb-3 form-check">
            <input name="favourite" type="checkbox" class="form-check-input" id="exampleCheck2" ${post.favourite && checked}>
            <label class="form-check-label " for="exampleCheck2"><i class="fa-solid fa-heart favourite_${post.favourite}"></i> Любимец</label>
          </div>
          <div class="mb-3">
            <input
            placeholder="URL"
            name="img_link"
            value="${post.img_link}" 
            type="text" 
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp">
          </div>
          <div class="form_button">
            <button data-action_update="add" type="submit" class="btn btn-success">Добавить</button>
            <button data-action_update="cancel" type="button" class="btn btn-primary">Отмена</button>            
          </div>        
        </form>
      </div>
      `
}

//*********** Конец - Раздел с шаблонами для карточек **********

//api.getAllCatsIds();  //Получить id всех котов

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
        
        const rateResultUnicod = (rate) => {
            const unicode = '&#9734'
            resultUnicod =""
            for (i = 0; i < rate; i++) {
            resultUnicod = resultUnicod + unicode
            }
            return resultUnicod
        }
        rateResultUnicod(responseDataJson.data.rate)

        $popup.insertAdjacentHTML('beforeend', generateCardHTML(responseDataJson.data)) //Метод добавления
        $popupWr.classList.remove('popup_hidden') //Удаление скрывающего класса (display: none;) для (popup) окна
        document.body.classList.add('blur') //Добавление класса для наложения 'blur'
        
        const objCatById = responseDataJson.data //Сохраняем объект с данными 1 карточки
        
        setCardLocalStorage('cardData', objCatById) //Вызов функции сохранение объекта с данными в LocalStorage
        
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
    
    $popupEl.remove() //Метод удаления карточки из (popup)
    $popupWr.classList.add('popup_hidden')  //Добавление скрывающего класса (display: none;) для (popup) окна
    $popup.removeEventListener("click", clickPopupCard) //Снятие обработчика события на (Popup)

    const objCardData = getCardLocalStorage('cardData') //Вызов функции получение объекта с данными карточки из LocalStorage
        
    $modalUpdateWr.insertAdjacentHTML('beforeend', generateFormShowHTML(objCardData)) //Метод добавления формы с заполнением данных
    $modalUpdateWr.classList.remove('modalupdate_hidden') //Удаление скрывающего класса (display: none;) для (FormUpdate) окна
    const $modalUpdate = document.querySelector('[data-modal_update]') //Элемент в HTML окно (FormUpdate)
    const $modalUpdateBtn = document.querySelector('[data-action_update="cancel"]') //Элемент в НТМL с модальным окном (FormShow) кнопка (Отмена)
    document.forms.update_cat.addEventListener('submit', clickFormUpdate) //Добавление обработчика события на (FormUpdate)


    $modalUpdateBtn.addEventListener('click', () => { //Клик по кнопке "Отмена" => закрытие модального окна (FormUpdate)
        $modalUpdate.remove() //Метод удаления карточки из (FormUpdate)
        $modalUpdateWr.classList.add('modalupdate_hidden')  //Добавление скрывающего класса (display: none;) для (FormUpdate) окна
        document.body.classList.remove('blur') //Удаление класса для наложения 'blur'
        $modalUpdateWr.removeEventListener('submit', clickFormUpdate) //Снятие обработчика события с (FormUpdate)
    })
}

//*********** Конец - Раздел с (popup) окном (изменения и удаления) карточек **********

//*********** Начало - Раздел с (FormUpdate) функция (редактирование) карточек **********

const clickFormUpdate = (Event) => { //Событие клика по крточке (FormUpdate)
    Event.preventDefault()  //Отмена действия для формы (FormUpdate) по умолчанию (отмена перезагрузки страницы)

    const dataUpdate = Object.fromEntries(new FormData(document.forms.update_cat).entries()) //Получение всех данных из формы (FormUpdate) модального окна
    
    dataUpdate.favourite = dataUpdate.favourite == 'on' //Преобразования части данных из form name="update_cat"
    
    api.updateCat(catId, dataUpdate).then(() => { //Изменить информацию о коте       
    location.reload () //Перезагрузка страницы браузера после обновления информации
    }).catch(alert)      
}

//*********** Конец - Раздел с (FormUpdate) функция (редактирование) карточек **********

//*********** Начало - Раздел с модальным окном "Добавление карточки" **********

const submitAddCatForm = (Event) => { //Событие клика по кнопке для модального окна с добавлением карточки
    Event.preventDefault()  //Отмена действия для формы (Form) по умолчанию (отмена перезагрузки страницы)

    const data = Object.fromEntries(new FormData(Event.target).entries()) //Получение всех данных из формы (Form) модального окна
 
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

//*********** Начало - Раздел с добавлением данных в LocalStorage **********

/*Т.к. в этом проекте LocalStorage толком некуда всунуть - добавляю туда данные всех
карточек + данные по 1 карточке (popup) окна. В дальнейшем - получаю данные по 1 карточке
и подставляю их в форму для редоктирования (FormUpdate) карточки.*/

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