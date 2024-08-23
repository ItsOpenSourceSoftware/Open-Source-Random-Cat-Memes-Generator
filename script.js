document.addEventListener('DOMContentLoaded', function() {
    const catImage = document.getElementById('cat-image');
    const catFact = document.getElementById('cat-fact');
    const newMemeButton = document.getElementById('new-meme-button');
    const downloadButton = document.getElementById('download-button');
    const rateLimitStatus = document.getElementById('rate-limit-status');

    async function fetchCatMeme() {
        try {
            // Fetch a new cat meme
            const memeResponse = await fetch('https://api.thecatapi.com/v1/images/search');
            
            // Check for rate limit info in headers if available
            const rateLimitLimit = memeResponse.headers.get('X-RateLimit-Limit');
            const rateLimitRemaining = memeResponse.headers.get('X-RateLimit-Remaining');
            const rateLimitReset = memeResponse.headers.get('X-RateLimit-Reset');
            
            if (rateLimitLimit && rateLimitRemaining) {
                rateLimitStatus.textContent = `Rate Limit Info: ${rateLimitRemaining} requests remaining out of ${rateLimitLimit}. Resets at: ${rateLimitReset ? new Date(rateLimitReset * 1000).toLocaleTimeString() : 'N/A'}`;
            } else {
                rateLimitStatus.textContent = 'Rate Limit Info: Not available.';
            }
            
            if (memeResponse.status === 429) {
                rateLimitStatus.textContent = 'Rate limit exceeded. Try again later.';
                return;
            }

            // Parse the JSON response
            const memeData = await memeResponse.json();
            const memeUrl = memeData[0].url;

            // Fetch a cat fact
            const factResponse = await fetch('https://meowfacts.herokuapp.com/');
            const factData = await factResponse.json();
            const factText = factData.data[0];

            // Update the page with the new meme and fact
            catImage.src = memeUrl;
            catFact.textContent = factText;

            // Set the download button attributes
            downloadButton.href = memeUrl;
            downloadButton.style.display = 'inline'; // Ensure the button is visible
            downloadButton.textContent = 'Download Meme';

        } catch (error) {
            console.error('Error fetching cat meme:', error);
        }
    }

    newMemeButton.addEventListener('click', fetchCatMeme);

    // Fetch a new meme every time the page is loaded or refreshed
    fetchCatMeme();
});
