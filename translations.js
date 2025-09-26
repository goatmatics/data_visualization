// Hamro Awaz - Translation System
// English and Nepali translations for all content

const translations = {
    en: {
        // Navigation
        nav: {
            polls: "Polls",
            globalUsers: "Global Users", 
            contact: "Contact"
        },
        
        // Hero Section
        hero: {
            welcome: "Welcome to",
            title: "Data Driven Nepal",
            subtitle: "Your Voice Matters in Nepal's Democratic Future",
            description: "From the peaks of Nepal to the world, your voice echoes across mountains and valleys. Join the global conversation and make your opinion heard in our public polling platform.",
            cta: "Start Polling",
            viewMap: "View Global Users"
        },
        
        // Polls Section
        polls: {
            title: "Active Polls",
            description: "Share your opinion on current topics and see how others think",
            submitVote: "Submit Vote",
            thankYou: "Thank you for voting",
            responses: "responses"
        },
        
        // Map Section
        map: {
            title: "Global Voters",
            description: "See where our community members are located worldwide",
            noVoters: "No voters yet",
            beFirst: "Be the first to vote!",
            voter: "Voter",
            votes: "Votes",
            firstVote: "First vote"
        },
        
        // Statistics
        stats: {
            totalVoters: "Total Voters",
            countries: "Countries",
            pollsCompleted: "Polls Completed",
            totalResponses: "Total Responses"
        },
        
        // Contact Section
        contact: {
            title: "Get In Touch",
            description: "Have questions or feedback? We'd love to hear from you.",
            email: "Email",
            message: "Message",
            send: "Send Message"
        },
        
        // Footer
        footer: {
            copyright: "© 2024 Upendra Bhattarai",
            tagline: "DATADRIVEN NEPAL"
        },
        
        // Poll Categories
        categories: {
            politicalCrisis: "Political Crisis",
            rootCauses: "Root Causes", 
            stabilityAssessment: "Stability Assessment",
            youthMovement: "Youth Movement",
            interimGovernment: "Interim Government",
            electoralReform: "Electoral Reform",
            electoralTimeline: "Electoral Timeline",
            victimSupport: "Victim Support",
            electoralSystem: "Electoral System",
            antiCorruption: "Anti-Corruption",
            youthLeadership: "Youth Leadership",
            economicDevelopment: "Economic Development",
            foreignRelations: "Foreign Relations",
            demographics: "Demographics"
        }
    },
    
    ne: {
        // Navigation
        nav: {
            polls: "मतदान",
            globalUsers: "वैश्विक प्रयोगकर्ता",
            contact: "सम्पर्क"
        },
        
        // Hero Section
        hero: {
            welcome: "स्वागत छ",
            title: "डाटा ड्रिभन नेपाल",
            subtitle: "नेपालको लोकतान्त्रिक भविष्यमा तपाईंको आवाजले मायना राख्छ",
            description: "नेपालका हिमालहरूबाट विश्वसम्म, तपाईंको आवाज पहाड र उपत्यकाहरूमा गूँज्छ। वैश्विक कुराकानीमा सहभागी हुनुहोस् र हाम्रो सार्वजनिक मतदान प्लेटफर्ममा तपाईंको राय सुनिनुहोस्।",
            cta: "मतदान सुरु गर्नुहोस्",
            viewMap: "वैश्विक प्रयोगकर्ता हेर्नुहोस्"
        },
        
        // Polls Section
        polls: {
            title: "सक्रिय मतदान",
            description: "वर्तमान विषयहरूमा तपाईंको राय साझा गर्नुहोस् र अरूले कसरी सोच्छन् हेर्नुहोस्",
            submitVote: "मत दिनुहोस्",
            thankYou: "मतदानको लागि धन्यवाद",
            responses: "जवाफहरू"
        },
        
        // Map Section
        map: {
            title: "वैश्विक मतदाता",
            description: "हाम्रो समुदायका सदस्यहरू विश्वभर कहाँ छन् हेर्नुहोस्",
            noVoters: "अहिलेसम्म कुनै मतदाता छैन",
            beFirst: "पहिलो मतदाता बन्नुहोस्!",
            voter: "मतदाता",
            votes: "मतहरू",
            firstVote: "पहिलो मत"
        },
        
        // Statistics
        stats: {
            totalVoters: "कुल मतदाता",
            countries: "देशहरू",
            pollsCompleted: "पूरा भएका मतदान",
            totalResponses: "कुल जवाफहरू"
        },
        
        // Contact Section
        contact: {
            title: "सम्पर्क गर्नुहोस्",
            description: "प्रश्न वा प्रतिक्रिया छ? हामी तपाईंबाट सुन्न चाहन्छौं।",
            email: "इमेल",
            message: "सन्देश",
            send: "सन्देश पठाउनुहोस्"
        },
        
        // Footer
        footer: {
            copyright: "© २०२४ उपेन्द्र भट्टराई",
            tagline: "डाटाड्रिभन नेपाल"
        },
        
        // Poll Categories
        categories: {
            politicalCrisis: "राजनीतिक संकट",
            rootCauses: "मूल कारणहरू",
            stabilityAssessment: "स्थिरता मूल्याङ्कन",
            youthMovement: "युवा आन्दोलन",
            interimGovernment: "अन्तरिम सरकार",
            electoralReform: "निर्वाचन सुधार",
            electoralTimeline: "निर्वाचन समयसीमा",
            victimSupport: "पीडित सहयोग",
            electoralSystem: "निर्वाचन प्रणाली",
            antiCorruption: "भ्रष्टाचार विरोधी",
            youthLeadership: "युवा नेतृत्व",
            economicDevelopment: "आर्थिक विकास",
            foreignRelations: "विदेशी सम्बन्ध",
            demographics: "जनसांख्यिकी"
        }
    }
};

// Language management
let currentLanguage = 'en';

// Get translation for a key
function t(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        value = value[k];
        if (value === undefined) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }
    }
    
    return value;
}

// Set language and update UI
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('hamroawaz_language', lang);
    updateLanguageUI();
}

// Get saved language preference
function getSavedLanguage() {
    return localStorage.getItem('hamroawaz_language') || 'en';
}

// Initialize language on page load
function initLanguage() {
    currentLanguage = getSavedLanguage();
    updateLanguageUI();
}

// Update all text elements with current language
function updateLanguageUI() {
    // Update navigation
    document.querySelectorAll('[data-translate="nav.polls"]').forEach(el => {
        el.textContent = t('nav.polls');
    });
    document.querySelectorAll('[data-translate="nav.globalUsers"]').forEach(el => {
        el.textContent = t('nav.globalUsers');
    });
    document.querySelectorAll('[data-translate="nav.contact"]').forEach(el => {
        el.textContent = t('nav.contact');
    });
    
    // Update hero section
    document.querySelectorAll('[data-translate="hero.welcome"]').forEach(el => {
        el.textContent = t('hero.welcome');
    });
    document.querySelectorAll('[data-translate="hero.title"]').forEach(el => {
        el.textContent = t('hero.title');
    });
    document.querySelectorAll('[data-translate="hero.subtitle"]').forEach(el => {
        el.textContent = t('hero.subtitle');
    });
    document.querySelectorAll('[data-translate="hero.description"]').forEach(el => {
        el.textContent = t('hero.description');
    });
    document.querySelectorAll('[data-translate="hero.cta"]').forEach(el => {
        el.textContent = t('hero.cta');
    });
    document.querySelectorAll('[data-translate="hero.viewMap"]').forEach(el => {
        el.textContent = t('hero.viewMap');
    });
    
    // Update polls section
    document.querySelectorAll('[data-translate="polls.title"]').forEach(el => {
        el.textContent = t('polls.title');
    });
    document.querySelectorAll('[data-translate="polls.description"]').forEach(el => {
        el.textContent = t('polls.description');
    });
    
    // Update map section
    document.querySelectorAll('[data-translate="map.title"]').forEach(el => {
        el.textContent = t('map.title');
    });
    document.querySelectorAll('[data-translate="map.description"]').forEach(el => {
        el.textContent = t('map.description');
    });
    
    // Update contact section
    document.querySelectorAll('[data-translate="contact.title"]').forEach(el => {
        el.textContent = t('contact.title');
    });
    document.querySelectorAll('[data-translate="contact.description"]').forEach(el => {
        el.textContent = t('contact.description');
    });
    
    // Update footer
    document.querySelectorAll('[data-translate="footer.copyright"]').forEach(el => {
        el.textContent = t('footer.copyright');
    });
    document.querySelectorAll('[data-translate="footer.tagline"]').forEach(el => {
        el.textContent = t('footer.tagline');
    });
    
    // Update language button
    const languageBtn = document.getElementById('language-btn');
    if (languageBtn) {
        const languageText = languageBtn.querySelector('.language-text');
        if (languageText) {
            languageText.textContent = currentLanguage === 'en' ? 'नेपाली' : 'English';
        }
    }
    
    // Update document direction for RTL languages if needed
    document.documentElement.lang = currentLanguage;
}

// Toggle between languages
function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'ne' : 'en';
    setLanguage(newLang);
}
