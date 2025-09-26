# 📊 Poll Management System

## 🎯 Overview
This system allows you to easily manage polls for the Hamro Awaz platform using a simple markdown file. No need to edit HTML directly!

## 📁 Files
- **`polls-config.md`** - Edit your polls here (easy markdown format)
- **`update-polls.py`** - Python script that converts markdown to HTML
- **`update-polls.sh`** - Shell script to run the update (optional)
- **`hamroawaz.html`** - Your main website (auto-updated)

## 🚀 How to Use

### 1. Edit Polls
Open `polls-config.md` and modify:
- **Questions** - Change the poll questions
- **Options** - Add, remove, or modify answer choices
- **Categories** - Update poll categories
- **Percentages** - Adjust the display percentages

### 2. Update HTML
After saving `polls-config.md`, run:
```bash
python3 update-polls.py
```

Or use the shell script:
```bash
./update-polls.sh
```

### 3. View Changes
Refresh your website to see the updated polls!

## 📝 Markdown Format

### Basic Structure
```markdown
## Poll 1: Your Poll Title
**Category:** Your Category
**Question:** Your question here?

**Options:**
- Option 1 text here. (25%)
- Option 2 text here. (30%)
- Option 3 text here. (25%)
- Option 4 text here. (20%)

---
```

### Adding New Polls
1. Copy an existing poll section
2. Change the poll number (Poll 1, Poll 2, etc.)
3. Update the question, category, and options
4. Save the file
5. Run the update script

### Modifying Existing Polls
1. Find the poll you want to change
2. Edit the question, category, or options
3. Save the file
4. Run the update script

### Adding/Removing Options
1. Add or remove option lines
2. Make sure percentages add up to 100%
3. Save the file
4. Run the update script

## ⚠️ Important Notes

### Poll IDs
- Each poll must have a unique number (Poll 1, Poll 2, etc.)
- The script automatically generates poll IDs (poll1, poll2, etc.)

### Percentages
- Percentages are just for display
- They should add up to 100% for best appearance
- You can use any numbers you want

### Option Values
- The script automatically creates option values from the text
- Special characters are converted to underscores
- Values are limited to 20 characters

## 🔧 Troubleshooting

### Script Not Working
- Make sure Python 3 is installed
- Check that `polls-config.md` exists
- Verify the markdown format is correct

### HTML Not Updating
- Check that the poll markers exist in `hamroawaz.html`
- Look for `<!-- POLLS START -->` and `<!-- POLLS END -->`
- Make sure the script ran without errors

### Polls Not Appearing
- Check the markdown format
- Make sure questions and options are properly formatted
- Verify that percentages are in the correct format

## 📊 Example Poll

```markdown
## Poll 1: Favorite Programming Language
**Category:** Technology
**Question:** What is your favorite programming language?

**Options:**
- JavaScript - Great for web development. (30%)
- Python - Simple and powerful. (25%)
- Java - Enterprise applications. (20%)
- C++ - High performance computing. (15%)
- Other - Something else. (10%)

---
```

## 🎉 Benefits

✅ **Easy Editing** - No HTML knowledge required  
✅ **Version Control** - Track changes in markdown  
✅ **Bulk Updates** - Change multiple polls at once  
✅ **Consistent Format** - Automatic HTML generation  
✅ **Error Prevention** - Script validates the format  

## 🔄 Workflow

1. **Edit** `polls-config.md`
2. **Save** the file
3. **Run** `python3 update-polls.py`
4. **Refresh** your website
5. **Done!** 🎉

---

**Need help?** Check the script output for error messages or contact the developer.
