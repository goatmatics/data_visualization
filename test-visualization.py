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
        import sys
        import os
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        # Import the data processor module
        import importlib.util
        spec = importlib.util.spec_from_file_location("data_processor", "data-processor.py")
        data_processor_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(data_processor_module)
        HamroAwazDataProcessor = data_processor_module.HamroAwazDataProcessor
        
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
