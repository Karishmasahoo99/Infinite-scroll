const filteredBlogInput = document.getElementById("filtered-blog");
const loader = document.getElementById("loader");

let isLoading = false;
let postCount=0;
let isFiltered=false;
// Function to fetch additional posts from the API
function fetchMorePosts() {
    if (!isLoading && !isFiltered) {
        isLoading = true;
        loader.style.display = "flex"; // Display loader

        fetch(`https://jsonplaceholder.typicode.com/posts?_start=${postCount}&_limit=10`)
            .then(response => response.json())
            .then(posts => {
                // Hide loader
                loader.style.display = "none";

                // Iterate over the fetched posts and create HTML elements to append to the blog container
                posts.forEach(post => {
                    const blogContainer = document.createElement('div');
                    blogContainer.classList.add('blog-container');
                    blogContainer.innerHTML = `
                        <span id="key">${post.id}</span>
                        <h5 class="blog-title">${post.title}</h5>
                        <p>${post.body}</p>
                    `;
                    document.getElementById("all-blog").appendChild(blogContainer);
                });

                isLoading = false;
                (postCount===100) ? postCount=0:
                postCount += 10; // Increment post count for the next fetch
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
                isLoading = false;
                // Hide loader on error
                loader.style.display = "none";
            });
    }
}

// Function to handle scroll events and fetch more posts when user scrolls to bottom
function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // Check if user has scrolled to the bottom of the page
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchMorePosts();
    }
}

// Event listener for scroll events
window.addEventListener("scroll", handleScroll);

function filterBlogPosts() {
    const filterValue = filteredBlogInput.value.toLowerCase(); // Get the input value and convert to lowercase
    const allBlogContainers = document.querySelectorAll(".blog-container");
    isFiltered=filterValue!=="";

    console.log(allBlogContainers);

    allBlogContainers.forEach(blogContainer => {
        const title = blogContainer.querySelector(".blog-title").innerText.toLowerCase(); // Get the title of each blog post and convert to lowercase
        const paragraph = blogContainer.querySelector("p").innerText.toLowerCase(); // Get the paragraph content of each blog post and convert to lowercase
        console.log(title, paragraph);
        // Check if the title or paragraph contains the filter value
        if (title.includes(filterValue) || paragraph.includes(filterValue)) {
            // If the title or paragraph matches the filter value, show the blog post
            blogContainer.style.display = "block";
        } else {
            // If neither the title nor the paragraph matches the filter value, hide the blog post
            blogContainer.style.display = "none";
        }
    });
}

// Event listener for input events on the text input field
filteredBlogInput.addEventListener("input", filterBlogPosts);

// Fetch initial posts when the page loads
fetchMorePosts();
