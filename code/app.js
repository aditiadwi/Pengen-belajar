document.addEventListener('DOMContentLoaded', () => {
    console.log("Coffee News Page Ready!");
    fetchNews();

    // Set up search functionality
    const searchBtn = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) fetchNews(query);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
});

const newsGrid = document.getElementById('news-grid');

const MOCK_NEWS = [
    {
        title: "Test: The Perfect Espresso Shot",
        urlToImage: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=800",
        description: "If you see this card, your CSS and card rendering logic are working correctly. This is a placeholder for real news.",
        url: "#"
    },
    {
        title: "Test: Sustainable Coffee Beans",
        urlToImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        description: "Verification card #2: Checking if the grid layout handles multiple items properly across columns.",
        url: "#"
    },
    {
        title: "Test: Morning Brew Rituals",
        urlToImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
        description: "Verification card #3: Testing responsiveness and image scaling within your news cards.",
        url: "#"
    }
];

async function fetchNews(query = 'coffee') {
    // Show the spinner while fetching
    newsGrid.innerHTML = '<div class="spinner"></div>';

    try {
        // Use a relative path so it works on both localhost and Vercel
        const response = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.status === 'ok') {
            if (!data.articles || data.articles.length === 0) {
                newsGrid.innerHTML = '<p class="status-message">No news found for that brew. Try searching for "Espresso" or "Roast".</p>';
                return;
            }

            console.log(`Successfully fetched ${data.articles.length} articles for: ${query}`);
            renderArticles(data.articles);
        } else {
            newsGrid.innerHTML = `<p class="status-message">Error: ${data.message}</p>`;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        newsGrid.innerHTML = '<p class="status-message">API not reachable. Showing test cards to verify UI:</p>';
        renderArticles(MOCK_NEWS);
    }
}

function renderArticles(articles) {
    newsGrid.innerHTML = ''; // Clear the "loading" message

    if (!articles || articles.length === 0) {
        newsGrid.innerHTML = '<p class="status-message">No news found for this topic. Try another search!</p>';
        return;
    }

    articles.forEach(article => {
        if (!article.urlToImage) return; // Skip articles without images for a better UI

        const card = document.createElement('article');
        card.className = 'news-card';
        card.innerHTML = `
            <img src="${article.urlToImage}" alt="${article.title}" loading="lazy">
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.description ? article.description.substring(0, 100) + '...' : ''}</p>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read Full Story</a>
            </div>
        `;
        newsGrid.appendChild(card);
    });
}
