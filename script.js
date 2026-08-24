let initialPosts = [];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('postForm');
    const searchInput = document.getElementById('search-input'); 

    loadInitialPosts();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
        const post = { title, body };

        mostrarLoading();
        try {
            const response = await axios.post('https://jsonplaceholder.typicode.com/posts', post);
            const createdPost = response.data;
            
            alert('Post criado com sucesso!');
            
            initialPosts.unshift(createdPost);
            
            const postsContainer = document.getElementById('posts');
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.id = createdPost.id;
            postElement.innerHTML = `
                <h2 class="post-title">${createdPost.title}</h2>
                <p class="post-body">${createdPost.body}</p>
            `;
            postsContainer.prepend(postElement);

            form.reset();
        } catch (error) {
            alert('Erro ao criar post.');
            console.error(error);
        } finally {
            ocultarLoading();
        }
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            initialPosts.forEach(post => {
                const postElement = document.getElementById(post.id);
                if (postElement) {
                    if (postElement.textContent.toLowerCase().includes(searchTerm)) {
                        postElement.style.display = 'block';
                    } else {
                        postElement.style.display = 'none';
                    }
                }
            });
        });
    }

    document.getElementById('recarregarPosts').addEventListener('click', loadInitialPosts);
});

async function loadInitialPosts() {
    const postsContainer = document.getElementById('posts');
    mostrarLoading();
    
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5');
        initialPosts = response.data;
        
        postsContainer.innerHTML = '';

        initialPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.id = post.id;

            postElement.innerHTML = `
                <h2 class="post-title">${post.title}</h2>
                <p class="post-body">${post.body}</p>
            `;

            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Erro ao obter os posts:', error);
        alert('Erro ao carregar posts.');
    } finally {
        ocultarLoading();
    }
}

function mostrarLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'block';
}

function ocultarLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}