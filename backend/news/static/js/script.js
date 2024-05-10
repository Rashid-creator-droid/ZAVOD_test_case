let offset = 0;
const limit = 3;
const contentContainer = document.getElementById('content-container');
let loading = false;
let hasMoreContent = true;

// Бесконечный скролл.
window.onscroll = function () {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    const bottomThreshold = 100;

    if (!loading && hasMoreContent && scrollPosition >= pageHeight - bottomThreshold) {
        loading = true;

        loadMoreContent().then(() => {
            loading = false;

            if (!hasMoreContent) {
                window.onscroll = null;
            }
        });
    }
};

// Загрузка постов при скроле вниз
function loadMoreContent() {
    return fetch(`/api/posts/?offset=${offset}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length === 0) {
                hasMoreContent = false;
            } else {
                data.results.forEach(post => {
                    const postElement = createPostElement(post);
                    contentContainer.appendChild(postElement);
                });
                offset += data.results.length;
            }
        });
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

    const likeCountElement = document.createElement('span');
    likeCountElement.id = `likeCount_${post.id}`;
    likeCountElement.textContent = `Лайки: ${post.like_count}`;
    postContainer.appendChild(likeCountElement);


    const dislikeCountElement = document.createElement('span');
    dislikeCountElement.id = `dislikeCount_${post.id}`;
    dislikeCountElement.textContent = `Дизлайки: ${post.dislike_count}`;
    postContainer.appendChild(dislikeCountElement);

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


//const ws = new WebSocket('ws://localhost:8001/ws/post_likes_dislikes/');
//
//ws.onmessage = function(event) {
//    const data = JSON.parse(event.data);
//    const postId = data.post_id;
//    const likeCount = data.like_count;
//    const dislikeCount = data.dislike_count;
//
//    const likeCountElement = document.getElementById(`likeCount_${postId}`);
//    const dislikeCountElement = document.getElementById(`dislikeCount_${postId}`);
//
//    if (likeCountElement && dislikeCountElement && typeof likeCount !== 'undefined' && typeof dislikeCount !== 'undefined') {
//        likeCountElement.textContent = `Лайки: ${likeCount}`;
//        dislikeCountElement.textContent = `Дизлайки: ${dislikeCount}`;
//    }
//};
//
//ws.onopen = function(event) {
//    console.log("WebSocket connected.");
//};
//
//// Обработчик события нажатия на кнопку like
//document.addEventListener('click', function(event) {
//    if (event.target.classList.contains('likeBtn')) {
//        const postId = event.target.getAttribute('data-post-id');
//        addLike(postId);
//    }
//});
//
//// Обработчик события нажатия на кнопку Dislike
//document.addEventListener('click', function(event) {
//    if (event.target.classList.contains('dislikeBtn')) {
//        const postId = event.target.getAttribute('data-post-id');
//        addDislike(postId);
//    }
//});
//
//function addLike(postId) {
//    const csrftoken = getCookie('csrftoken');
//
//    fetch(`http://127.0.0.1:8001/api/posts/${postId}/add_favorite/`, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json',
//            'X-CSRFToken': csrftoken
//        },
//        body: JSON.stringify({ status: true })
//    })
//    .then(response => {
//        if (!response.ok) {
//            throw new Error('Network response was not ok');
//        }
//        return response.json();
//    })
//    .then(data => {
//    })
//    .catch(error => {
//        console.error('Error:', error);
//    });
//}
//
//function addDislike(postId) {
//    const csrftoken = getCookie('csrftoken');
//
//    fetch(`http://127.0.0.1:8001/api/posts/${postId}/add_favorite/`, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json',
//            'X-CSRFToken': csrftoken
//        },
//        body: JSON.stringify({ status: false })
//    })
//    .then(response => {
//        if (!response.ok) {
//            throw new Error('Network response was not ok');
//        }
//        return response.json();
//    })
//    .then(data => {
//    })
//    .catch(error => {
//        console.error('Error:', error);
//    });
//}

// Функция для получения значения CSRF токена из cookie
function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}
    loadMoreContent();
