const cats = [
    "vega-back",
    "vega-angry",
    "vega-passed-out"
];

// Quiz configuration - add questions for each page
const quizConfig = {
    "vega-angry": {
        correctAnswer: "yogurt"
    },
    "vega-back": {
        correctAnswer: "Vega ran away from home"
    },
    "vega-passed-out": {
        correctAnswer: "steak"
    },
};

// Scavenger Hunt JavaScript Functions
// Function to set a cookie marking the current page as visited
function markPageVisited() {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // Check if current location is allowed
    const isFileProtocol = protocol === 'file:';
    const isAllowedDomain = hostname.endsWith('github.io') || hostname.endsWith('agau4779.net');
    
    if (!isFileProtocol && !isAllowedDomain) {
        console.log(`Page not marked as visited - domain ${hostname} not allowed`);
        return false;
    }
    
    // Get the current page filename (e.g., "apple.html")
    const currentPage = window.location.pathname.split('/').pop();
    
    // Set cookie with page name (without .html extension) as the key
    const pageName = currentPage.replace('.html', '');
    // For web domains, use cookies as before
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days
    
    document.cookie = `visited_${pageName}=true; expires=${expirationDate.toUTCString()}; path=/`;
    console.log(`Page ${pageName} marked as visited via cookie on domain ${hostname}!`);    
    return true;
}

// Function to check if a specific page has been visited
function isPageVisited(pageName) {
    // For web domains, check cookies
    const cookieName = `visited_${pageName}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length) === 'true';
        }
    }
    return false;
}

// Function to check if all required pages have been visited
function checkAllPagesVisited(requiredPages = cats) {
    const visitedPages = [];
    const unvisitedPages = [];
    
    for (const page of requiredPages) {
        if (isPageVisited(page)) {
            visitedPages.push(page);
        } else {
            unvisitedPages.push(page);
        }
    }
    
    const allVisited = unvisitedPages.length === 0;
    
    console.log('Visited pages:', visitedPages);
    console.log('Unvisited pages:', unvisitedPages);
    console.log('All pages visited:', allVisited);
    
    return allVisited;
}

// Function to get the status of all pages
function getScavengerHuntStatus(requiredPages = cats) {
    const status = {};
    
    for (const page of requiredPages) {
        status[page] = isPageVisited(page);
    }
    
    return {
        pages: status,
        completed: checkAllPagesVisited(requiredPages),
        progress: `${Object.values(status).filter(Boolean).length}/${requiredPages.length}`
    };
}

// Function to reset the scavenger hunt (clear all cookies/localStorage)
function resetScavengerHunt(requiredPages = cats) {
    for (const page of requiredPages) {
        // Set cookie to expire in the past to delete it
        document.cookie = `visited_${page}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
    console.log('Scavenger hunt reset - all cookie progress cleared');
}

// Quiz handling functions
function handleQuizSubmission() {
    const currentPage = window.location.pathname.split('/').pop();
    const pageName = currentPage.replace('.html', '');
    const quizData = quizConfig[pageName];
    
    if (!quizData) {
        // If no quiz configured for this page, mark as visited immediately
        markPageVisited();
        showReturnButton();
        return;
    }
    
    const form = document.getElementById('quiz-form');
    const feedback = document.getElementById('quiz-feedback');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        
        if (!selectedAnswer) {
            feedback.innerHTML = '<p style="color: orange;">Please select an answer!</p>';
            return;
        }
        
        if (selectedAnswer.value === quizData.correctAnswer) {
            // Hide the quiz form
            document.getElementById('quiz-section').style.display = 'none';
            
            // Show success message
            document.getElementById('success-message').style.display = 'block';
            
            // Mark page as visited and show return button
            markPageVisited();
            showReturnButton();
            
            // Check if all pages are complete
            if (checkAllPagesVisited()) {
                setTimeout(() => {
                    alert('Congratulations! You found all the pages!');
                }, 500);
            }
        } else {
            feedback.innerHTML = '<p style="color: red;">Incorrect! Please try again.</p>';
            
            // Clear the selected radio button so they can choose again
            selectedAnswer.checked = false;
        }
    });
}

function showReturnButton() {
    const returnButton = document.getElementById('return-button');
    if (returnButton) {
        returnButton.style.display = 'block';
    }
}

// Initialize page
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    const pageName = currentPage.replace('.html', '');
    
    // Check if page was already visited
    if (isPageVisited(pageName)) {
        // Hide quiz and show success message and return button
        const quizSection = document.getElementById('quiz-section');
        if (quizSection) {
            quizSection.style.display = 'none';
        }
        document.getElementById('success-message').style.display = 'block';
        showReturnButton();
        console.log(`Page ${pageName} already completed`);
    } else {
        // Set up quiz handling
        handleQuizSubmission();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializePage);