document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.getElementById('blog-content');
    const footer = document.getElementById('footer');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    let currentIndex = 0;
    let blogFiles = [];
    let touchStartX = 0;
    let touchEndX = 0;

    // Fetch the list of blog files from the JSON file
    fetch('blog-files.json')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched blog files:', data); // Debug log
            blogFiles = data;
            // Load the most recent blog on page load
            loadBlog(blogFiles.length - 1);
        })
        .catch(error => console.error('Error fetching blog files:', error));

    function loadBlog(index) {
        if (index < 0 || index >= blogFiles.length) return;

        console.log('Loading blog:', blogFiles[index]); // Debug log
        fetch(blogFiles[index])
            .then(response => response.text())
            .then(data => {
                blogContainer.innerHTML = data;
                currentIndex = index;
                console.log('Current index:', currentIndex); // Debug log

                // Enable/disable navigation buttons
                prevButton.disabled = currentIndex === 0;
                nextButton.disabled = currentIndex === blogFiles.length - 1;

                // Extract and display the date from the filename
                const date = blogFiles[index].match(/(\d{4}-\d{2}-\d{2})/)[0];
                footer.textContent = `Date: ${date}`;
            })
            .catch(error => console.error('Error loading blog:', error));
    }

    function handleScroll(event) {
        console.log('Scroll event detected:', event.deltaY); // Debug log
        if (event.deltaY > 0) {
            // Scroll down
            console.log('Scrolling down'); // Debug log
            loadBlog(currentIndex + 1);
        } else if (event.deltaY < 0) {
            // Scroll up
            console.log('Scrolling up'); // Debug log
            loadBlog(currentIndex - 1);
        }
    }

    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
    }

    function handleTouchEnd(event) {
        touchEndX = event.changedTouches[0].clientX;
        if (touchEndX < touchStartX) {
            // Swipe left
            console.log('Swiped left'); // Debug log
            loadBlog(currentIndex + 1);
        } else if (touchEndX > touchStartX) {
            // Swipe right
            console.log('Swiped right'); // Debug log
            loadBlog(currentIndex - 1);
        }
    }

    prevButton.addEventListener('click', () => loadBlog(currentIndex - 1));
    nextButton.addEventListener('click', () => loadBlog(currentIndex + 1));

    // Attach scroll event for desktop
    blogContainer.addEventListener('wheel', handleScroll);

    // Attach touch events for mobile
    blogContainer.addEventListener('touchstart', handleTouchStart);
    blogContainer.addEventListener('touchend', handleTouchEnd);
});
