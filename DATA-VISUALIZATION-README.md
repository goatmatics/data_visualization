# 📊 Hamro Awaz - Interactive Data Visualization

## 🎯 Overview

This interactive data visualization dashboard provides real-time insights into the Hamro Awaz polling platform data. It connects directly to your Google Spreadsheet and displays beautiful, interactive charts and maps with advanced filtering capabilities.

## 🌟 Features

### 📈 Interactive Charts
- **Response Distribution**: Doughnut, pie, and bar charts showing poll response patterns
- **Geographic Distribution**: Bar charts showing responses by country
- **Age Group Analysis**: Demographic breakdown by age groups
- **Political Affiliation**: Visual representation of political preferences
- **Poll Question Analysis**: Detailed analysis of individual poll questions

### 🗺️ Interactive Map
- **Global Voter Distribution**: Real-time map showing voter locations worldwide
- **Country-based Markers**: Click markers to see response counts by country
- **Responsive Design**: Works on desktop and mobile devices

### 🔍 Advanced Filtering
- **Country Filter**: Filter responses by specific countries
- **Age Group Filter**: Filter by age demographics (below 18, 18-24, 25-34, 35-49, 50+)
- **Residence Filter**: Filter by location (Urban Nepal, Rural Nepal, Diaspora regions)
- **Political Affiliation**: Filter by political party preferences
- **Poll Category**: Filter by poll categories (Political Crisis, Electoral Reform, etc.)
- **Time Period**: Filter by time periods (Today, This Week, This Month, All Time)

### 📊 Real-time Data
- **Live Updates**: Automatically refreshes data every 30 seconds
- **Google Sheets Integration**: Direct connection to your Google Spreadsheet
- **Sample Data**: Includes sample data for demonstration when no real data is available

## 🚀 Quick Start

### 1. Open the Visualization
Simply open `data-visualization.html` in your web browser. The page will automatically:
- Load data from your Google Sheets via the webhook
- Display interactive charts and maps
- Show real-time statistics

### 2. Apply Filters
Use the filter section to:
- Select specific countries, age groups, or political affiliations
- Choose time periods or poll categories
- Click "Apply Filters" to update all visualizations

### 3. Explore Individual Polls
- Use the "Poll Question Analysis" section
- Select any poll from the dropdown
- View detailed response breakdowns for that specific question

### 4. Export Data
- Click "Export Data" to download filtered data as JSON
- Use the data processor script for advanced analysis

## 📁 Files

### Core Files
- **`data-visualization.html`** - Main visualization page
- **`data-visualization.js`** - JavaScript functionality and chart logic
- **`data-processor.py`** - Python script for data analysis and processing

### Dependencies
The visualization uses these external libraries:
- **Chart.js** - For beautiful, interactive charts
- **Leaflet** - For interactive maps
- **Font Awesome** - For icons
- **Google Fonts (Inter)** - For typography

## 🔧 Configuration

### Google Sheets Connection
The visualization automatically connects to your Google Sheets using the webhook URL from `config.js`:
```javascript
window.WEBHOOK_CONFIG = {
    webhookUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    options: {}
};
```

### Data Structure
The visualization expects data with these fields:
- `Timestamp` - When the response was submitted
- `Poll ID` - Identifier for the poll (poll1, poll2, etc.)
- `Response` - The selected answer
- `Question` - Full question text
- `Category` - Poll category
- `Session ID` - Unique session identifier
- `User Country` - Voter's country
- `User State` - Voter's state/region
- `User City` - Voter's city
- `Latitude` / `Longitude` - Geographic coordinates

## 📊 Chart Types

### Response Distribution Chart
- **Doughnut Chart**: Shows response percentages in a circular format
- **Bar Chart**: Horizontal bars for easy comparison
- **Pie Chart**: Traditional pie chart view

### Geographic Distribution Chart
- **Bar Chart**: Countries ranked by response count
- **Horizontal Bar**: Alternative layout for better readability

### Age Group Analysis
- **Bar Chart**: Age groups with response counts
- **Line Chart**: Trend analysis over time

### Political Affiliation
- **Doughnut Chart**: Political party distribution
- **Pie Chart**: Alternative circular view

## 🗺️ Map Features

### Interactive Elements
- **Country Markers**: Click to see response statistics
- **Zoom Controls**: Zoom in/out for detailed view
- **Dark Theme**: Matches the overall design aesthetic
- **Responsive**: Works on all screen sizes

### Geographic Data
- **Country Coordinates**: Pre-configured coordinates for major countries
- **Response Aggregation**: Groups responses by country
- **Real-time Updates**: Updates when filters are applied

## 🔍 Filtering System

### Cross-Reference Filtering
The system intelligently cross-references demographic data:
- **Age Filter**: Uses poll17 (age group) data
- **Residence Filter**: Uses poll16 (residence) data  
- **Affiliation Filter**: Uses poll18 (political affiliation) data

### Filter Combinations
- **Multiple Filters**: Apply multiple filters simultaneously
- **Real-time Updates**: All charts update immediately when filters change
- **Filter Persistence**: Filters remain active until cleared

## 📱 Responsive Design

### Mobile Optimization
- **Responsive Grid**: Charts adapt to screen size
- **Touch-Friendly**: All controls work on touch devices
- **Mobile Menu**: Collapsible navigation on small screens

### Desktop Features
- **Large Charts**: Full-size charts on desktop
- **Hover Effects**: Interactive hover states
- **Keyboard Navigation**: Full keyboard accessibility

## 🛠️ Data Processing

### Python Script Usage
```bash
# Load data from webhook and print summary
python3 data-processor.py --webhook-url "YOUR_WEBHOOK_URL" --summary

# Load from CSV file
python3 data-processor.py --csv-file "data.csv" --summary

# Export analysis to JSON
python3 data-processor.py --webhook-url "YOUR_WEBHOOK_URL" --export-analysis "analysis.json"
```

### Available Commands
- `--webhook-url`: Load data from Google Sheets webhook
- `--csv-file`: Load data from CSV file
- `--json-file`: Load data from JSON file
- `--summary`: Print detailed data summary
- `--export-csv`: Export data to CSV
- `--export-analysis`: Export analysis to JSON

## 🎨 Customization

### Color Scheme
The visualization uses a consistent color palette:
- **Primary**: #00ff88 (Green)
- **Secondary**: #0088ff (Blue)
- **Accent**: #ff0088 (Pink)
- **Background**: #0a0a0a (Dark)
- **Surface**: #1a1a1a (Dark Gray)

### Chart Colors
- **Chart.js Colors**: Predefined color palette for consistent theming
- **Dynamic Colors**: Colors adapt based on data size
- **Accessibility**: High contrast for readability

## 🔄 Auto-Refresh

### Real-time Updates
- **30-Second Intervals**: Automatically refreshes data every 30 seconds
- **Background Updates**: Updates happen without user interaction
- **Error Handling**: Gracefully handles connection issues

### Manual Refresh
- **Apply Filters**: Manually trigger updates when filters change
- **Clear Filters**: Reset to show all data
- **Export Data**: Download current filtered dataset

## 📈 Analytics Features

### Response Analysis
- **Response Counts**: Total responses per option
- **Percentage Breakdown**: Visual percentage representation
- **Trend Analysis**: Time-based response patterns

### Demographic Insights
- **Age Distribution**: Response patterns by age group
- **Geographic Patterns**: Regional response variations
- **Political Preferences**: Affiliation-based analysis

### Poll Performance
- **Response Rates**: Which polls get most responses
- **Category Analysis**: Performance by poll category
- **Question Analysis**: Individual poll deep-dives

## 🚨 Troubleshooting

### Common Issues

#### No Data Displayed
- Check webhook URL in `config.js`
- Verify Google Apps Script is deployed correctly
- Check browser console for error messages

#### Charts Not Loading
- Ensure internet connection for external libraries
- Check browser compatibility (modern browsers required)
- Verify Chart.js and Leaflet are loading

#### Map Not Showing
- Check Leaflet library loading
- Verify country coordinates are available
- Check for JavaScript errors in console

### Debug Mode
Enable debug mode by opening browser developer tools:
- **Console**: Check for error messages
- **Network**: Verify data loading
- **Elements**: Inspect chart containers

## 🔒 Security

### Data Privacy
- **No Data Storage**: Data is not stored locally
- **Direct Connection**: Connects directly to Google Sheets
- **CORS Handling**: Proper cross-origin request handling

### Access Control
- **Public Access**: Visualization is publicly accessible
- **Data Source**: Only displays data from your Google Sheets
- **No Authentication**: No login required for viewing

## 📞 Support

### Getting Help
- Check the browser console for error messages
- Verify your Google Apps Script webhook is working
- Ensure all external libraries are loading correctly

### Customization
- Modify colors in the CSS variables
- Add new chart types in the JavaScript
- Extend filtering options as needed

---

**Note**: This visualization is designed to work with the existing Hamro Awaz polling platform. Make sure your Google Apps Script webhook is properly configured and deployed for the best experience.
