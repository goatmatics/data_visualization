# DataDriven Nepal - Backend Development Repository

This is the private development repository for the DataDriven Nepal polling platform.

## 🔒 Security
- **Private Repository**: This repository is private and contains all development files
- **No Public Access**: Only authorized developers can access this repository
- **Source Code Protection**: All source code, configuration, and development tools are kept secure

## 📁 Repository Structure

### Core Development Files
- `polls-config.md` - Poll configuration in markdown format
- `update-polls.py` - Script to convert markdown to HTML
- `js/hamroawaz.js` - Main JavaScript application
- `css/hamroawaz.css` - Stylesheet
- `config.js` - Application configuration
- `translations.js` - Multi-language support

### Admin Tools
- `poll-admin-interface.html` - Administrative interface
- `poll-lifecycle-manager.js` - Poll management system
- `webhook-collector.js` - Data collection system

### Documentation
- `POLL-MANAGEMENT.md` - Poll management guide
- `GOOGLE_SHEETS_SETUP_GUIDE.md` - Google Sheets integration guide
- `fixed-google-apps-script.js` - Google Apps Script code

### Assets
- `assets/` - Images, icons, and other static files

## 🚀 Development Workflow

1. **Edit Polls**: Modify `polls-config.md` to update poll questions and options
2. **Generate HTML**: Run `python3 update-polls.py` to convert markdown to HTML
3. **Deploy**: Copy generated files to the public deployment repository
4. **Test**: Verify changes work correctly on the live website

## 🔧 Setup

```bash
# Clone the repository
git clone https://github.com/goatmatics/backend.git
cd backend

# Install dependencies (if any)
# No external dependencies required

# Generate HTML from markdown
python3 update-polls.py

# Deploy to public repository
./deploy.sh  # (deployment script to be created)
```

## 📊 Poll Management

The polling system uses a markdown-based configuration system:

- Edit `polls-config.md` to modify polls
- Run `python3 update-polls.py` to generate HTML
- Copy files to public repository for deployment

## 🛡️ Security Features

- Private repository with restricted access
- No public forking allowed
- Secure development environment
- Protected source code and configuration

## 📞 Contact

For access or questions, contact: upendrabhattarai@g.harvard.edu

---

**Note**: This repository contains the complete development environment. The public website is deployed from a separate public repository that contains only the necessary files for GitHub Pages hosting.