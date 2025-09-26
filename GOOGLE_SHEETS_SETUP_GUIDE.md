# 📊 Google Sheets Setup Guide for Hamro Awaz

## 🎯 **Step-by-Step Setup (5 minutes)**

### **Step 1: Create Google Sheet**
1. Go to [Google Sheets](https://sheets.google.com)
2. Sign in with: `upendrarajbhattarai@gmail.com`
3. Click "Blank" to create a new spreadsheet
4. Name it: **"Hamro Awaz Poll Responses"**

### **Step 2: Set Up Headers**
In row 1, add these headers:
- **A1:** `Timestamp`
- **B1:** `Poll ID`
- **C1:** `Question`
- **D1:** `Category`
- **E1:** `Response`
- **F1:** `User Country`
- **G1:** `Language`
- **H1:** `Session ID`
- **I1:** `User Agent`

### **Step 3: Create Google Apps Script**
1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete the default code
3. Copy and paste the code from `google-apps-script.js` file
4. Click **Save** (Ctrl+S)
5. Give your project a name: **"Hamro Awaz Poll Collector"**

### **Step 4: Deploy as Web App**
1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Type"
3. Select **"Web app"**
4. Set these options:
   - **Execute as:** Me (upendrarajbhattarai@gmail.com)
   - **Who has access:** Anyone
5. Click **Deploy**
6. **Copy the web app URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

### **Step 5: Update Your Website**
1. Go to your GitHub repository
2. Edit `config.js` file
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your actual web app URL
4. Commit the changes

### **Step 6: Test It!**
1. Visit your live website
2. Submit a test poll
3. Check your Google Sheet - you should see a new row!

## 🔒 **Security Benefits:**
- ✅ **No API keys in your code**
- ✅ **No tokens in your repository**
- ✅ **Google handles all authentication**
- ✅ **You control who can see the data**
- ✅ **Can revoke access anytime**

## 📈 **What You'll See:**
- Every poll response adds a new row to your sheet
- Real-time updates as people submit polls
- Easy to create charts and analyze data
- Can export to Excel or other formats
- Can share the sheet with others if needed

## 🛠️ **Troubleshooting:**
- If you get permission errors, make sure the web app is set to "Anyone" access
- If data doesn't appear, check the Apps Script execution log
- Make sure you copied the correct web app URL

## 🎉 **You're Done!**
Your poll data will now be securely collected in Google Sheets without any security risks!
