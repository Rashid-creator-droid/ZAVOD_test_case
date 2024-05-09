
let page = 1; // Начальная страница
let noMorePages = false;
let loading = false;


// Функция для отправки запроса на аутентификацию
function login(email, password) {
    return fetch('http://127.0.0.1:8001/api/auth/token/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Сохраняем токен в cookies
        document.cookie = `auth_token=${data.auth_token}; path=/`;
    });
}

// Функция для получения постов
function fetchPosts() {
    // Получаем токен из cookies
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    return fetch((`http://127.0.0.1:8001/api/posts/?page=${page}`), {
        headers: {
            'Authorization': `Token ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}

// Функция для отображения постов
function renderPosts(posts) {
    const postsContainer = document.getElementById('postsContainer');
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
            <h2>${post.name}</h2>
            <img src="${post.image}" alt="Post Image">
            <p>${post.text}</p>
            <p>${post.is_favorited}
            <div>
                <span>Likes: <span id="likeCount_${post.id}">${post.like_count}</span></span>
                <span>Dislikes: <span id="dislikeCount_${post.id}">${post.dislike_count}</span></span>
            </div>
            <button class="likeBtn" data-post-id="${post.id}">Like</button>
            <button class="dislikeBtn" data-post-id="${post.id}">Dislike</button>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Проверяем наличие токена в cookies при загрузке страницы
window.onload = function() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token) {
        document.getElementById('loginForm').style.display = 'none'; // Скрыть форму входа
        document.getElementById('postsContainer').style.display = 'block'; // Показать контейнер для постов
        fetchAndRenderPosts(); // Загрузить и отобразить посты
    }
};

// Обработчик события отправки формы для входа
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвратить отправку формы по умолчанию

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    login(username, password)
    .then(() => {
        // После успешной аутентификации
        document.getElementById('loginForm').style.display = 'none'; // Скрыть форму входа
        document.getElementById('postsContainer').style.display = 'block'; // Показать контейнер для постов
        fetchAndRenderPosts(); // Загрузить и отобразить посты
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Функция для загрузки и отображения постов
const scrollHandler = function() {
    // Проверяем, идет ли уже загрузка данных, и если нет, и пользователь пролистал до конца страницы, начинаем загрузку новой страницы
    if (!loading && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loading = true; // Устанавливаем флаг загрузки данных

        // Вызываем функцию загрузки данных
        fetchAndRenderPosts()
        .then(() => {
            loading = false; // После завершения загрузки снимаем флаг загрузки данных
        })
        .catch(error => {
            console.error('Error fetching and rendering posts:', error);
            loading = false; // Если произошла ошибка, снимаем флаг загрузки данных
        });
    }
};

// Добавляем обработчик события прокрутки страницы
window.addEventListener('scroll', scrollHandler);

// Функция для загрузки и отображения постов
function fetchAndRenderPosts() {
    // Если нет больше страниц, то просто выходим из функции
    if (noMorePages) {
        return Promise.resolve();
    }

    return fetchPosts()
    .then(posts => {
        // Проверяем, является ли posts массивом
        if (Array.isArray(posts)) {
            renderPosts(posts);
        } else if (posts.results) {
            // Если posts - это объект с результатами, попробуем преобразовать его в массив
            renderPosts(posts.results);
        } else {
            console.error('Error: Invalid posts data format');
        }
        if (posts.next !== null) {
            document.getElementById('loadMoreBtn').style.display = 'block'; // Показать кнопку "Load More"
            page++; // Увеличиваем номер страницы для следующего запроса
        } else {
            noMorePages = true;
            document.getElementById('loadMoreBtn').style.display = 'none';
            window.removeEventListener('scroll', scrollHandler);
        }
    });
}


// Обработчик события нажатия на кнопку "Load More"
document.getElementById('loadMoreBtn').addEventListener('click', fetchAndRenderPosts);

const ws = new WebSocket('ws://localhost:8001/ws/post_likes_dislikes/');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const postId = data.post_id;
    const likeCount = data.like_count;
    const dislikeCount = data.dislike_count;

    // Обновляем счетчики лайков и дизлайков на странице
    const likeCountElement = document.getElementById(`likeCount_${postId}`);
    const dislikeCountElement = document.getElementById(`dislikeCount_${postId}`);

// Проверяем, существуют ли элементы DOM, прежде чем обновлять их содержимое
    if (likeCountElement && dislikeCountElement) {
        likeCountElement.innerText = likeCount;
        dislikeCountElement.innerText = dislikeCount;
    }
};

ws.onopen = function(event) {
    console.log("WebSocket connected.");
};

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('likeBtn')) {
        const postId = event.target.getAttribute('data-post-id');
        addLike(postId);
    }
});

// Обработчик события нажатия на кнопку "Dislike"
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('dislikeBtn')) {
        const postId = event.target.getAttribute('data-post-id');
        addDislike(postId);
    }
});

function addLike(postId) {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    fetch(`http://127.0.0.1:8001/api/posts/${postId}/add_favorite/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: true })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })

    .catch(error => {
        console.error('Error:', error);
    });
}

// Функция для добавления дизлайка к посту
function addDislike(postId) {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    fetch(`http://127.0.0.1:8001/api/posts/${postId}/add_favorite/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: false })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}