# 📊 Hamro Awaz - Data Visualization Repository

This repository contains the interactive data visualization components for the Hamro Awaz polling platform. It provides beautiful, real-time visualizations of poll data collected from Google Sheets.

## 🎯 Overview

This visualization platform connects directly to your Google Spreadsheet and displays:
- **Interactive Charts**: Response distribution, geographic analysis, demographic breakdowns
- **Real-time Maps**: Global voter distribution with country-based markers
- **Advanced Filtering**: Filter by demographics, geography, time periods, and more
- **Data Export**: Download filtered data for further analysis

## 📁 Repository Structure

### Core Visualization Files
- `data-visualization.html` - Main visualization dashboard
- `data-visualization.js` - Interactive functionality and chart logic
- `data-processor.py` - Python script for data analysis and processing
- `config.js` - Configuration for Google Sheets connection

### Setup & Testing
- `setup-visualization.sh` - Automated setup script
- `test-visualization.py` - Test script to verify functionality

### Documentation
- `DATA-VISUALIZATION-README.md` - Comprehensive documentation
- `README.md` - This file

### Assets
- `assets/images/logo.png` - Logo and visual assets

## 🚀 Quick Start

### 1. Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd data_visualization

# Run the setup script
chmod +x setup-visualization.sh
./setup-visualization.sh
```

### 2. Configure Google Sheets Connection
1. Update `config.js` with your Google Apps Script webhook URL
2. Ensure your Google Apps Script is deployed as a web app
3. Set permissions to "Anyone" for public access

### 3. Launch Visualization
```bash
# Open the visualization in your browser
open data-visualization.html
```

## 📊 Features

### Interactive Charts
- **Response Distribution**: Doughnut, pie, and bar charts
- **Geographic Analysis**: Country-based response breakdowns
- **Demographic Insights**: Age groups, residence, political affiliation
- **Poll Question Analysis**: Individual poll deep-dives

### Advanced Filtering
- Filter by country, age group, residence, political affiliation
- Time-based filtering (today, this week, this month, all time)
- Poll category filtering
- Real-time chart updates

### Data Export
- Export filtered data as JSON
- Use Python script for advanced analysis
- Generate comprehensive reports

## 🔧 Configuration

### Google Sheets Integration
The visualization connects to your Google Sheets via a webhook URL in `config.js`:

```javascript
window.WEBHOOK_CONFIG = {
    webhookUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    options: {}
};
```

### Data Format
Your Google Apps Script should return data in this format:
```json
[
  {
    "Timestamp": "2024-01-01T00:00:00Z",
    "Poll ID": "poll1",
    "Response": "Option 1",
    "Question": "Your question here?",
    "Category": "Category Name",
    "Session ID": "unique-session-id",
    "User Country": "Nepal",
    "User State": "State",
    "User City": "City"
  }
]
```

## 📈 Data Analysis

### Python Script Usage
```bash
# Get data summary
python3 data-processor.py --webhook-url "YOUR_WEBHOOK_URL" --summary

# Export data to CSV
python3 data-processor.py --webhook-url "YOUR_WEBHOOK_URL" --export-csv data.csv

# Export analysis to JSON
python3 data-processor.py --webhook-url "YOUR_WEBHOOK_URL" --export-analysis analysis.json
```

## 🛠️ Dependencies

### External Libraries (Loaded via CDN)
- **Chart.js** - Interactive charts and graphs
- **Leaflet** - Interactive maps
- **Font Awesome** - Icons
- **Google Fonts (Inter)** - Typography

### Python Dependencies
- `pandas` - Data manipulation
- `requests` - HTTP requests

## 📖 Documentation

For detailed documentation, see:
- `DATA-VISUALIZATION-README.md` - Comprehensive guide
- Inline comments in JavaScript and Python files

## 🔒 Security

- **No API Keys**: Uses Google Apps Script webhook (no exposed credentials)
- **Public Access**: Visualization is publicly accessible
- **Data Privacy**: No local data storage, direct connection to Google Sheets
- **CORS Handling**: Proper cross-origin request handling

## 📞 Support

For questions or issues:
- Check the browser console for error messages
- Verify your Google Apps Script webhook is working
- Run `python3 test-visualization.py` to test functionality

---

**Note**: This repository focuses solely on data visualization. The polling platform and data collection components are maintained in a separate repository.