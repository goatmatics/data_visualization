// Hamro Awaz - Interactive JavaScript
// Public Polling Platform functionality

// Clear localStorage for testing (uncomment to reset)
// localStorage.clear();

// Clear session ID for testing (uncomment to reset session)
// localStorage.removeItem('hamroawaz_session_id');

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initPollingSystem();
    initWorldMap();
    initSmoothScrolling();
    initAnimations();
    initMobileMenu();
    
    // Load real poll data after a short delay
    setTimeout(loadRealPollData, 500);
    
    // Initialize language system
    setTimeout(initLanguage, 100);

    // Start global refresh (loads counters + map from Google Sheet via Apps Script)
    setTimeout(startGlobalRefresh, 800);
});

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.98)';
            nav.style.backdropFilter = 'blur(25px)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
        }
    });
    
    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Polling system functionality
function initPollingSystem() {
    const pollOptions = document.querySelectorAll('.poll-option');
    
    pollOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        const label = option.querySelector('.option-text');
        
        // Add click handler to entire option
        option.addEventListener('click', function() {
            if (!radio.checked) {
                radio.checked = true;
                updatePollSelection(this);
            }
        });
        
        // Add hover effects
        option.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        option.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
}

// Update poll selection visual feedback
function updatePollSelection(selectedOption) {
    const pollCard = selectedOption.closest('.poll-card');
    const allOptions = pollCard.querySelectorAll('.poll-option');
    
    // Remove previous selections
    allOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to current option
    selectedOption.classList.add('selected');
    
    // Enable submit button
    const submitBtn = pollCard.querySelector('.submit-poll-btn');
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
}

// Submit poll function
async function submitPoll(pollId) {
    console.log('submitPoll called with:', pollId); // Debug log
    
    // Check global voting setting first
    const savedConfig = localStorage.getItem('hamroawaz_poll_config');
    if (savedConfig) {
        const pollConfig = JSON.parse(savedConfig);
        if (pollConfig.globalSettings && !pollConfig.globalSettings.allowVoting) {
            alert('Voting is currently disabled site-wide. Please try again later.');
            return;
        }
    }
    
    // Check if poll is active
    if (window.pollLifecycleManager && !window.pollLifecycleManager.isPollActive(pollId)) {
        const status = window.pollLifecycleManager.getPollStatus(pollId);
        let message = 'This poll is not currently accepting votes.';
        
        if (status === 'ended') {
            message = 'Voting has ended for this poll.';
        } else if (status === 'paused') {
            message = 'Voting is temporarily paused for this poll.';
        }
        
        alert(message);
        return;
    }
    
    // Additional check: directly check localStorage for poll status
    if (savedConfig) {
        const pollConfig = JSON.parse(savedConfig);
        if (pollConfig.polls && pollConfig.polls[pollId]) {
            const poll = pollConfig.polls[pollId];
            if (poll.status === 'paused') {
                alert('Voting is temporarily paused for this poll.');
                return;
            } else if (poll.status === 'ended') {
                alert('Voting has ended for this poll.');
                return;
            }
        }
    }
    
    // Find the poll card by looking for the radio button with the matching name
    const selectedOption = document.querySelector(`input[name="${pollId}"]:checked`);
    
    if (!selectedOption) {
        alert('Please select an option before submitting!');
        return;
    }
    
    const pollCard = selectedOption.closest('.poll-card');
    const submitBtn = pollCard.querySelector('.submit-poll-btn');
    
    console.log('Found poll card:', pollCard); // Debug log
    console.log('Found submit button:', submitBtn); // Debug log
    
    // Get poll details for data saving
    const question = pollCard.querySelector('.poll-question').textContent;
    const category = pollCard.querySelector('.poll-category').textContent;
    
    // Get detailed location information
    const userLocation = await detectLocation();
    
    // Mark as submitted locally (don't send to server yet)
    await markPollAsSubmitted(pollId, selectedOption.value, question, category);
    
    // Update the submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Thank you for voting';
    submitBtn.style.background = 'var(--gradient-secondary)';
    submitBtn.style.opacity = '0.7';
    submitBtn.classList.add('submitted');
    
    console.log('Button text changed to:', submitBtn.textContent); // Debug log
    
    // Add visual feedback to poll card
    pollCard.classList.add('submitted');
    
    // Show visual feedback (but don't change button text)
    showPollResults(pollCard, selectedOption.value, true); // Pass true to skip button text change
    
    // Send data to server immediately
    console.log('Sending poll data to server...');
    sendToServer({
        pollId: pollId,
        response: selectedOption.value,
        question: question,
        category: category,
        timestamp: new Date().toISOString(),
        sessionId: liveStats.sessionId,
        userCountry: userLocation.country,
        userState: userLocation.state,
        userCity: userLocation.city,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        timezone: userLocation.timezone,
        ip: userLocation.ip,
        countryCode: userLocation.countryCode,
        regionCode: userLocation.regionCode,
        userAgent: navigator.userAgent,
        language: navigator.language
    }, 'poll');
}

// Mark poll as submitted locally
async function markPollAsSubmitted(pollId, response, question, category) {
    // Get detailed location information
    const userLocation = await detectLocation();
    
    // Store in localStorage for later bulk submission
    const submittedPolls = JSON.parse(localStorage.getItem('hamroawaz_submitted_polls') || '{}');
    submittedPolls[pollId] = {
        pollId: pollId,
        response: response,
        question: question,
        category: category,
        timestamp: new Date().toISOString(),
        sessionId: liveStats.sessionId,
        userCountry: userLocation.country,
        userAgent: navigator.userAgent,
        language: navigator.language
    };
    localStorage.setItem('hamroawaz_submitted_polls', JSON.stringify(submittedPolls));
}

function saveDemographicDataFromPolls() {
    // Collect demographic data from the demographic polls
    const residencePoll = document.querySelector('input[name="poll18"]:checked');
    const agePoll = document.querySelector('input[name="poll19"]:checked');
    const affiliationPoll = document.querySelector('input[name="poll20"]:checked');
    
    if (residencePoll && agePoll && affiliationPoll) {
        const residence = residencePoll.nextElementSibling.textContent.trim();
        const ageGroup = agePoll.nextElementSibling.textContent.trim();
        const affiliation = affiliationPoll.nextElementSibling.textContent.trim();
        
        saveDemographicData(ageGroup, residence, affiliation);
    }
}

// Show poll results
function showPollResults(pollCard, selectedValue, skipButtonTextChange = false) {
    const pollOptions = pollCard.querySelectorAll('.poll-option');
    const submitBtn = pollCard.querySelector('.submit-poll-btn');
    
    // Get real vote counts for this poll
    const pollResponses = JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]');
    const pollId = pollCard.querySelector('input[type="radio"]').name;
    const pollVotes = pollResponses.filter(response => response.pollId === pollId);
    
    // Count votes for each option
    const voteCounts = {};
    pollVotes.forEach(vote => {
        voteCounts[vote.response] = (voteCounts[vote.response] || 0) + 1;
    });
    
    const totalVotes = pollVotes.length;
    
    // Update option bars with real data
    pollOptions.forEach(option => {
        const value = option.querySelector('input[type="radio"]').value;
        const votes = voteCounts[value] || 0;
        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
        
        const optionFill = option.querySelector('.option-fill');
        const optionPercentage = option.querySelector('.option-percentage');
        
        if (optionFill && optionPercentage) {
        optionFill.style.width = percentage + '%';
            optionPercentage.textContent = votes + ' votes';
        }
        
        // Highlight selected option
        if (value === selectedValue) {
            option.style.borderColor = 'var(--primary-color)';
            option.style.background = 'rgba(0, 255, 136, 0.1)';
        }
    });
    
    // Update response count with real data
    const responseElement = pollCard.querySelector('.poll-responses');
    if (responseElement) {
        responseElement.textContent = totalVotes + ' responses';
    }
    
    // Show thank you message (only if not skipping button text change)
    if (!skipButtonTextChange) {
        submitBtn.textContent = 'Thank you for voting';
    submitBtn.style.background = 'var(--gradient-accent)';
    }
}

// Load real poll data and update display
function loadRealPollData() {
    // Update all polls with real vote counts
    const pollCards = document.querySelectorAll('.poll-card');
    
    pollCards.forEach(pollCard => {
        const pollId = pollCard.querySelector('input[type="radio"]').name;
        const pollResponses = JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]');
        const pollVotes = pollResponses.filter(response => response.pollId === pollId);
        
        if (pollVotes.length > 0) {
            // Count votes for each option
            const voteCounts = {};
            pollVotes.forEach(vote => {
                voteCounts[vote.response] = (voteCounts[vote.response] || 0) + 1;
            });
            
            const totalVotes = pollVotes.length;
            
            // Update option bars with real data
            const pollOptions = pollCard.querySelectorAll('.poll-option');
            pollOptions.forEach(option => {
                const value = option.querySelector('input[type="radio"]').value;
                const votes = voteCounts[value] || 0;
                const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                
                const optionFill = option.querySelector('.option-fill');
                const optionPercentage = option.querySelector('.option-percentage');
                
                if (optionFill && optionPercentage) {
                    optionFill.style.width = percentage + '%';
                    optionPercentage.textContent = votes + ' votes';
                }
            });
            
            // Update response count
            const responseElement = pollCard.querySelector('.poll-responses');
            if (responseElement) {
                responseElement.textContent = totalVotes + ' responses';
            }
        }
    });
}

// Live Statistics System
let liveStats = {
    visitors: 0,
    countries: new Set(),
    pollsCompleted: 0,
    responses: 0,
    sessionId: null,
    globalStatsLoaded: false
};

// Poll Data Storage System
let pollData = {
    responses: {},
    demographics: {},
    timestamp: null
};

// Global users map
let userMap;
let userMarkers = [];
let userMarkersLayer = null;

// Initialize live statistics
function initWorldMap() {
    // Generate unique session ID
    liveStats.sessionId = generateSessionId();
    
    // Only track visitor and load local stats if global stats haven't been loaded yet
    if (!liveStats.globalStatsLoaded) {
    // Track new visitor
    trackVisitor();
    
    // Load existing data from localStorage
    loadStoredStats();
    }
    
    // Start live updates
    startLiveUpdates();
    
    // Initialize global users map with delay to ensure proper loading
    setTimeout(() => {
    initGlobalUsersMap();
    }, 500);
    
    // Animate stats
    animateStats();
}

// Generate or retrieve persistent session ID
function generateSessionId() {
    // Check if we already have a session ID stored
    let existingSessionId = localStorage.getItem('hamroawaz_session_id');
    
    if (existingSessionId) {
        // Use existing session ID
        return existingSessionId;
    } else {
        // Generate new session ID and store it
        const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('hamroawaz_session_id', newSessionId);
        return newSessionId;
    }
}

// Track real voters (no simulated data)
function trackVisitor() {
    // Don't override global stats if they've been loaded
    if (liveStats.globalStatsLoaded) {
        console.log('Skipping trackVisitor - global stats already loaded');
        return;
    }
    
    console.log('trackVisitor called - updating local stats');
    
    // Load real voter count from actual poll responses
    const pollResponses = JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]');
    const uniqueVoters = new Set(pollResponses.map(response => response.sessionId));
    liveStats.visitors = uniqueVoters.size;
    
    // Load real countries from actual voters
    const voterCountries = new Set(pollResponses.map(response => response.userCountry));
    liveStats.countries = voterCountries;
    
    // Load real poll completion count
    liveStats.pollsCompleted = pollResponses.length;
    liveStats.responses = pollResponses.length;
    
    console.log('Local stats updated:', {
        visitors: liveStats.visitors,
        countries: liveStats.countries.size,
        pollsCompleted: liveStats.pollsCompleted
    });
    
        saveStats();
}

// Check if current user has already voted in any polls
function hasUserVoted() {
    const pollResponses = JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]');
    const currentSessionId = liveStats.sessionId;
    return pollResponses.some(response => response.sessionId === currentSessionId);
}

// Get current user's vote count
function getUserVoteCount() {
    const pollResponses = JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]');
    const currentSessionId = liveStats.sessionId;
    return pollResponses.filter(response => response.sessionId === currentSessionId).length;
}

// Enhanced location detection with detailed information
async function detectLocation() {
    try {
        // Try multiple IP geolocation services that support CORS
        const services = [
            'https://ipapi.co/json/',
            'https://ipinfo.io/json',
            'https://api.ipify.org?format=json',
            'https://ip-api.com/json/'
        ];
        
        let data = null;
        let serviceUsed = '';
        
        // Try each service until one works
        for (const service of services) {
            try {
                console.log(`Trying location service: ${service}`);
                const response = await fetch(service, {
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    data = await response.json();
                    serviceUsed = service;
                    console.log(`Successfully used service: ${service}`, data);
                    break;
                }
            } catch (serviceError) {
                console.log(`Service ${service} failed:`, serviceError.message);
                continue;
            }
        }
        
        if (data) {
            // Parse data based on which service was used
            let countryName = 'Unknown';
            let stateName = 'Unknown';
            let cityName = 'Unknown';
            let latitude = null;
            let longitude = null;
            let timezone = 'Unknown';
            let ip = 'Unknown';
            let countryCode = 'Unknown';
            let regionCode = 'Unknown';
            
            if (serviceUsed.includes('ipapi.co')) {
                countryName = data.country_name || 'Unknown';
                stateName = data.region || data.state || 'Unknown';
                cityName = data.city || 'Unknown';
                latitude = data.latitude || null;
                longitude = data.longitude || null;
                timezone = data.timezone || 'Unknown';
                ip = data.ip || 'Unknown';
                countryCode = data.country_code || 'Unknown';
                regionCode = data.region_code || 'Unknown';
            } else if (serviceUsed.includes('ipinfo.io')) {
                countryName = data.country || 'Unknown';
                stateName = data.region || 'Unknown';
                cityName = data.city || 'Unknown';
                latitude = data.loc ? parseFloat(data.loc.split(',')[0]) : null;
                longitude = data.loc ? parseFloat(data.loc.split(',')[1]) : null;
                timezone = data.timezone || 'Unknown';
                ip = data.ip || 'Unknown';
                countryCode = data.country || 'Unknown';
                regionCode = data.region || 'Unknown';
            } else if (serviceUsed.includes('ip-api.com')) {
                countryName = data.country || 'Unknown';
                stateName = data.regionName || 'Unknown';
                cityName = data.city || 'Unknown';
                latitude = data.lat || null;
                longitude = data.lon || null;
                timezone = data.timezone || 'Unknown';
                ip = data.query || 'Unknown';
                countryCode = data.countryCode || 'Unknown';
                regionCode = data.region || 'Unknown';
            }
            
            // Standardize country names
            countryName = standardizeCountryName(countryName);
            
            return {
                country: countryName,
                state: stateName,
                city: cityName,
                latitude: latitude,
                longitude: longitude,
                timezone: timezone,
                ip: ip,
                countryCode: countryCode,
                regionCode: regionCode
            };
        }
        
        throw new Error('All IP geolocation services failed');
    } catch (error) {
        console.log('Could not detect location via IP, using timezone fallback');
        // Fallback to timezone detection
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        let country = 'Unknown';
        let state = 'Unknown';
        
        if (timezone.includes('Asia/Kathmandu')) {
            country = 'Nepal';
            state = 'Bagmati';
        } else if (timezone.includes('America/New_York')) {
            country = 'United States';
            state = 'New York';
        } else if (timezone.includes('America/Chicago')) {
            country = 'United States';
            state = 'Illinois';
        } else if (timezone.includes('America/Denver')) {
            country = 'United States';
            state = 'Colorado';
        } else if (timezone.includes('America/Los_Angeles')) {
            country = 'United States';
            state = 'California';
        } else if (timezone.includes('Europe/London')) {
            country = 'United Kingdom';
            state = 'England';
        } else if (timezone.includes('Europe/Berlin')) {
            country = 'Germany';
            state = 'Berlin';
        } else if (timezone.includes('Asia/Tokyo')) {
            country = 'Japan';
            state = 'Tokyo';
        } else if (timezone.includes('Australia/')) {
            country = 'Australia';
            state = 'New South Wales';
        } else if (timezone.includes('Asia/Kolkata')) {
            country = 'India';
            state = 'Delhi';
        } else if (timezone.includes('America/Toronto')) {
            country = 'Canada';
            state = 'Ontario';
        }
        
        return {
            country: country,
            state: state,
            city: 'Unknown',
            latitude: null,
            longitude: null,
            timezone: timezone,
            ip: 'Unknown',
            countryCode: 'Unknown',
            regionCode: 'Unknown'
        };
    }
}

// Standardize country names to ensure consistency
function standardizeCountryName(countryName) {
    const countryMap = {
        'US': 'United States',
        'USA': 'United States',
        'United States of America': 'United States',
        'UK': 'United Kingdom',
        'GB': 'United Kingdom',
        'Great Britain': 'United Kingdom',
        'DE': 'Germany',
        'FR': 'France',
        'IT': 'Italy',
        'ES': 'Spain',
        'NL': 'Netherlands',
        'SE': 'Sweden',
        'NO': 'Norway',
        'DK': 'Denmark',
        'FI': 'Finland',
        'PL': 'Poland',
        'CZ': 'Czech Republic',
        'HU': 'Hungary',
        'RO': 'Romania',
        'BG': 'Bulgaria',
        'GR': 'Greece',
        'TR': 'Turkey',
        'RU': 'Russia',
        'CN': 'China',
        'KR': 'South Korea',
        'TH': 'Thailand',
        'SG': 'Singapore',
        'MY': 'Malaysia',
        'ID': 'Indonesia',
        'PH': 'Philippines',
        'VN': 'Vietnam',
        'TW': 'Taiwan',
        'HK': 'Hong Kong',
        'NZ': 'New Zealand',
        'MX': 'Mexico',
        'AR': 'Argentina',
        'CL': 'Chile',
        'CO': 'Colombia',
        'PE': 'Peru',
        'VE': 'Venezuela',
        'BR': 'Brazil',
        'AU': 'Australia',
        'CA': 'Canada',
        'ZA': 'South Africa',
        'IN': 'India',
        'JP': 'Japan',
        'NP': 'Nepal'
    };
    
    return countryMap[countryName] || countryName;
}

// Backward compatibility function
async function detectCountry() {
    const location = await detectLocation();
    return location.country;
}

// Load stored statistics (only real data from actual voters)
function loadStoredStats() {
    // Only load local stats if global stats haven't been loaded yet
    if (!liveStats.globalStatsLoaded) {
        console.log('loadStoredStats called - loading local stats');
        trackVisitor();
    updateStatsDisplay();
    } else {
        console.log('loadStoredStats skipped - global stats already loaded');
    }
}

// Save statistics to localStorage
function saveStats() {
    const dataToSave = {
        visitors: liveStats.visitors,
        countries: Array.from(liveStats.countries),
        pollsCompleted: liveStats.pollsCompleted,
        responses: liveStats.responses,
        lastUpdated: Date.now()
    };
    
    localStorage.setItem('hamroawaz_stats', JSON.stringify(dataToSave));
}

// Update statistics display
function updateStatsDisplay() {
    const totalVisitorsEl = document.getElementById('total-visitors');
    const activeCountriesEl = document.getElementById('active-countries');
    const pollsCompletedEl = document.getElementById('polls-completed');
    
    if (totalVisitorsEl) {
        totalVisitorsEl.textContent = liveStats.visitors.toLocaleString();
    }
    
    if (activeCountriesEl) {
        activeCountriesEl.textContent = liveStats.countries.size;
    }
    
    if (pollsCompletedEl) {
        pollsCompletedEl.textContent = liveStats.pollsCompleted.toLocaleString();
    }
    
    // Update poll response counts
    updatePollResponseCounts();
}

// Update poll response counts
function updatePollResponseCounts() {
    const responseElements = document.querySelectorAll('.poll-responses');
    responseElements.forEach(el => {
        el.textContent = `${liveStats.responses.toLocaleString()} responses`;
    });
}

// Update real data from actual poll responses
function startLiveUpdates() {
    // Update every 5 seconds to refresh real data
    setInterval(() => {
        // Only update local stats if global stats haven't been loaded yet
        if (!liveStats.globalStatsLoaded) {
            trackVisitor();
            updateStatsDisplay();
        }
    }, 5000);
    
}

// Initialize global users map
function initGlobalUsersMap() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded. Map will not be displayed.');
        // Show a fallback message
        const mapContainer = document.getElementById('user-map');
        if (mapContainer) {
            mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary); font-size: 14px;">Map loading... Please refresh if it doesn\'t appear.</div>';
        }
        return;
    }
    
    try {
    // Get user's detected country and coordinates
    const userCountry = detectCountry();
    const userCoords = getCountryCoordinates(userCountry);
    
    // Initialize the map centered on world view
    userMap = L.map('user-map', {
            center: [20, 0], // Center on world view
            zoom: 2, // World view zoom level
        minZoom: 1,
        maxZoom: 18,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true
    });
    
        // Add a dark tile layer with fallback
        const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18
        });
        
        // Add fallback tile layer in case the first one fails
        const fallbackTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        });
        
        // Try to add the primary tile layer, fallback to secondary if it fails
        tileLayer.addTo(userMap);
        tileLayer.on('tileerror', function() {
            console.log('Primary tile layer failed, using fallback');
            userMap.removeLayer(tileLayer);
            fallbackTileLayer.addTo(userMap);
        });

        // Add thin grey country borders overlay
        addCountryBorders(userMap);
        
        // Add pins for all real voters
        updateVoterMap();
    
    // Ensure map fits properly
    setTimeout(() => {
        userMap.invalidateSize();
    }, 100);
        
    } catch (error) {
        console.error('Error initializing map:', error);
        const mapContainer = document.getElementById('user-map');
        if (mapContainer) {
            mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary); font-size: 14px;">Map unavailable. Please refresh the page.</div>';
        }
    }
}

// Add a GeoJSON overlay of country borders with thin grey outlines
function addCountryBorders(mapInstance) {
    try {
        // Create a custom pane so borders sit above tiles but below markers
        const paneName = 'country-borders';
        if (!mapInstance.getPane(paneName)) {
            mapInstance.createPane(paneName);
            mapInstance.getPane(paneName).style.zIndex = 350; // between tile (200) and overlay (400)
            mapInstance.getPane(paneName).style.pointerEvents = 'none';
        }

        const WORLD_COUNTRIES_GEOJSON_URL = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';
        fetch(WORLD_COUNTRIES_GEOJSON_URL, { mode: 'cors' })
            .then(function(res) { return res.json(); })
            .then(function(geojson) {
                const bordersLayer = L.geoJSON(geojson, {
                    pane: paneName,
                    style: function() {
                        return {
                            color: '#888888',
                            weight: 0.5,
                            opacity: 0.8,
                            fill: false
                        };
                    }
                });
                bordersLayer.addTo(mapInstance);
            })
            .catch(function(err) {
                console.warn('Country borders overlay failed to load:', err);
            });
    } catch (e) {
        console.warn('addCountryBorders error:', e);
    }
}

// Add current user to the map
// Add pins for all real voters who have participated in polls
function updateVoterMap() {
    if (!userMap) return;
    
    // Clear existing markers
    userMarkers.forEach(marker => userMap.removeLayer(marker));
    userMarkers = [];
    
    // Get all poll responses to find real voters
    const pollResponses = JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]');
    
    if (pollResponses.length === 0) {
        // No voters yet, just return without showing any message
        return;
    }
    
    // Group responses by session ID to get unique voters
    const uniqueVoters = new Map();
    pollResponses.forEach(response => {
        if (!uniqueVoters.has(response.sessionId)) {
            uniqueVoters.set(response.sessionId, {
                country: response.userCountry,
                sessionId: response.sessionId,
                firstVote: response.timestamp,
                voteCount: 1
            });
        } else {
            uniqueVoters.get(response.sessionId).voteCount++;
        }
    });
    
    // Add a pin for each unique voter
    uniqueVoters.forEach((voter, sessionId) => {
        const coords = getCountryCoordinates(voter.country);
        if (coords) {
            const pinIcon = L.divIcon({
                className: 'voter-pin-marker',
                html: `
                    <div style="
                        width: 20px;
                        height: 20px;
                        position: relative;
                        transform: translateY(-10px);
                    ">
                        <!-- Pin head -->
                        <div style="
                            width: 16px;
                            height: 16px;
                            background: #dc2626;
                            border: 2px solid #ffffff;
                            border-radius: 50%;
                            position: absolute;
                            top: 0;
                            left: 50%;
                            transform: translateX(-50%);
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        "></div>
                        <!-- Pin point -->
                        <div style="
                            position: absolute;
                            top: 14px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 0;
                            height: 0;
                            border-left: 3px solid transparent;
                            border-right: 3px solid transparent;
                            border-top: 8px solid #dc2626;
                            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
                        "></div>
                        <!-- Pin shadow -->
                        <div style="
                            position: absolute;
                            top: 18px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 6px;
                            height: 2px;
                            background: rgba(0,0,0,0.2);
                            border-radius: 50%;
                        "></div>
                    </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 20]
            });
            
            const voterMarker = L.marker(coords, { icon: pinIcon }).addTo(userMap);
            
            // Add popup with voter info
            const voteDate = new Date(voter.firstVote).toLocaleDateString();
            voterMarker.bindPopup(`
                <div style="text-align: center; font-family: 'Inter', sans-serif; min-width: 200px;">
                    <h3 style="margin: 0 0 10px 0; color: #dc2626; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        🗳️ Voter
                    </h3>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.9em; font-weight: 600;">
                        ${voter.country}
            </p>
            <p style="margin: 5px 0 0 0; color: var(--text-secondary); font-size: 0.8em;">
                        Votes: ${voter.voteCount}
                    </p>
                    <p style="margin: 5px 0 0 0; color: var(--primary-color); font-size: 0.8em; font-weight: 600;">
                        First vote: ${voteDate}
            </p>
        </div>
    `);
    
            userMarkers.push(voterMarker);
        }
    });
}

// -------- Global (Sheet-backed) stats and map --------
const STATS_URL = (window.WEBHOOK_CONFIG && window.WEBHOOK_CONFIG.webhookUrl)
  ? window.WEBHOOK_CONFIG.webhookUrl + '?stats=1'
  : null;

async function fetchGlobalStats() {
  if (!STATS_URL) {
    console.log('No STATS_URL configured');
    return;
  }
  
  console.log('Fetching global stats from:', STATS_URL);
  
  try {
    const res = await fetch(STATS_URL, { mode: 'cors' });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Global stats response:', data);

    // Update counters
    const totals = data.totals || { visitors: 0, countries: 0, pollsCompleted: 0 };
    liveStats.visitors = totals.visitors || 0;
    liveStats.countries = new Set();
    if (totals.countries && Number.isFinite(totals.countries)) {
      // display only; set used to compute size
      for (let i = 0; i < totals.countries; i++) liveStats.countries.add(i);
    }
    liveStats.pollsCompleted = totals.pollsCompleted || 0;
    liveStats.globalStatsLoaded = true;
    
    console.log('Updated liveStats:', {
      visitors: liveStats.visitors,
      countries: liveStats.countries.size,
      pollsCompleted: liveStats.pollsCompleted,
      globalStatsLoaded: liveStats.globalStatsLoaded
    });
    
    updateStatsDisplay();

    // Rebuild map from global voters
    const voters = Array.isArray(data.voters) ? data.voters : [];
    console.log('Updating map with', voters.length, 'voters');
    updateVoterMapFromGlobal(voters);
    
  } catch (e) {
    console.error('Failed to fetch global stats:', e);
    console.log('Falling back to local data...');
    
    // Only fallback to local data if global stats were never loaded
    if (!liveStats.globalStatsLoaded) {
      trackVisitor();
      updateStatsDisplay();
      updateVoterMap();
    }
  }
}

function updateVoterMapFromGlobal(voters) {
  if (!userMap) return;
  if (userMarkersLayer) userMap.removeLayer(userMarkersLayer);
  userMarkersLayer = L.layerGroup().addTo(userMap);

  if (!voters.length) return;

  voters.forEach(v => {
    if (v.latitude && v.longitude) {
      const marker = L.marker([v.latitude, v.longitude]);
      marker.bindPopup(
        `<strong>${v.country || 'Unknown'}</strong><br>` +
        `${v.state || ''} ${v.city || ''}<br>` +
        `First vote: ${v.firstVoteAt ? new Date(v.firstVoteAt).toLocaleString() : 'n/a'}`
      );
      marker.addTo(userMarkersLayer);
    }
  });
}

function startGlobalRefresh() {
  fetchGlobalStats();
  setInterval(fetchGlobalStats, 15000);
  
  // Add manual refresh button for debugging
  addGlobalStatsDebugButton();
}

function addGlobalStatsDebugButton() {
  // Only add in development/local environment
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
    const debugBtn = document.createElement('button');
    debugBtn.textContent = '🔄 Refresh Global Stats';
    debugBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff6600;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      z-index: 2000;
      opacity: 0.8;
    `;
    debugBtn.onclick = () => {
      console.log('Manual global stats refresh triggered');
      fetchGlobalStats();
    };
    document.body.appendChild(debugBtn);
  }
}


// Get coordinates for detected country
function getCountryCoordinates(country) {
    const countryCoords = {
        'Nepal': [27.7172, 85.3240], // Kathmandu coordinates for more accuracy
        'United States': [39.8283, -98.5795],
        'United Kingdom': [55.3781, -3.4360],
        'Germany': [51.1657, 10.4515],
        'Japan': [36.2048, 138.2529],
        'Australia': [-25.2744, 133.7751],
        'Brazil': [-14.2350, -51.9253],
        'India': [20.5937, 78.9629],
        'Canada': [56.1304, -106.3468],
        'South Africa': [-30.5595, 22.9375],
        'France': [46.2276, 2.2137],
        'Italy': [41.8719, 12.5674],
        'Spain': [40.4637, -3.7492],
        'Netherlands': [52.1326, 5.2913],
        'Sweden': [60.1282, 18.6435],
        'Norway': [60.4720, 8.4689],
        'Denmark': [56.2639, 9.5018],
        'Finland': [61.9241, 25.7482],
        'Poland': [51.9194, 19.1451],
        'Czech Republic': [49.8175, 15.4730],
        'Hungary': [47.1625, 19.5033],
        'Romania': [45.9432, 24.9668],
        'Bulgaria': [42.7339, 25.4858],
        'Greece': [39.0742, 21.8243],
        'Turkey': [38.9637, 35.2433],
        'Russia': [61.5240, 105.3188],
        'China': [35.8617, 104.1954],
        'South Korea': [35.9078, 127.7669],
        'Thailand': [15.8700, 100.9925],
        'Singapore': [1.3521, 103.8198],
        'Malaysia': [4.2105, 101.9758],
        'Indonesia': [-0.7893, 113.9213],
        'Philippines': [12.8797, 121.7740],
        'Vietnam': [14.0583, 108.2772],
        'Taiwan': [23.6978, 120.9605],
        'Hong Kong': [22.3193, 114.1694],
        'New Zealand': [-40.9006, 174.8860],
        'Mexico': [23.6345, -102.5528],
        'Argentina': [-38.4161, -63.6167],
        'Chile': [-35.6751, -71.5430],
        'Colombia': [4.5709, -74.2973],
        'Peru': [-9.1900, -75.0152],
        'Venezuela': [6.4238, -66.5897]
    };
    
    return countryCoords[country] || [28.3949, 84.1240]; // Default to Nepal
}

// Get current location (simulated - in real app, use browser geolocation)
function getCurrentLocation() {
    // For demo purposes, we'll simulate being in Nepal
    // In a real application, you would use:
    // navigator.geolocation.getCurrentPosition()
    return {
        name: 'Nepal',
        lat: 28.3949,
        lng: 84.1240
    };
}

// Get different colors for markers
function getMarkerColor(index) {
    const colors = [
        '#00ff88', // Primary green
        '#0088ff', // Secondary blue
        '#ff0088', // Accent pink
        '#ffaa00', // Orange
        '#aa00ff', // Purple
        '#00aaff', // Light blue
        '#ff6600', // Red orange
        '#66ff00', // Lime green
        '#ff0066', // Hot pink
        '#0066ff'  // Royal blue
    ];
    return colors[index % colors.length];
}

// Show location information
function showLocationInfo(location, users = null, polls = null) {
    const modal = document.createElement('div');
    modal.className = 'location-modal';
    
    // Use provided data or generate random if not provided
    const userCount = users || Math.floor(Math.random() * 500) + 100;
    const pollCount = polls || Math.floor(Math.random() * 1000) + 200;
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${location}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="location-stats">
                    <div class="stat">
                        <span class="stat-value">${userCount}</span>
                        <span class="stat-label">Active Users</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${pollCount}</span>
                        <span class="stat-label">Polls Completed</span>
                    </div>
                </div>
                <p>Join the conversation from ${location} and make your voice heard!</p>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="this.closest('.location-modal').remove()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.remove());
}

// Show tooltip
function showTooltip(element, location) {
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    tooltip.textContent = location;
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'var(--surface-dark)';
    tooltip.style.color = 'var(--text-primary)';
    tooltip.style.padding = '0.5rem 1rem';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '0.875rem';
    tooltip.style.border = '1px solid var(--border-color)';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.querySelector('.map-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Animate statistics
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent.replace(/\D/g, ''));
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            
            // Format number with commas
            stat.textContent = Math.floor(currentValue).toLocaleString();
        }, 50);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations and effects
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.gallery-item, .feature-item, .contact-link');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .gallery-item, .feature-item, .contact-link {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .gallery-item.animate-in, .feature-item.animate-in, .contact-link.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Show item details modal/overlay
function showItemDetails(item) {
    const title = item.querySelector('.item-title').textContent;
    const description = item.querySelector('.item-description').textContent;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'item-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${description}</p>
                <div class="modal-actions">
                    <button class="btn-primary">Learn More</button>
                    <button class="btn-secondary">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .item-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
        }
        
        .modal-content {
            position: relative;
            background: var(--surface-dark);
            border-radius: 20px;
            max-width: 500px;
            width: 100%;
            border: 1px solid var(--border-color);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
            color: var(--text-primary);
            font-size: 1.5rem;
            font-weight: 700;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 2rem;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: var(--primary-color);
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .modal-body p {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .btn-primary, .btn-secondary {
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
        }
        
        .btn-primary {
            background: var(--gradient-primary);
            color: var(--background-dark);
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-glow);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--text-primary);
            border: 2px solid var(--border-color);
        }
        
        .btn-secondary:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
        }
    `;
    
    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        modal.style.animation = 'modalSlideOut 0.3s ease forwards';
        setTimeout(() => {
            modal.remove();
            modalStyles.remove();
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.btn-secondary').addEventListener('click', closeModal);
    
    // Add slide out animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes modalSlideOut {
            from {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            to {
                opacity: 0;
                transform: scale(0.8) translateY(20px);
            }
        }
    `;
    document.head.appendChild(slideOutStyle);
}

// Add mobile menu styles
const mobileMenuStyles = document.createElement('style');
mobileMenuStyles.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--background-dark);
            border-top: 1px solid var(--border-color);
            flex-direction: column;
            padding: 2rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(mobileMenuStyles);

// Poll Data Storage System (duplicate removed - already declared above)

// Poll Data Management Functions
async function savePollResponse(pollId, response, question, category) {
    const userLocation = await detectLocation();
    const responseData = {
        pollId: pollId,
        response: response,
        question: question,
        category: category,
        timestamp: new Date().toISOString(),
        sessionId: liveStats.sessionId,
        userCountry: userLocation.country,
        userState: userLocation.state,
        userCity: userLocation.city,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        timezone: userLocation.timezone,
        ip: userLocation.ip,
        countryCode: userLocation.countryCode,
        regionCode: userLocation.regionCode,
        userAgent: navigator.userAgent,
        language: navigator.language
    };
    
    // Save to local storage
    const existingData = JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]');
    existingData.push(responseData);
    localStorage.setItem('hamroawaz_poll_responses', JSON.stringify(existingData));
    
    // Save to pollData object
    if (!pollData.responses[pollId]) {
        pollData.responses[pollId] = [];
    }
    pollData.responses[pollId].push(responseData);
    
    // Update statistics
    liveStats.responses++;
    liveStats.pollsCompleted++;
    saveStats();
    updateStatsDisplay();
    
    // Log to console for debugging
    console.log('Poll response saved:', responseData);
    
    // Try to send to server (if available)
    sendToServer(responseData);
}

async function saveDemographicData(ageGroup, residence, affiliation) {
    const demographicData = {
        ageGroup: ageGroup,
        residence: residence,
        affiliation: affiliation,
        timestamp: new Date().toISOString(),
        sessionId: liveStats.sessionId,
        userCountry: await detectCountry()
    };
    
    // Save to local storage
    const existingData = JSON.parse(localStorage.getItem('hamroawaz_demographics') || '[]');
    existingData.push(demographicData);
    localStorage.setItem('hamroawaz_demographics', JSON.stringify(existingData));
    
    // Save to pollData object
    pollData.demographics = demographicData;
    
    console.log('Demographic data saved:', demographicData);
    
    // Try to send to server
    sendToServer(demographicData, 'demographics');
}

function sendToServer(data, type = 'poll') {
    console.log('sendToServer called with:', data, 'type:', type);
    
    // This function will attempt to send data to multiple endpoints
    
    // 1. Try GitHub Issues API (if configured)
    if (window.GITHUB_CONFIG) {
        console.log('GitHub config found, sending to GitHub...');
        sendToGitHub(data, type);
    } else {
        console.log('No GitHub config found');
    }
    
    // 2. Try Google Sheets (if configured)
    if (window.GOOGLE_SHEETS_CONFIG) {
        console.log('Google Sheets config found, sending to Google Sheets...');
        sendToGoogleSheets(data, type);
    } else {
        console.log('No Google Sheets config found');
    }
    
    // 3. Try webhook (if configured)
    if (window.WEBHOOK_CONFIG) {
        console.log('Webhook config found, sending to webhook...');
        sendToWebhook(data, type);
    } else {
        console.log('No webhook config found');
    }
    
    // 4. Try local server endpoint (optional - only if server is available)
    // Note: This is optional since we're using webhook for data collection
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Only try local server on localhost
        const endpoint = type === 'demographics' ? '/api/demographics' : '/api/poll-responses';
        
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                console.log('Data also sent to local server successfully');
                return response.json();
            }
            // Don't throw error for 501 - just log it
            console.log('Local server not configured (this is normal)');
        })
        .catch(error => {
            // Silently handle local server errors - webhook is the main method
            console.log('Local server not available (using webhook instead)');
        });
    }
        
        // Always update local export regardless of server status
        updateDataExport();
}

// GitHub Issues API integration
async function sendToGitHub(data, type) {
    if (!window.GITHUB_CONFIG) return;
    
    try {
        const { repoOwner, repoName, githubToken } = window.GITHUB_CONFIG;
        const collector = new GitHubPollCollector(repoOwner, repoName, githubToken);
        await collector.submitPollResponse(data);
    } catch (error) {
        console.log('GitHub submission failed:', error);
    }
}

// Google Sheets integration
async function sendToGoogleSheets(data, type) {
    if (!window.GOOGLE_SHEETS_CONFIG) return;
    
    try {
        const { sheetId, apiKey } = window.GOOGLE_SHEETS_CONFIG;
        const collector = new GoogleSheetsCollector(sheetId, apiKey);
        await collector.submitPollResponse(data);
    } catch (error) {
        console.log('Google Sheets submission failed:', error);
    }
}

// Webhook integration with CORS handling
async function sendToWebhook(data, type) {
    if (!window.WEBHOOK_CONFIG) {
        console.log('No webhook config found');
        return;
    }
    
    try {
        const { webhookUrl, options } = window.WEBHOOK_CONFIG;
        console.log('Sending data to webhook:', webhookUrl);
        console.log('Data being sent:', data);
        
        // Try with no-cors mode to bypass CORS issues
        const response = await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors', // This bypasses CORS restrictions
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // With no-cors mode, we can't read the response, but we assume success
        console.log('✅ Poll data sent to webhook (no-cors mode)');
        
    } catch (error) {
        console.log('❌ Webhook submission failed:', error);
        
        // Fallback: Try form submission method
        try {
            console.log('Trying form submission fallback...');
            await submitViaForm(data, webhookUrl);
            console.log('✅ Form submission successful');
        } catch (formError) {
            console.log('❌ Form submission also failed:', formError);
        }
    }
}

// Fallback method using form submission (CORS-free)
async function submitViaForm(data, webhookUrl) {
    return new Promise((resolve, reject) => {
        // Create a form and submit it (this bypasses CORS)
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = webhookUrl;
        form.target = '_blank'; // Open in new tab to avoid navigation
        form.style.display = 'none';

        // Add the data as a hidden input
        const dataInput = document.createElement('input');
        dataInput.type = 'hidden';
        dataInput.name = 'data';
        dataInput.value = JSON.stringify(data);
        form.appendChild(dataInput);

        // Add form to page, submit, then remove
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        // Assume success after a short delay
        setTimeout(() => {
            console.log('Poll data sent via form submission');
            resolve({ success: true });
        }, 1000);
    });
}

function updateDataExport() {
    // Create a downloadable JSON file with all poll data
    const allData = {
        pollResponses: JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]'),
        demographics: JSON.parse(localStorage.getItem('hamroawaz_demographics') || '[]'),
        liveStats: {
            visitors: liveStats.visitors,
            countries: Array.from(liveStats.countries),
            pollsCompleted: liveStats.pollsCompleted,
            responses: liveStats.responses,
            sessionId: liveStats.sessionId
        },
        exportTimestamp: new Date().toISOString(),
        totalResponses: JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]').length
    };
    
    // Store the complete dataset
    localStorage.setItem('hamroawaz_complete_data', JSON.stringify(allData));
    
    // Create download link (hidden)
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    // Update or create download link
    let downloadLink = document.getElementById('data-download-link');
    if (!downloadLink) {
        downloadLink = document.createElement('a');
        downloadLink.id = 'data-download-link';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
    }
    
    downloadLink.href = url;
    downloadLink.download = `hamroawaz_poll_data_${new Date().toISOString().split('T')[0]}.json`;
}

function exportPollData() {
    // Function to manually export all poll data
    const allData = JSON.parse(localStorage.getItem('hamroawaz_complete_data') || '{}');
    
    if (Object.keys(allData).length === 0) {
        alert('No poll data available to export.');
        return;
    }
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hamroawaz_poll_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Poll data exported successfully');
}

function getPollStatistics() {
    // Function to get comprehensive poll statistics
    const responses = JSON.parse(localStorage.getItem('hamroawaz_poll_responses') || '[]');
    const demographics = JSON.parse(localStorage.getItem('hamroawaz_demographics') || '[]');
    
    const stats = {
        totalResponses: responses.length,
        totalDemographics: demographics.length,
        pollsByCategory: {},
        responsesByCountry: {},
        responsesByAge: {},
        responsesByAffiliation: {},
        responsesByResidence: {},
        mostPopularResponses: {},
        responseTimeline: []
    };
    
    // Analyze responses by category
    responses.forEach(response => {
        if (!stats.pollsByCategory[response.category]) {
            stats.pollsByCategory[response.category] = 0;
        }
        stats.pollsByCategory[response.category]++;
        
        // By country
        if (!stats.responsesByCountry[response.userCountry]) {
            stats.responsesByCountry[response.userCountry] = 0;
        }
        stats.responsesByCountry[response.userCountry]++;
        
        // Timeline
        const date = response.timestamp.split('T')[0];
        if (!stats.responseTimeline.find(item => item.date === date)) {
            stats.responseTimeline.push({date: date, count: 0});
        }
        stats.responseTimeline.find(item => item.date === date).count++;
    });
    
    // Analyze demographics
    demographics.forEach(demo => {
        if (!stats.responsesByAge[demo.ageGroup]) {
            stats.responsesByAge[demo.ageGroup] = 0;
        }
        stats.responsesByAge[demo.ageGroup]++;
        
        if (!stats.responsesByAffiliation[demo.affiliation]) {
            stats.responsesByAffiliation[demo.affiliation] = 0;
        }
        stats.responsesByAffiliation[demo.affiliation]++;
        
        if (!stats.responsesByResidence[demo.residence]) {
            stats.responsesByResidence[demo.residence] = 0;
        }
        stats.responsesByResidence[demo.residence]++;
    });
    
    return stats;
}




// Initialize data export system when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize data export system
    setTimeout(() => {
        updateDataExport();
        addDataExportButton();
        addGoToTopButton();
    }, 1000);
});


function addGoToTopButton() {
    // Add Go to Top button at the bottom right of the page
    const goToTopButton = document.createElement('button');
    goToTopButton.id = 'go-to-top-btn';
    goToTopButton.innerHTML = '↑ Top';
    goToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--gradient-secondary);
        color: var(--text-primary);
        border: none;
        padding: 12px 20px;
        border-radius: 50px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 136, 255, 0.3);
        transition: all 0.3s ease;
        opacity: 0.8;
    `;
    
    // Add hover effects
    goToTopButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(0, 136, 255, 0.4)';
        this.style.opacity = '1';
    });
    
    goToTopButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(0, 136, 255, 0.3)';
        this.style.opacity = '0.8';
    });
    
    // Add click functionality
    goToTopButton.onclick = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    goToTopButton.title = 'Go to top of page';
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            goToTopButton.style.display = 'block';
        } else {
            goToTopButton.style.display = 'none';
        }
    });
    
    // Initially hide the button
    goToTopButton.style.display = 'none';
    
    document.body.appendChild(goToTopButton);
}

function addDataExportButton() {
    // Add a hidden export button for data management
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Poll Data';
    exportButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: var(--text-primary);
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
        z-index: 1000;
        opacity: 0.7;
    `;
    
    exportButton.onclick = exportPollData;
    exportButton.title = 'Export all poll data as JSON file';
    
    // Only show for admin (you can modify this condition)
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        document.body.appendChild(exportButton);
    }
}

