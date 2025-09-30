// Hamro Awaz - Interactive Data Visualization
// This script handles all the interactive features for the data visualization page

// Global variables
let allData = [];
let filteredData = [];
let charts = {};
let voterMap = null;
let pollQuestions = {};

// Chart.js configuration
Chart.defaults.color = '#b0b0b0';
Chart.defaults.borderColor = '#333333';
Chart.defaults.backgroundColor = 'rgba(0, 255, 136, 0.1)';

// Color palette for charts
const chartColors = [
    '#00ff88', '#0088ff', '#ff0088', '#ffaa00', '#aa00ff',
    '#00aaff', '#ff6600', '#66ff00', '#ff0066', '#0066ff',
    '#88ff00', '#ff8800', '#0088aa', '#aa0088', '#88aa00'
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing data visualization...');
    
    // Load poll questions from the configuration
    loadPollQuestions();
    
    // Load data from Google Sheets
    loadDataFromGoogleSheets();
    
    // Initialize the map
    initializeMap();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize charts with loading state
    initializeCharts();
});

// Load poll questions from the polls configuration
function loadPollQuestions() {
    // This would normally fetch from polls-config.md, but for now we'll use the data we know
    pollQuestions = {
        'poll1': {
            question: 'How satisfied are you with the handling of the September 2025 youth-led protests by the former government under PM K.P. Sharma Oli?',
            category: 'Political Crisis',
            options: [
                'Very satisfied – The response was proportionate and necessary for order.',
                'Somewhat satisfied – It restored stability, but violence was excessive.',
                'Somewhat dissatisfied – The crackdown was too harsh and ignored root causes like economic despair.',
                'Very dissatisfied – It was a brutal suppression of legitimate demands, eroding democracy.'
            ]
        },
        'poll2': {
            question: 'What do you believe was the primary trigger for the recent political crisis in Nepal?',
            category: 'Root Causes',
            options: [
                'The social media ban and restrictions on free speech/digital rights.',
                'Youth unemployment, economic inequality, and lack of opportunities.',
                'Corruption, nepotism, and elite capture of public resources.',
                'A combination of all the above, amplified by global influences like Bangladesh\'s uprising.'
            ]
        },
        'poll3': {
            question: 'On a scale of 1-5, how would you rate Nepal\'s overall political stability since the 2015 federal constitution?',
            category: 'Stability Assessment',
            options: [
                '1 – Endless cycles of coalition collapses and street protests.',
                '2 – Frequent crises with short-lived governments.',
                '3 – Moderately stable federally, but centralized power breeds unrest.',
                '4 – Improving through devolution, but implementation lags.',
                '5 – Robust institutions ensuring continuity.'
            ]
        },
        'poll4': {
            question: 'To what extent has the youth-led "Gen Z movement" influenced your views on Nepal\'s political future?',
            category: 'Youth Movement',
            options: [
                'Significantly – It\'s a wake-up call for radical change.',
                'Moderately – Inspiring, but needs structured channels.',
                'Slightly – Symbolic, but elites will dilute it.',
                'Not at all – Protests often lead to more of the same.'
            ]
        },
        'poll5': {
            question: 'What should be the top priority for the interim government over the next 6 months, aside from fulfilling the election mandate?',
            category: 'Interim Government',
            options: [
                'Transparent investigations and prosecutions for protest-related deaths and police excesses.',
                'Emergency economic relief, including youth stipends and job guarantees.',
                'Lifting digital bans and enacting a Digital Rights Act.',
                'Rebuilding damaged infrastructure with community involvement.',
                'Constitutional amendments for electoral reforms.'
            ]
        },
        'poll6': {
            question: 'How effective do you think the appointment of a former Supreme Court Chief Justice as interim PM will be in addressing the crisis?',
            category: 'Interim Government',
            options: [
                'Very effective – Judicial neutrality can bridge divides and enforce accountability.',
                'Somewhat effective – A credible stopgap, but lacks political mandate for bold changes.',
                'Neutral – Procedural fix; real power lies with parties behind the scenes.',
                'Somewhat ineffective – Risks being a puppet for old guard influences.',
                'Very ineffective – Demands a fully apolitical, youth-inclusive panel.'
            ]
        },
        'poll7': {
            question: 'Are you satisfied with how the current government is forming and working?',
            category: 'Governance',
            options: [
                'Yes, I am satisfied.',
                'Somewhat satisfied, but major improvements are needed.',
                'No, I am dissatisfied.',
                'Too early to judge.'
            ]
        },
        'poll8': {
            question: 'Should Nepal shift to a directly elected Prime Minister or President (instead of parliamentary selection) to strengthen accountability?',
            category: 'Electoral Reform',
            options: [
                'Strongly support – Direct mandate reduces coalition horse-trading.',
                'Somewhat support – If combined with proportional representation for Parliament.',
                'Neutral – Could work, but risks populism without checks.',
                'Somewhat oppose – Parliamentary system better suits Nepal\'s diversity.',
                'Strongly oppose – Maintains instability; focus on intra-party democracy first.'
            ]
        },
        'poll9': {
            question: 'If implementing direct elections for the executive, which option would you prefer?',
            category: 'Electoral System',
            options: [
                'Directly elected President.',
                'Ceremonial President as head and directly elected Prime Minister.',
                'King as ceremonial head and directly elected Prime Minister.',
                'Other form of directly elected executive head.',
                'Current system is the best for Nepal, there should not be directly elected executive head.'
            ]
        },
        'poll10': {
            question: 'If implementing direct elections for the executive, what system would you prefer?',
            category: 'Electoral System',
            options: [
                'Two-round runoff (if no candidate gets a majority (>50%), the top two candidates compete in a second vote).',
                'First-past-the-post for simplicity and decisiveness (The candidate with the most votes wins, even if its not a majority).',
                'Ranked-choice voting to ensure broader consensus (voters rank candidates in order of preference).',
                'None of the above.'
            ]
        },
        'poll11': {
            question: 'What reform would you prioritize to make the 2026 elections more trustworthy?',
            category: 'Electoral Reform',
            options: [
                'Fully independent election commission with civil society veto power.',
                'Digital voting access for 2+ million diaspora Nepalese.',
                'Caps on campaign spending (e.g., 50 million NPR per candidate).',
                '30% youth quota for parliamentary seats.',
                'Current system serves best, no changes needed.'
            ]
        },
        'poll12': {
            question: 'Should term limits be imposed on the Prime Minister/President to prevent power concentration?',
            category: 'Electoral Reform',
            options: [
                'Yes – Maximum two consecutive 5-year terms.',
                'Yes – One term only (5 years) for fresh blood.',
                'No – Voters should decide; limits could deter experienced leaders.',
                'Conditional – Two terms, but with recall mechanisms via referendum.'
            ]
        },
        'poll13': {
            question: 'Should Nepal retain its federal system (7 provinces) or revert to a unitary state?',
            category: 'Electoral Reform',
            options: [
                'Retain and strengthen – Empowers marginalized regions and reduces central corruption.',
                'Retain but reform – Merge underperforming provinces for efficiency.',
                'Partially remove – Keep federal for fiscal powers, unitary for security/foreign affairs.',
                'Fully remove – Unitary government streamlines decisions and cuts bureaucracy.'
            ]
        },
        'poll14': {
            question: 'What is the most effective way to reduce political corruption in Nepal?',
            category: 'Anti-Corruption',
            options: [
                'Mandatory public asset disclosures and auditing.',
                'Strong whistleblower laws with rewards (e.g., 10% of recovered funds).',
                'Citizen juries to review high-profile cases publicly.',
                'All of the above'
            ]
        },
        'poll15': {
            question: 'How can youth be better integrated into leadership roles?',
            category: 'Youth Leadership',
            options: [
                'Lower voting/candidacy age to 16/18 with civic education mandates.',
                'Cap the upper age limit for leadership positions to the official retirement age for the executive head.',
                'National Youth Parliament with advisory veto on bills (create a youth-specific parliamentary body that debates policies).',
                'Digital platforms for crowdsourcing youth policy inputs.',
                'I am not sure, but needs to be done.'
            ]
        },
        'poll16': {
            question: 'Where do you currently reside?',
            category: 'Demographics',
            options: [
                'Nepal – Urban (in any metropolitan city).',
                'Nepal – Rural (not in metropolitan city)',
                'Diaspora – India and China (border states).',
                'Diaspora – Gulf/Middle East.',
                'Diaspora – West (US/Europe/Australia).',
                'Diaspora - Other (Other parts of the world).'
            ]
        },
        'poll17': {
            question: 'What is your age group?',
            category: 'Demographics',
            options: [
                'below 18.',
                '18-24.',
                '25-34.',
                '35-49.',
                '50+ .'
            ]
        },
        'poll18': {
            question: 'What is your political affiliation (if any)?',
            category: 'Demographics',
            options: [
                'Nepali Congress.',
                'UML.',
                'Maoist.',
                'Other political party.',
                'Independent/No party.'
            ]
        }
    };
    
    // Poll selector removed - all charts will be displayed simultaneously
    
    // Populate category filter
    const categoryFilter = document.getElementById('category-filter');
    const categories = [...new Set(Object.values(pollQuestions).map(p => p.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Load data from Google Sheets via the Apps Script webhook
async function loadDataFromGoogleSheets() {
    try {
        console.log('Loading data from Google Sheets...');
        
        // Use the webhook URL from config.js
        const webhookUrl = window.WEBHOOK_CONFIG.webhookUrl;
        const dataUrl = webhookUrl + '?rawdata=1';
        
        const response = await fetch(dataUrl, {
            method: 'GET',
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Data loaded from Google Sheets:', data);
        
        // Process the data - handle both array format and object format
        if (data) {
            if (Array.isArray(data) && data.length > 0) {
                // Data is already in array format
                allData = data;
            } else if (data.totals && data.voters) {
                // Data is in the stats format from the webhook
                console.log('Received stats data, but need raw response data. Please check webhook configuration.');
                allData = [];
            } else {
                console.log('Unexpected data format from Google Sheets');
                allData = [];
            }
            
            filteredData = [...allData];
            
            // Update header stats
            updateHeaderStats();
            
            // Populate country filter
            populateCountryFilter();
            
            // Update all charts
            updateAllCharts();
            
            // Update map
            updateVoterMap();
            
            console.log(`Loaded ${allData.length} real responses from Google Sheets`);
        } else {
            console.log('No data available yet. Please check your Google Sheets connection.');
            // Don't load sample data - only show real data
            allData = [];
            filteredData = [];
            updateHeaderStats();
            updateAllCharts();
            updateVoterMap();
        }
        
    } catch (error) {
        console.error('Failed to load data from Google Sheets:', error);
        console.log('Please check your Google Sheets connection and webhook URL.');
        // Don't load sample data - only show real data
        allData = [];
        filteredData = [];
        updateHeaderStats();
        updateAllCharts();
        updateVoterMap();
    }
}

// Note: Sample data generation removed - only real data from Google Sheets is used

// Update header statistics
function updateHeaderStats() {
    const totalResponses = filteredData.length;
    const uniqueCountries = new Set(filteredData.map(d => d.userCountry)).size;
    
    document.getElementById('total-responses').textContent = totalResponses.toLocaleString();
    document.getElementById('total-countries').textContent = uniqueCountries;
}

// Populate country filter dropdown
function populateCountryFilter() {
    const countryFilter = document.getElementById('country-filter');
    const countries = [...new Set(filteredData.map(d => d.userCountry))].sort();
    
    // Clear existing options except "All Countries"
    while (countryFilter.children.length > 1) {
        countryFilter.removeChild(countryFilter.lastChild);
    }
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

// Initialize the map
function initializeMap() {
    voterMap = L.map('voter-map', {
        center: [28.3949, 84.1240], // Center on Nepal
        zoom: 4,
        minZoom: 2,
        maxZoom: 18
    });
    
    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18
    }).addTo(voterMap);
}

// Update voter map with current data
function updateVoterMap() {
    if (!voterMap) return;
    
    // Clear existing markers
    voterMap.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            voterMap.removeLayer(layer);
        }
    });
    
    // Group data by country
    const countryData = {};
    filteredData.forEach(d => {
        if (!countryData[d.userCountry]) {
            countryData[d.userCountry] = 0;
        }
        countryData[d.userCountry]++;
    });
    
    // Add markers for each country
    Object.entries(countryData).forEach(([country, count]) => {
        const coords = getCountryCoordinates(country);
        if (coords) {
            const marker = L.marker(coords).addTo(voterMap);
            marker.bindPopup(`
                <div style="text-align: center; font-family: 'Inter', sans-serif; min-width: 150px;">
                    <h3 style="margin: 0 0 10px 0; color: #00ff88;">${country}</h3>
                    <p style="margin: 0; color: #b0b0b0; font-size: 0.9em;">
                        ${count} responses
                    </p>
                </div>
            `);
        }
    });
}

// Get coordinates for countries
function getCountryCoordinates(country) {
    const countryCoords = {
        'Nepal': [28.3949, 84.1240],
        'United States': [39.8283, -98.5795],
        'United Kingdom': [55.3781, -3.4360],
        'India': [20.5937, 78.9629],
        'Australia': [-25.2744, 133.7751],
        'Canada': [56.1304, -106.3468],
        'Germany': [51.1657, 10.4515],
        'Japan': [36.2048, 138.2529],
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
        'Venezuela': [6.4238, -66.5897],
        'Brazil': [-14.2350, -51.9253],
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
        'Russia': [61.5240, 105.3188]
    };
    
    return countryCoords[country] || null;
}

// Initialize all charts
function initializeCharts() {
    // Response Distribution Chart removed
    
    // Geographic Distribution Chart
    charts.geoChart = new Chart(document.getElementById('geoChart'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: chartColors[1],
                borderColor: chartColors[1],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            elements: {
                bar: {
                    borderWidth: 0
                }
            },
            layout: {
                padding: {
                    bottom: 80,
                    left: 10,
                    right: 10
                }
            },
            plugins: {
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: false
                    },
                    ticks: {
                        color: '#b0b0b0',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: '#333333'
                    }
                },
                x: {
                    title: {
                        display: false
                    },
                    ticks: {
                        color: '#b0b0b0',
                        maxRotation: 75,
                        minRotation: 75,
                        font: {
                            size: 12
                        },
                        callback: function(value, index, ticks) {
                            const label = this.getLabelForValue(value);
                            return label;
                        }
                    },
                    grid: {
                        color: '#333333'
                    }
                }
            }
        }
    });
    
    // Age Group Chart
    charts.ageChart = new Chart(document.getElementById('ageChart'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: chartColors[2],
                borderColor: chartColors[2],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            elements: {
                bar: {
                    borderWidth: 0
                }
            },
            layout: {
                padding: {
                    bottom: 80,
                    left: 10,
                    right: 10
                }
            },
            plugins: {
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: false
                    },
                    ticks: {
                        color: '#b0b0b0',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: '#333333'
                    }
                },
                x: {
                    title: {
                        display: false
                    },
                    ticks: {
                        color: '#b0b0b0',
                        maxRotation: 75,
                        minRotation: 75,
                        font: {
                            size: 12
                        },
                        callback: function(value, index, ticks) {
                            const label = this.getLabelForValue(value);
                            return label;
                        }
                    },
                    grid: {
                        color: '#333333'
                    }
                }
            }
        }
    });
    
    // Political Affiliation Chart
    charts.affiliationChart = new Chart(document.getElementById('affiliationChart'), {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: chartColors.slice(3, 8),
                borderColor: '#333333',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            elements: {
                bar: {
                    borderWidth: 0
                }
            }
        }
    });
    
    // Create individual poll charts for all poll questions
    createAllPollCharts();
}

// Create individual poll charts for all poll questions
function createAllPollCharts() {
    const container = document.getElementById('all-poll-charts');
    container.innerHTML = ''; // Clear existing content
    
    Object.keys(pollQuestions).forEach((pollId, index) => {
        const poll = pollQuestions[pollId];
        
        // Create chart container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        chartContainer.innerHTML = `
            <div class="chart-header">
                <h3 class="chart-title">${poll.category}</h3>
            </div>
            <div class="poll-question">
                <div class="poll-question-text">${poll.question}</div>
            </div>
            <div class="chart-wrapper">
                <canvas id="pollChart_${pollId}"></canvas>
            </div>
        `;
        
        container.appendChild(chartContainer);
        
        // Create chart
        const canvas = document.getElementById(`pollChart_${pollId}`);
        charts[`pollChart_${pollId}`] = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: '',
                    data: [],
                    backgroundColor: chartColors[index % chartColors.length],
                    borderColor: chartColors[index % chartColors.length],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                elements: {
                    bar: {
                        borderWidth: 0
                    }
                },
                layout: {
                    padding: {
                        bottom: 120,
                        left: 10,
                        right: 10
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: false
                        },
                        ticks: {
                            color: '#b0b0b0',
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: '#333333'
                        }
                    },
                    x: {
                        title: {
                            display: false
                        },
                        ticks: {
                            color: '#b0b0b0',
                            maxRotation: 75,
                            minRotation: 75,
                            font: {
                                size: 11
                            },
                            callback: function(value, index, ticks) {
                                const label = this.getLabelForValue(value);
                                return createSimpleWrappedText(label, 30);
                            }
                        },
                        grid: {
                            color: '#333333'
                        },
                        afterBuildTicks: function(axis) {
                            // Force all ticks to be displayed
                            axis.ticks = axis.ticks.map((tick, index) => ({
                                ...tick,
                                label: axis.chart.data.labels[index] || ''
                            }));
                        }
                    }
                }
            }
        });
    });
}

// Update all charts with current data
function updateAllCharts() {
    updateGeoChart();
    updateAgeChart();
    updateAffiliationChart();
    updateAllPollCharts();
}

// Update all individual poll charts
function updateAllPollCharts() {
    Object.keys(pollQuestions).forEach(pollId => {
        updateIndividualPollChart(pollId);
    });
}

// Update individual poll chart
function updateIndividualPollChart(pollId) {
    const chartKey = `pollChart_${pollId}`;
    if (!charts[chartKey]) return;
    
    const pollData = filteredData.filter(d => d.pollId === pollId);
    const responseCounts = {};
    
    pollData.forEach(d => {
        responseCounts[d.response] = (responseCounts[d.response] || 0) + 1;
    });
    
    const total = Object.values(responseCounts).reduce((sum, count) => sum + count, 0);
    const labels = Object.keys(responseCounts).map(response => mapResponseToFullOption(pollId, response));
    const data = Object.values(responseCounts).map(count => Math.round((count / total) * 100 * 10) / 10);
    
    charts[chartKey].data.labels = labels;
    charts[chartKey].data.datasets[0].data = data;
    charts[chartKey].data.datasets[0].backgroundColor = chartColors.slice(0, labels.length);
    
    charts[chartKey].update();
}

// Update geographic distribution chart
function updateGeoChart() {
    const countryCounts = {};
    filteredData.forEach(d => {
        countryCounts[d.userCountry] = (countryCounts[d.userCountry] || 0) + 1;
    });
    
    const total = Object.values(countryCounts).reduce((sum, count) => sum + count, 0);
    const sortedCountries = Object.entries(countryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10); // Top 10 countries
    
    const labels = sortedCountries.map(([country]) => country);
    const data = sortedCountries.map(([, count]) => Math.round((count / total) * 100 * 10) / 10); // Convert to percentage
    
    charts.geoChart.data.labels = labels;
    charts.geoChart.data.datasets[0].data = data;
    
    // Tooltip disabled to prevent undefined legends
    
    charts.geoChart.update();
}

// Update age group chart
function updateAgeChart() {
    // Get age data from poll17 (demographics poll)
    const ageData = filteredData.filter(d => d.pollId === 'poll17');
    const ageCounts = {};
    
    ageData.forEach(d => {
        ageCounts[d.response] = (ageCounts[d.response] || 0) + 1;
    });
    
    const total = Object.values(ageCounts).reduce((sum, count) => sum + count, 0);
    const ageOrder = ['below 18', '18-24', '25-34', '35-49', '50+'];
    const labels = ageOrder.filter(age => ageCounts[age]).map(age => mapResponseToFullOption('poll17', age));
    const data = ageOrder.filter(age => ageCounts[age]).map(age => Math.round((ageCounts[age] / total) * 100 * 10) / 10); // Convert to percentage
    
    charts.ageChart.data.labels = labels;
    charts.ageChart.data.datasets[0].data = data;
    
    // Tooltip disabled to prevent undefined legends
    
    charts.ageChart.update();
}

// Update political affiliation chart
function updateAffiliationChart() {
    // Get affiliation data from poll18 (demographics poll)
    const affiliationData = filteredData.filter(d => d.pollId === 'poll18');
    const affiliationCounts = {};
    
    affiliationData.forEach(d => {
        affiliationCounts[d.response] = (affiliationCounts[d.response] || 0) + 1;
    });
    
    const total = Object.values(affiliationCounts).reduce((sum, count) => sum + count, 0);
    const labels = Object.keys(affiliationCounts).map(affiliation => mapResponseToFullOption('poll18', affiliation));
    const data = Object.values(affiliationCounts).map(count => Math.round((count / total) * 100 * 10) / 10); // Convert to percentage
    
    charts.affiliationChart.data.labels = labels;
    charts.affiliationChart.data.datasets[0].data = data;
    charts.affiliationChart.data.datasets[0].backgroundColor = chartColors.slice(3, 3 + labels.length);
    
    // Update chart options to show percentage
    charts.affiliationChart.options.plugins.tooltip = {
        callbacks: {
            label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                const count = Math.round((value / 100) * total);
                return `${label}: ${value}% (${count} responses)`;
            }
        }
    };
    
    charts.affiliationChart.update();
}

// Change chart type
function changeChartType(chartName, type) {
    const chart = charts[chartName];
    if (!chart) return;
    
    // Update button states
    const buttons = document.querySelectorAll(`[onclick*="${chartName}"]`);
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Change chart type
    chart.config.type = type;
    chart.update();
}

// Apply filters
function applyFilters() {
    const countryFilter = document.getElementById('country-filter').value;
    const ageFilter = document.getElementById('age-filter').value;
    const residenceFilter = document.getElementById('residence-filter').value;
    const affiliationFilter = document.getElementById('affiliation-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    const timeFilter = document.getElementById('time-filter').value;
    
    filteredData = allData.filter(d => {
        // Country filter
        if (countryFilter && d.userCountry !== countryFilter) return false;
        
        // Category filter
        if (categoryFilter && d.category !== categoryFilter) return false;
        
        // Time filter
        if (timeFilter) {
            const now = new Date();
            const responseDate = new Date(d.timestamp);
            const diffTime = now - responseDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (timeFilter === 'today' && diffDays > 1) return false;
            if (timeFilter === 'week' && diffDays > 7) return false;
            if (timeFilter === 'month' && diffDays > 30) return false;
        }
        
        // Age filter (requires cross-referencing with poll17 data)
        if (ageFilter) {
            const sessionAgeData = allData.find(d2 => 
                d2.sessionId === d.sessionId && 
                d2.pollId === 'poll17' && 
                d2.response === ageFilter
            );
            if (!sessionAgeData) return false;
        }
        
        // Residence filter (requires cross-referencing with poll16 data)
        if (residenceFilter) {
            const sessionResidenceData = allData.find(d2 => 
                d2.sessionId === d.sessionId && 
                d2.pollId === 'poll16' && 
                d2.response === residenceFilter
            );
            if (!sessionResidenceData) return false;
        }
        
        // Affiliation filter (requires cross-referencing with poll18 data)
        if (affiliationFilter) {
            const sessionAffiliationData = allData.find(d2 => 
                d2.sessionId === d.sessionId && 
                d2.pollId === 'poll18' && 
                d2.response === affiliationFilter
            );
            if (!sessionAffiliationData) return false;
        }
        
        return true;
    });
    
    // Update all visualizations
    updateHeaderStats();
    updateAllCharts();
    updateVoterMap();
    
    console.log(`Applied filters. Showing ${filteredData.length} of ${allData.length} responses.`);
}

// Clear all filters
function clearFilters() {
    document.getElementById('country-filter').value = '';
    document.getElementById('age-filter').value = '';
    document.getElementById('residence-filter').value = '';
    document.getElementById('affiliation-filter').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('time-filter').value = '';
    
    filteredData = [...allData];
    updateHeaderStats();
    updateAllCharts();
    updateVoterMap();
    
    console.log('Cleared all filters.');
}

// Export data
function exportData() {
    const dataToExport = {
        metadata: {
            exportDate: new Date().toISOString(),
            totalResponses: filteredData.length,
            filters: {
                country: document.getElementById('country-filter').value,
                age: document.getElementById('age-filter').value,
                residence: document.getElementById('residence-filter').value,
                affiliation: document.getElementById('affiliation-filter').value,
                category: document.getElementById('category-filter').value,
                time: document.getElementById('time-filter').value
            }
        },
        data: filteredData
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hamroawaz_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Data exported successfully.');
}

// Setup event listeners
function setupEventListeners() {
    // Filter change events
    const filterElements = document.querySelectorAll('.filter-select');
    filterElements.forEach(element => {
        element.addEventListener('change', applyFilters);
    });
}

// Old poll functions removed - replaced with individual chart system

// Unused helper functions removed

// Helper function to create centered wrapped text for x-axis labels
function createSimpleWrappedText(text, maxLength) {
    if (!text) return '';
    
    // Simple word wrapping with centering
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
        if ((currentLine + ' ' + word).length <= maxLength) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }
    
    if (currentLine) lines.push(currentLine);
    
    // Center each line
    const centeredLines = lines.map(line => {
        const padding = Math.floor((maxLength - line.length) / 2);
        return ' '.repeat(padding) + line + ' '.repeat(maxLength - line.length - padding);
    });
    
    return centeredLines.join('\n');
}

// Map abbreviated responses to full questionnaire options
function mapResponseToFullOption(pollId, response) {
    const poll = pollQuestions[pollId];
    if (!poll || !poll.options) return response;
    
    // Create a mapping from abbreviated responses to full options
    const responseMap = {
        'very_satisfied___': 'Very satisfied – The response was proportionate and necessary for order.',
        'somewhat_satisfied__': 'Somewhat satisfied – It restored stability, but violence was excessive.',
        'somewhat_dissatisfie': 'Somewhat dissatisfied – The crackdown was too harsh and ignored root causes like economic despair.',
        'very_dissatisfied___': 'Very dissatisfied – It was a brutal suppression of legitimate demands, eroding democracy.',
        'the_social_media_ba': 'The social media ban and restrictions on free speech/digital rights.',
        'youth_unemployment__': 'Youth unemployment, economic inequality, and lack of opportunities.',
        'corruption__nepotism': 'Corruption, nepotism, and elite capture of public resources.',
        'a_combination_of_all': 'A combination of all the above, amplified by global influences like Bangladesh\'s uprising.',
        '1___endless_cycles_o': '1 – Endless cycles of coalition collapses and street protests.',
        '2___frequent_crises_': '2 – Frequent crises with short-lived governments.',
        '3___moderately_stab': '3 – Moderately stable federally, but centralized power breeds unrest.',
        '4___improving_throu': '4 – Improving through devolution, but implementation lags.',
        '5___robust_instituti': '5 – Robust institutions ensuring continuity.',
        'significantly___it_s': 'Significantly – It\'s a wake-up call for radical change.',
        'moderately___inspiri': 'Moderately – Inspiring, but needs structured channels.',
        'slightly___symbolic_': 'Slightly – Symbolic, but elites will dilute it.',
        'not_at_all___protest': 'Not at all – Protests often lead to more of the same.',
        'transparent_investig': 'Transparent investigations and prosecutions for protest-related deaths and police excesses.',
        'emergency_economic_r': 'Emergency economic relief, including youth stipends and job guarantees.',
        'lifting_digital_ban': 'Lifting digital bans and enacting a Digital Rights Act.',
        'rebuilding_damaged_i': 'Rebuilding damaged infrastructure with community involvement.',
        'constitutional_amend': 'Constitutional amendments for electoral reforms.',
        'very_effective___jud': 'Very effective – Judicial neutrality can bridge divides and enforce accountability.',
        'somewhat_effective__': 'Somewhat effective – A credible stopgap, but lacks political mandate for bold changes.',
        'neutral___procedural': 'Neutral – Procedural fix; real power lies with parties behind the scenes.',
        'somewhat_ineffective': 'Somewhat ineffective – Risks being a puppet for old guard influences.',
        'very_ineffective___d': 'Very ineffective – Demands a fully apolitical, youth-inclusive panel.',
        'yes__i_am_satisfied_': 'Yes, I am satisfied.',
        'somewhat_satisfied__': 'Somewhat satisfied, but major improvements are needed.',
        'no__i_am_dissatisfie': 'No, I am dissatisfied.',
        'too_early_to_judge_': 'Too early to judge.',
        'strongly_support___d': 'Strongly support – Direct mandate reduces coalition horse-trading.',
        'somewhat_support___i': 'Somewhat support – If combined with proportional representation for Parliament.',
        'neutral___could_work': 'Neutral – Could work, but risks populism without checks.',
        'somewhat_oppose___p': 'Somewhat oppose – Parliamentary system better suits Nepal\'s diversity.',
        'strongly_oppose___m': 'Strongly oppose – Maintains instability; focus on intra-party democracy first.',
        'directly_elected_pre': 'Directly elected President.',
        'ceremonial_president': 'Ceremonial President as head and directly elected Prime Minister.',
        'king_as_ceremonial_h': 'King as ceremonial head and directly elected Prime Minister.',
        'other_form_of_direct': 'Other form of directly elected executive head.',
        'current_system_is_th': 'Current system is the best for Nepal, there should not be directly elected executive head.',
        'two_round_runoff__if': 'Two-round runoff (if no candidate gets a majority (>50%), the top two candidates compete in a second vote).',
        'first_past_the_post_': 'First-past-the-post for simplicity and decisiveness (The candidate with the most votes wins, even if its not a majority).',
        'ranked_choice_voting': 'Ranked-choice voting to ensure broader consensus (voters rank candidates in order of preference).',
        'none_of_the_above_': 'None of the above.',
        'fully_independent_el': 'Fully independent election commission with civil society veto power.',
        'digital_voting_acces': 'Digital voting access for 2+ million diaspora Nepalese.',
        'caps_on_campaign_spe': 'Caps on campaign spending (e.g., 50 million NPR per candidate).',
        '30__youth_quota_for_': '30% youth quota for parliamentary seats.',
        'current_system_serve': 'Current system serves best, no changes needed.',
        'yes___maximum_two_co': 'Yes – Maximum two consecutive 5-year terms.',
        'yes___one_term_only_': 'Yes – One term only (5 years) for fresh blood.',
        'no___voters_should_d': 'No – Voters should decide; limits could deter experienced leaders.',
        'conditional___two_te': 'Conditional – Two terms, but with recall mechanisms via referendum.',
        'retain_and_strengthe': 'Retain and strengthen – Empowers marginalized regions and reduces central corruption.',
        'retain_but_reform___': 'Retain but reform – Merge underperforming provinces for efficiency.',
        'partially_remove___k': 'Partially remove – Keep federal for fiscal powers, unitary for security/foreign affairs.',
        'fully_remove___unita': 'Fully remove – Unitary government streamlines decisions and cuts bureaucracy.',
        'mandatory_public_ass': 'Mandatory public asset disclosures and auditing.',
        'strong_whistleblower': 'Strong whistleblower laws with rewards (e.g., 10% of recovered funds).',
        'citizen_juries_to_re': 'Citizen juries to review high-profile cases publicly.',
        'all_of_the_above': 'All of the above',
        'lower_voting_candida': 'Lower voting/candidacy age to 16/18 with civic education mandates.',
        'cap_the_upper_age_li': 'Cap the upper age limit for leadership positions to the official retirement age for the executive head.',
        'national_youth_parli': 'National Youth Parliament with advisory veto on bills (create a youth-specific parliamentary body that debates policies).',
        'digital_platforms_fo': 'Digital platforms for crowdsourcing youth policy inputs.',
        'i_am_not_sure__but_n': 'I am not sure, but needs to be done.',
        'nepal___urban__in_an': 'Nepal – Urban (in any metropolitan city).',
        'nepal___rural__not_i': 'Nepal – Rural (not in metropolitan city)',
        'diaspora___india_and': 'Diaspora – India and China (border states).',
        'diaspora___gulf_midd': 'Diaspora – Gulf/Middle East.',
        'diaspora___west__us_': 'Diaspora – West (US/Europe/Australia).',
        'diaspora___other__ot': 'Diaspora - Other (Other parts of the world).',
        'below_18_': 'Below 18',
        '18_24_': '18-24',
        '25_34_': '25-34',
        '35_49_': '35-49',
        '50___': '50+',
        'nepali_congress_': 'Nepali Congress',
        'uml_': 'UML',
        'maoist_': 'Maoist',
        'other_political_part': 'Other political party',
        'independent_no_party': 'Independent/No party'
    };
    
    return responseMap[response] || response;
}

// Auto-refresh data every 30 seconds
setInterval(() => {
    console.log('Auto-refreshing data...');
    loadDataFromGoogleSheets();
}, 30000);
