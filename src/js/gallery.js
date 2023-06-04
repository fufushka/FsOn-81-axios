/**
  |============================
  | Імпортуй свою API і напиши фу-цію "onRenderPage()", яка буде робити запит на сервер і вона ж відрендерить розмітку. Пробуй використовувати модульний підхід
  | можешь окремо строрити файл з розміткою і потім його імпортувати для використання. Також можешь використати шаблонізатор. Ментор тобі в цьому допоможе ; )
  | 
  | Після того коли ми успішно виконали рендер данних з бекенду, передай наступному учаснику виконання наступного функціоналу. Нам потрібно перейти на сайт бібліотеки
  | і підключити пагінацію - https://www.npmjs.com/package/tui-pagination - Бібліотека "tui-pagination".
  |
  | Після успішного підключення пагінації передай виконання на наступного учасника. Далі нам потрібно створити новий запит за картинками по ключовому слову. Переходь
  | в UnsplashAPI.
  |
  | Ось і готовий наш другий запит, давай його випробуємо! У нас з вами тут є тег "form", давайте його використаєм, знайдемо його у Дом дереві і повісимо слуха події
  | ви знаєте яка подія повинна бути) Ну і наостанок напишемо callBack для неї "onSearchFormSubmit()", там де зробимо головну логіку. Після рендера далі дорозберемось 
  | з нашою пагінація, цікаво як вона себе буде поводитись після зміни запиту?
  |
  | Якщо у нас залишився час, давате підключимо перемикач теми. Він знаходиться у файлі "isChangeTheme.js".
  |============================
*/
import { UnsplashAPI } from './UnsplashAPI';
import refs from './refs';
import createGalleryCard from '../templates/gallery-card.hbs';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
import Notiflix from 'notiflix';
import onCheckboxClick from './isChangeTheme';

refs.form.addEventListener('submit', onSearchFormSubmit);

const options = {
  // below default value of options
  totalItems: 10,
  itemsPerPage: 12,
  visiblePages: 5,
  page: 1,
};

const unsplashApi = new UnsplashAPI();
const pagination = new Pagination(refs.container, options);

const page = pagination.getCurrentPage();

async function onSearchFormSubmit(event) {
  event.preventDefault();
  const searchQuery =
    event.currentTarget.elements['user-search-query'].value.trim();

  unsplashApi.query = searchQuery;

  if (!searchQuery) {
    refs.gallery.innerHTML = '';
    refs.container.classList.add('is-hidden');
    return Notiflix.Notify.failure('Empty Query');
  }

  try {
    const response = await unsplashApi.getPhotosByQuery(page);
    console.log(response);

    refs.gallery.innerHTML = createGalleryCard(response.data.results);

    if (response.data.total >= 1) {
      Notiflix.Notify.success(`We find ${response.data.total} photos`);
    }
    if (response.data.results.length === 0) {
      return Notiflix.Notify.warning(
        `Nothing was found by your query: ${searchQuery}`
      );
    }

    pagination.reset(response.data.total);

    refs.container.classList.remove('is-hidden');

    if (response.data.total < 12) {
      refs.container.classList.add('is-hidden');
    } else {
      refs.container.classList.remove('is-hidden');
    }
    refs.form.reset();
  } catch (error) {
    console.log(error);
  }
}

async function createPhotosByQueryPagination(event) {
  const currentPage = event.page;
  try {
    const response = await unsplashApi.getPhotosByQuery(currentPage);

    refs.gallery.innerHTML = createGalleryCard(response.data.results);
  } catch (error) {
    console.log(error);
  }
}

pagination.on('afterMove', createPhotosByQueryPagination);
refs.checkbox.addEventListener('change', onCheckboxClick);
