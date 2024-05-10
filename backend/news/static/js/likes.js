const ws = new WebSocket('ws://localhost:8001/ws/post_likes_dislikes/');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const postId = data.post_id;
    const likeCount = data.like_count;
    const dislikeCount = data.dislike_count;

    const likeCountElement = document.getElementById(`likeCount_${postId}`);
    const dislikeCountElement = document.getElementById(`dislikeCount_${postId}`);

    if (likeCountElement && dislikeCountElement && typeof likeCount !== 'undefined' && typeof dislikeCount !== 'undefined') {
        likeCountElement.textContent = likeCount;
        dislikeCountElement.textContent = dislikeCount;
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

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('dislikeBtn')) {
        const postId = event.target.getAttribute('data-post-id');
        addDislike(postId);
    }
});

function addLike(postId) {
    const csrftoken = getCookie('csrftoken');

    fetch(`http://127.0.0.1:8001/api/posts/${postId}/add_favorite/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ status: true })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function addDislike(postId) {
    const csrftoken = getCookie('csrftoken');

    fetch(`http://127.0.0.1:8001/api/posts/${postId}/add_favorite/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({ status: false })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}
