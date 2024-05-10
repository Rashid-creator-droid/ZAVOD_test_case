let offset = 0;
const limit = 3;
const contentContainer = document.getElementById('content-container');
let loading = false;
let hasMoreContent = true;
let selectedTag = null;

// Скролл
window.onscroll = function () {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    const bottomThreshold = 100;
    if (!loading && hasMoreContent && window.innerHeight + window.scrollY >= document.body.offsetHeight - bottomThreshold) {
    loading = true;

        if (selectedTag) {
            loadMoreContent(`/api/posts/?tag=${selectedTag}&offset=${offset}&limit=${limit}`).then(() => {
            console.log(hasMoreContent)
                loading = false;
                if (!hasMoreContent) {
                    window.onscroll = null;
                }
            });
        } else {
            loadMoreContent().then(() => {
                loading = false;
                console.log(hasMoreContent)
                if (!hasMoreContent) {
                    window.onscroll = null;
                }
            });
        }
    }
};


let tags = [];
fetch(`/api/tags/`)
    .then(response => response.json())
    .then(data => {
        tags = data;
        renderTags(tags);
    })
    .catch(error => console.error("Ошибка при загрузке тегов:", error));

// Отображение тегов
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


// Подгрузка новых постов
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

// Фильтрация по тегу
function filterByTag(tagId) {
    offset = 0;
    selectedTag = tagId;
    contentContainer.innerHTML = '';
    hasMoreContent = true;
    loadMoreContent();
    window.onscroll = function() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.scrollHeight;
        const bottomThreshold = 100;
        if (!loading && hasMoreContent && window.innerHeight + window.scrollY >= document.body.offsetHeight - bottomThreshold) {
            loading = true;
            if (selectedTag) {
                loadMoreContent(`/api/posts/?tag=${selectedTag}&offset=${offset}&limit=${limit}`).then(() => {
                    loading = false;
                    if (!hasMoreContent) {
                        window.onscroll = null;
                    }
                });
            } else {
                loadMoreContent().then(() => {
                    loading = false;
                    if (!hasMoreContent) {
                        window.onscroll = null;
                    }
                });
            }
        }
    };
}


// Элементы поста.
function createPostElement(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post-container');

    const nameElement = document.createElement('p');
    nameElement.textContent = post.name;
    nameElement.classList.add('post-name');
    nameElement.addEventListener('click', function() {
        window.location.href = `/post_detail/${post.id}`;
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
    likeCountLabel.textContent = 'Лайки: ';
    likeCountContainer.appendChild(likeCountLabel);

    const likeCountElement = document.createElement('span');
    likeCountElement.id = `likeCount_${post.id}`;
    likeCountElement.textContent = post.like_count;
    likeCountContainer.appendChild(likeCountElement);

    const dislikeCountContainer = document.createElement('div');
    dislikeCountContainer.classList.add('count-container');
    postContainer.appendChild(dislikeCountContainer);

    const dislikeCountLabel = document.createElement('span');
    dislikeCountLabel.textContent = 'Дизлайки: ';
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
