        // Создаем WebSocket соединение
        const socket = new WebSocket('ws://localhost:8001/ws/post_likes_dislikes/');

        // Функция для обновления счетчиков
        function updateCount(data) {
            document.getElementById('like_count').innerText = data.like_count;
            document.getElementById('dislike_count').innerText = data.dislike_count;
        }

        // Функция для отправки запроса на сервер для получения начальных значений счетчиков
        function fetchInitialCount() {
            fetch('http://127.0.0.1:8001/api/posts/') // Замените URL на ваш URL API
                .then(response => response.json())
                .then(data => {
                    // Выбираем первый пост из списка и обновляем счетчики
                    if (data.results.length > 0) {
                        const post = data.results[0];
                        updateCount({
                            like_count: post.like_count,
                            dislike_count: post.dislike_count
                        });
                    }
                })
                .catch(error => console.error('Error:', error));
        }

        // Отправляем запрос на сервер для получения начальных значений счетчиков при загрузке страницы
        fetchInitialCount();

        // Функция для обработки полученных сообщений от сервера
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            updateCount(data);
        };