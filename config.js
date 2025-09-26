// Configuration for Poll Data Collection
// Choose one or more of the following options:

// Option 1: GitHub Issues API (Not recommended for security)
// This will create a GitHub issue for each poll response
//window.GITHUB_CONFIG = {
//    repoOwner: 'upendrabhattarai',  // Your GitHub username
//    repoName: 'hamroawaz-polling-platform',  // Your repository name
//    githubToken: 'YOUR_GITHUB_TOKEN_HERE'  // Replace with your actual GitHub personal access token
//};

// Option 2: Google Sheets API (Not needed with Apps Script)
// This will append each poll response to a Google Sheet
//window.GOOGLE_SHEETS_CONFIG = {
//    sheetId: 'your_google_sheet_id_here',  // The ID from your Google Sheet URL
//    apiKey: 'your_google_api_key_here'     // Your Google API key
//};

// Option 3: Webhook Integration (RECOMMENDED - Google Apps Script)
// This will send data to your Google Apps Script webhook
window.WEBHOOK_CONFIG = {
    webhookUrl: 'https://script.google.com/macros/s/AKfycbwUepofr_IK7e_yKL_nSZNYCNhPI-stlhuczVHI7b05QJ6as99bhESOLM29KB95VK87Yg/exec',
    options: {}
};

// Instructions:
// 1. Uncomment the configuration you want to use
// 2. Replace the placeholder values with your actual credentials
// 3. Comment out or remove the configurations you don't need
// 4. Make sure to keep your tokens/keys secure and don't commit them to public repos

// For GitHub Issues API:
// 1. Go to GitHub Settings > Developer settings > Personal access tokens
// 2. Generate a new token with 'repo' permissions
// 3. Replace 'ghp_your_github_token_here' with your actual token

// For Google Sheets:
// 1. Create a Google Sheet and share it publicly (view only)
// 2. Get the sheet ID from the URL
// 3. Enable Google Sheets API and create an API key
// 4. Replace the placeholder values

// For Webhooks:
// 1. Use Zapier, IFTTT, or any webhook service
// 2. Create a webhook that can receive JSON data
// 3. Replace the webhook URL
