#!/usr/bin/env python3
"""
Hamro Awaz Polling Platform - Poll Update Script
Converts polls-config.md to HTML and updates hamroawaz.html
"""

import re
import os
from datetime import datetime

def parse_markdown_polls(md_file):
    """Parse the markdown file and extract poll data"""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    polls = []
    
    # Split content by poll sections
    poll_sections = re.split(r'## Poll (\d+):', content)[1:]  # Skip the first empty part
    
    for i in range(0, len(poll_sections), 2):
        if i + 1 >= len(poll_sections):
            break
            
        poll_num = poll_sections[i].strip()
        poll_content = poll_sections[i + 1]
        
        # Extract title (first line)
        lines = poll_content.strip().split('\n')
        title = lines[0].strip()
        
        # Find category
        category = ""
        question = ""
        options = []
        
        for line in lines:
            if line.startswith('**Category:**'):
                category = line.replace('**Category:**', '').strip()
            elif line.startswith('**Question:**'):
                question = line.replace('**Question:**', '').strip()
            elif line.startswith('**Options:**'):
                # Get all option lines after this
                option_lines = []
                for j, opt_line in enumerate(lines[lines.index(line) + 1:], lines.index(line) + 1):
                    if opt_line.strip().startswith('- ') and '(' in opt_line and '%)' in opt_line:
                        option_lines.append(opt_line)
                    elif opt_line.strip() == '---' or opt_line.strip() == '':
                        break
                
                # Parse options
                for opt_line in option_lines:
                    # Extract text and percentage
                    match = re.match(r'- (.+?) \((\d+)%\)', opt_line)
                    if match:
                        option_text = match.group(1).strip()
                        percentage = match.group(2)
                        
                        # Create a simple value from the option text
                        value = re.sub(r'[^a-zA-Z0-9]', '_', option_text.lower())[:20]
                        options.append({
                            'text': option_text,
                            'value': value,
                            'percentage': percentage
                        })
        
        if question and options:
            polls.append({
                'id': f'poll{poll_num}',
                'title': title,
                'category': category,
                'question': question,
                'options': options
            })
    
    return polls

def generate_poll_html(poll):
    """Generate HTML for a single poll"""
    poll_id = poll['id']
    category = poll['category']
    question = poll['question']
    options = poll['options']
    
    html = f'''
                <div class="poll-card">
                    <div class="poll-header">
                        <h3 class="poll-question">{question}</h3>
                        <div class="poll-meta">
                            <span class="poll-category">{category}</span>
                        </div>
                    </div>
                    <div class="poll-options">'''
    
    for option in options:
        html += f'''
                        <label class="poll-option">
                            <input type="radio" name="{poll_id}" value="{option['value']}">
                            <span class="option-text">{option['text']}</span>
                            <div class="option-bar">
                                <div class="option-fill" style="width: 0%"></div>
                                <span class="option-percentage">0 votes</span>
                            </div>
                        </label>'''
    
    html += f'''
                    </div>
                    <button class="submit-poll-btn" onclick="submitPoll('{poll_id}')">Submit Vote</button>
                </div>

'''
    
    return html

def update_html_file(polls, html_file):
    """Update the HTML file with new poll data"""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the polls section
    start_marker = '<!-- POLLS START -->'
    end_marker = '<!-- POLLS END -->'
    
    start_pos = content.find(start_marker)
    end_pos = content.find(end_marker)
    
    if start_pos == -1 or end_pos == -1:
        print("Error: Could not find poll markers in HTML file")
        return False
    
    # Generate new polls HTML
    polls_html = ''
    for poll in polls:
        polls_html += generate_poll_html(poll)
    
    # Replace the polls section
    new_content = content[:start_pos + len(start_marker)] + '\n' + polls_html + content[end_pos:]
    
    # Write back to file
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

def main():
    """Main function"""
    md_file = 'polls-config.md'
    html_file = 'hamroawaz.html'
    
    if not os.path.exists(md_file):
        print(f"Error: {md_file} not found")
        return
    
    if not os.path.exists(html_file):
        print(f"Error: {html_file} not found")
        return
    
    print("🔄 Parsing polls from markdown file...")
    polls = parse_markdown_polls(md_file)
    
    if not polls:
        print("❌ No polls found in markdown file")
        return
    
    print(f"✅ Found {len(polls)} polls")
    
    print("🔄 Updating HTML file...")
    if update_html_file(polls, html_file):
        print("✅ HTML file updated successfully!")
        print(f"📊 Updated {len(polls)} polls")
        print(f"⏰ Updated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    else:
        print("❌ Failed to update HTML file")

if __name__ == "__main__":
    main()