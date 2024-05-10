let offset = 0;
const limit = 3;
const contentContainer = document.getElementById('content-container');
let loading = false;
let hasMoreContent = true;
let selectedTag = null; // Переменная для хранения выбранного тега

// Бесконечный скролл.
window.onscroll = function () {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    const bottomThreshold = 100;

    if (!loading && hasMoreContent && window.innerHeight + window.scrollY >= document.body.offsetHeight - bottomThreshold) {
    loading = true;

        if (selectedTag) {
            // Если выбран тег, загружаем контент с учетом тега
            loadMoreContent(`/api/posts/?tag=${selectedTag}&offset=${offset}&limit=${limit}`).then(() => {
                loading = false;

                if (!hasMoreContent) {
                    window.onscroll = null;
                }
                console.log(' Yfasd')
            });
        } else {
            // Если тег не выбран, загружаем обычный контент
            loadMoreContent().then(() => {
                loading = false;

                if (!hasMoreContent) {
                    window.onscroll = null;
                }
                console.log(' Yfasd')
            });
        }
    }
};


let tags = [];
fetch('http://127.0.0.1:8001/api/tags/')
    .then(response => response.json())
    .then(data => {
        tags = data.results;
        renderTags(tags);
    })
    .catch(error => console.error("Ошибка при загрузке тегов:", error));

// Функция для отображения тегов
function renderTags(tags) {
    const tagsContainer = document.getElementById('tags-container');
    tags.forEach(tag => {
        const tagElement = document.createElement('button');
        tagElement.textContent = tag.name;
        tagElement.classList.add('tagBtn');
        tagElement.setAttribute('data-tag-id', tag.id);
        tagElement.addEventListener('click', () => filterByTag(tag.id));
        tagsContainer.appendChild(tagElement);
    });
}



function loadMoreContent() {
    let url = `/api/posts/?offset=${offset}&limit=${limit}`;
    if (selectedTag) {
        url += `&tag=${selectedTag}`;
    }

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.next === null) {
                    data.results.forEach(post => {
                    const postElement = createPostElement(post);
                    contentContainer.appendChild(postElement);
                });
                hasMoreContent = false;
            } else {
                data.results.forEach(post => {
                    const postElement = createPostElement(post);
                    contentContainer.appendChild(postElement);
                });
                offset += data.results.length;
            }
        })
        .catch(error => console.error("Ошибка при загрузке постов:", error));
}

// Функция для фильтрации постов по выбранному тегу
function filterByTag(tagId) {
    offset = 0; // Сбрасываем смещение при изменении тега
    selectedTag = tagId; // Сохраняем выбранный тег
    contentContainer.innerHTML = ''; // Очищаем контейнер перед загрузкой новых постов
    loadMoreContent(); // Вызываем функцию загрузки постов
}

// Элементы поста.
function createPostElement(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post-container');

    const nameElement = document.createElement('p');
    nameElement.textContent = post.name;
    nameElement.classList.add('post-name'); // Добавляем класс для стилизации или выделения ссылки
    nameElement.addEventListener('click', function() {
        window.location.href = `/post_detail/${post.id}`; // Переход на страницу post_detail с id поста
    });
    postContainer.appendChild(nameElement);

    const authorInfo = document.createElement('p');
    authorInfo.textContent = `Автор: ${post.author.first_name} ${post.author.last_name}`;
    postContainer.appendChild(authorInfo);

    const pubDate = new Date(post.pub_date);
    const formattedDate = pubDate.toLocaleDateString('ru-RU');
    const dateInfo = document.createElement('p');
    dateInfo.textContent = `Дата публикации: ${formattedDate}`;
    postContainer.appendChild(dateInfo);

    const thumbnail = document.createElement('img');
    thumbnail.src = post.image;
    thumbnail.alt = "Image";
    postContainer.appendChild(thumbnail);

    const content = document.createElement('p');
    content.textContent = post.text;
    postContainer.appendChild(content);

    const likeCountContainer = document.createElement('div');
    likeCountContainer.classList.add('count-container');
    postContainer.appendChild(likeCountContainer);

    const likeCountLabel = document.createElement('span');
    likeCountLabel.textContent = 'Лайки: '; // Статичный текст
    likeCountContainer.appendChild(likeCountLabel);

    const likeCountElement = document.createElement('span');
    likeCountElement.id = `likeCount_${post.id}`;
    likeCountElement.textContent = post.like_count;
    likeCountContainer.appendChild(likeCountElement);

    const dislikeCountContainer = document.createElement('div');
    dislikeCountContainer.classList.add('count-container');
    postContainer.appendChild(dislikeCountContainer);

    const dislikeCountLabel = document.createElement('span');
    dislikeCountLabel.textContent = 'Дизлайки: '; // Статичный текст
    dislikeCountContainer.appendChild(dislikeCountLabel);

    const dislikeCountElement = document.createElement('span');
    dislikeCountElement.id = `dislikeCount_${post.id}`;
    dislikeCountElement.textContent = post.dislike_count;
    dislikeCountContainer.appendChild(dislikeCountElement);





    const likeButton = document.createElement('button');
    likeButton.classList.add('likeBtn');
    likeButton.setAttribute('data-post-id', post.id);
    likeButton.textContent = 'Лайк';
    postContainer.appendChild(likeButton);

    const dislikeButton = document.createElement('button');
    dislikeButton.classList.add('dislikeBtn');
    dislikeButton.setAttribute('data-post-id', post.id);
    dislikeButton.textContent = 'Дизлайк';
    postContainer.appendChild(dislikeButton);

    return postContainer;
}

// Функция для получения значения CSRF токена из cookie
function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}
    loadMoreContent();
