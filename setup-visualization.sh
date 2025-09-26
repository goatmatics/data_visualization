#!/bin/bash

# Hamro Awaz Data Visualization Setup Script
# This script helps set up the interactive data visualization

echo "🚀 Setting up Hamro Awaz Data Visualization..."
echo "=============================================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if required Python packages are installed
echo "📦 Checking Python dependencies..."
python3 -c "import pandas, requests" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📥 Installing required Python packages..."
    pip3 install pandas requests
fi

# Make the data processor executable
chmod +x data-processor.py

# Create a simple test script
cat > test-visualization.py << 'EOF'
#!/usr/bin/env python3
"""
Test script for Hamro Awaz Data Visualization
"""

import sys
import os

def test_webhook_connection():
    """Test connection to Google Sheets webhook"""
    try:
        import requests
        webhook_url = "https://script.google.com/macros/s/AKfycbwUepofr_IK7e_yKL_nSZNYCNhPI-stlhuczVHI7b05QJ6as99bhESOLM29KB95VK87Yg/exec"
        
        print("🔗 Testing webhook connection...")
        response = requests.get(f"{webhook_url}?stats=1", timeout=10)
        
        if response.status_code == 200:
            print("✅ Webhook connection successful!")
            data = response.json()
            print(f"📊 Found {data.get('totals', {}).get('visitors', 0)} visitors")
            print(f"🌍 From {data.get('totals', {}).get('countries', 0)} countries")
            print(f"📝 With {data.get('totals', {}).get('pollsCompleted', 0)} poll responses")
            return True
        else:
            print(f"❌ Webhook returned status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Webhook connection failed: {e}")
        return False

def test_data_processor():
    """Test the data processor"""
    try:
        from data_processor import HamroAwazDataProcessor
        
        print("\n🔧 Testing data processor...")
        processor = HamroAwazDataProcessor()
        
        # Test with sample data
        processor.data = [
            {
                'Timestamp': '2024-01-01T00:00:00Z',
                'Poll ID': 'poll1',
                'Response': 'Option 1',
                'Question': 'Test Question',
                'Category': 'Test Category',
                'Session ID': 'session1',
                'User Country': 'Nepal'
            }
        ]
        
        stats = processor.get_basic_statistics()
        if stats:
            print("✅ Data processor working correctly!")
            print(f"📊 Processed {stats['total_responses']} responses")
            return True
        else:
            print("❌ Data processor failed")
            return False
            
    except Exception as e:
        print(f"❌ Data processor test failed: {e}")
        return False

def main():
    print("🧪 Running Hamro Awaz Visualization Tests...")
    print("=" * 50)
    
    # Test webhook connection
    webhook_ok = test_webhook_connection()
    
    # Test data processor
    processor_ok = test_data_processor()
    
    print("\n" + "=" * 50)
    print("📋 Test Results:")
    print(f"   Webhook Connection: {'✅ PASS' if webhook_ok else '❌ FAIL'}")
    print(f"   Data Processor: {'✅ PASS' if processor_ok else '❌ FAIL'}")
    
    if webhook_ok and processor_ok:
        print("\n🎉 All tests passed! Your visualization is ready to use.")
        print("\n📖 Next steps:")
        print("   1. Open data-visualization.html in your web browser")
        print("   2. The page will automatically load data from your Google Sheets")
        print("   3. Use the filters to explore different aspects of your data")
        print("   4. Export data using the 'Export Data' button")
    else:
        print("\n⚠️  Some tests failed. Please check the error messages above.")
        print("   The visualization may still work, but some features might be limited.")

if __name__ == "__main__":
    main()
EOF

chmod +x test-visualization.py

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 What was created:"
echo "   • data-visualization.html - Main visualization page"
echo "   • data-visualization.js - Interactive functionality"
echo "   • data-processor.py - Python data analysis script"
echo "   • test-visualization.py - Test script"
echo "   • DATA-VISUALIZATION-README.md - Documentation"
echo ""
echo "🧪 Running tests..."
python3 test-visualization.py

echo ""
echo "🚀 To start using the visualization:"
echo "   1. Open data-visualization.html in your web browser"
echo "   2. The page will automatically connect to your Google Sheets"
echo "   3. Use the filters to explore your poll data"
echo ""
echo "📊 For data analysis:"
echo "   python3 data-processor.py --webhook-url 'YOUR_WEBHOOK_URL' --summary"
echo ""
echo "📖 For detailed documentation:"
echo "   cat DATA-VISUALIZATION-README.md"
echo ""
echo "🎉 Happy analyzing!"
