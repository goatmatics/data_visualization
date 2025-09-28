// Configuration for Hamro Awaz Data Visualization
// This file contains the webhook URL for connecting to your Google Sheets data

// Google Apps Script Webhook Configuration
// This connects the visualization to your Google Sheets data source
window.WEBHOOK_CONFIG = {
    webhookUrl: 'https://script.google.com/macros/s/AKfycbwUepofr_IK7e_yKL_nSZNYCNhPI-stlhuczVHI7b05QJ6as99bhESOLM29KB95VK87Yg/exec',
    options: {}
};

// Instructions:
// 1. Make sure your Google Apps Script is deployed as a web app
// 2. The webhook URL should point to your deployed Apps Script
// 3. The Apps Script should be configured to return poll data in JSON format
// 4. Set the web app permissions to "Anyone" for public access

// Data Format Expected:
// The webhook should return an array of poll response objects with these fields:
// - Timestamp: When the response was submitted
// - Poll ID: Identifier for the poll (poll1, poll2, etc.)
// - Response: The selected answer
// - Question: Full question text
// - Category: Poll category
// - Session ID: Unique session identifier
// - User Country: Voter's country
// - User State: Voter's state/region
// - User City: Voter's city
// - Latitude/Longitude: Geographic coordinates (optional)
