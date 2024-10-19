const addButton = document.getElementById("add-button");
const addModal = document.getElementById("addModal");
const closeButtons = document.querySelectorAll(".close-button");
const eternalLinksButton = document.getElementById("eternal-links-button");
const eternalLinksModal = document.getElementById("eternalLinksModal");
const guideModal = document.getElementById("guideModal");
const addForm = document.getElementById("addForm");
const contentSection = document.getElementById("content");
const readButton = document.getElementById("read-button");

// Открытие модального окна для добавления контента
addButton.onclick = () => {
    resetAdCountIfNewDay(); // Сбрасываем счётчик, если новый день
    if (adCount < maxAdsPerDay) {
        openModal(); // Открываем модальное окно
    } else {
        alert("Вы достигли лимита 4 шт. на добавление объявлений. Лимит обновляеться каждые 24 часа. Попробуйте завтра."); // Если лимит исчерпан
    }
};

// Открытие модального окна для вечных ссылок
eternalLinksButton.onclick = () => {
    eternalLinksModal.style.display = "block";
};

// Открытие модального окна для руководства при загрузке страницы
window.onload = () => {
    guideModal.style.display = "block";
};

// Закрытие модальных окон
closeButtons.forEach(button => {
    button.onclick = () => {
        addModal.style.display = "none";
        eternalLinksModal.style.display = "none";
        guideModal.style.display = "none";
    };
});

// Закрытие модальных окон при клике вне их
window.onclick = (event) => {
    if (event.target == addModal || event.target == eternalLinksModal || event.target == guideModal) {
        addModal.style.display = "none";
        eternalLinksModal.style.display = "none";
        guideModal.style.display = "none";
    }
};

// Функция для открытия модального окна добавления контента
function openModal() {
    addModal.style.display = "block";
}

// Обработка отправки формы
addForm.onsubmit = (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const linkInput = document.getElementById("link").value;

    // Проверка ограничений по символам и строкам
    const titleLines = title.split('\n').length;
    const descriptionLines = description.split('\n').length;

    if (title.length > 24 || titleLines > 2) {
        alert("Заголовок не должен превышать 24 символа.");
        return;
    }

    if (description.length > 102 || descriptionLines > 5) {
        alert("Описание не должно превышать 102 символа.");
        return;
    }

    let link;

    // Проверка формата ссылки
    if (linkInput.startsWith('@')) {
        link = `https://t.me/${linkInput.slice(1)}`; // Убираем @ и создаем ссылку
    } else if (linkInput.match(/^[a-zA-Z0-9_]+$/)) {
        link = `https://t.me/${linkInput}`; // Создаем ссылку для username
    } else {
        link = linkInput; // Оставляем http ссылку как есть
    }

    // Создание нового блока контента
    const contentBlock = document.createElement("div");
    contentBlock.className = "content-block";
    contentBlock.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <button class="link-button" onclick="window.open('${link}', '_blank')">Подробнее...</button>
    `;
    contentSection.appendChild(contentBlock);

// Увеличиваем счётчик объявлений
    adCount++;
    localStorage.setItem("adCount", adCount);
    adCountDisplay.textContent = `Доступно: ${maxAdsPerDay - adCount}`;  
  
    // Сброс формы и закрытие модального окна
    addForm.reset();
    addModal.style.display = "none";
};

// Обработчик нажатия кнопки "Прочитал" в руководстве
readButton.onclick = () => {
    guideModal.style.display = "none"; // Закрываем руководство
};

//=========== СЧЁТЧИК =============
const maxAdsPerDay = 4; // Максимум объявлений в день
let adCount = localStorage.getItem("adCount") || 0; // Получаем количество объявлений из localStorage или 0
let lastAdDate = localStorage.getItem("lastAdDate") || new Date().toDateString(); // Дата последнего объявления
const adCountDisplay = document.getElementById("ad-count"); // Элемент для отображения оставшихся объявлений

// Обновляем счётчик объявлений
adCountDisplay.textContent = `Доступно: ${maxAdsPerDay - adCount}`;

function resetAdCountIfNewDay() {
    const today = new Date().toDateString(); // Получаем сегодняшнюю дату
    if (today !== lastAdDate) {
        adCount = 0; // Сбрасываем счётчик
        localStorage.setItem("adCount", adCount); // Сохраняем новый счётчик
        localStorage.setItem("lastAdDate", today); // Сохраняем новую дату
        adCountDisplay.textContent = `Доступно: ${maxAdsPerDay - adCount}`; // Обновляем отображение
    }
}