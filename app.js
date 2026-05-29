let currentPage = 1;
let currentQuery = 'coffee';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Coffee News Page Ready!");
    fetchNews();

    // Set up search functionality
    const searchBtn = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const loadMoreBtn = document.getElementById('load-more-btn');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetchNews(query || 'coffee');
    });

    loadMoreBtn.addEventListener('click', () => {
        fetchNews(currentQuery, true);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

const newsGrid = document.getElementById('news-grid');

async function fetchNews(query = 'coffee', isLoadMore = false) {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (!isLoadMore) {
        currentPage = 1;
        currentQuery = query;
        newsGrid.innerHTML = '<div class="spinner"></div>';
        loadMoreBtn.style.display = 'none';
    } else {
        currentPage++;
        loadMoreBtn.innerText = 'Loading...';
        loadMoreBtn.disabled = true;
    }

    try {
        // Memastikan path API relatif agar bekerja di Vercel
        const apiUrl = `/api/news?q=${encodeURIComponent(currentQuery)}&page=${currentPage}`;
        console.log(`Fetching from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'ok') {
            if (!isLoadMore) newsGrid.innerHTML = ''; // Only clear if new search
            
            if (!data.articles || data.articles.length === 0) {
                if (!isLoadMore) {
                    newsGrid.innerHTML = '<p class="status-message">No news found for that brew. Try another search!</p>';
                } else {
                    loadMoreBtn.style.display = 'none';
                    alert("No more articles to load.");
                }
                return;
            }
            console.log(`Successfully fetched page ${currentPage} for: ${currentQuery}`);
            const firstNewCard = renderArticles(data.articles);

            // Smooth scroll to the first new article if loading more
            if (isLoadMore && firstNewCard) {
                firstNewCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Show button if we got a full page of results (usually 20)
            loadMoreBtn.style.display = data.articles.length >= 20 ? 'block' : 'none';
            loadMoreBtn.innerText = 'Load More';
            loadMoreBtn.disabled = false;
        } else {
            newsGrid.innerHTML = `<p class="status-message">Error: ${data.message}</p>`;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        if (!isLoadMore) {
            let errorMsg = error.message;
            if (window.location.protocol === 'file:') {
                errorMsg = "Local files cannot make API calls. Please use a local server or deploy to Vercel.";
            }
            if (errorMsg.includes('401')) {
                errorMsg = "API Key missing or invalid. Check Vercel Environment Variables.";
            }
            newsGrid.innerHTML = `<p class="status-message">Error: Unable to reach the news server (${errorMsg}).</p>`;
        } else {
            alert("Could not load more articles. Please check your connection.");
        }
        loadMoreBtn.innerText = 'Load More';
        loadMoreBtn.disabled = false;
    }
}

function renderArticles(articles) {
    let firstNewElement = null;

    articles.forEach((article, index) => {
        // Use a high-quality placeholder if the API doesn't return an image
        const imageUrl = article.urlToImage || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80';

        const card = document.createElement('article');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${imageUrl}" alt="Coffee News" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80'">
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.description ? article.description.substring(0, 100) + '...' : ''}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read Full Story</a>
            </div>
        `;
        
        if (index === 0) firstNewElement = card;
        newsGrid.appendChild(card);
    });

    return firstNewElement;
}