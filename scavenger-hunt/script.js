const cats = [
	"vega-back",
	"vega-angry"
];

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

// Auto-mark current page as visited when script loads
// Uncomment the line below if you want pages to be automatically marked as visited
// markPageVisited();

// Example usage:

// On each scavenger hunt page (apple.html, orange.html, banana.html), call:
markPageVisited();

// To check if hunt is complete:
if (checkAllPagesVisited()) {
    alert('Congratulations! You found all the pages!');
}

// To get detailed status:
const status = getScavengerHuntStatus();
console.log(status);
// Output example: { pages: { apple: true, orange: false, banana: true }, completed: false, progress: "2/3" }
