#!/usr/bin/env python3
"""
Data Processor for Hamro Awaz Polling Platform
This script helps process and analyze poll data from Google Sheets
"""

import json
import csv
import pandas as pd
from datetime import datetime, timedelta
import requests
import sys

class HamroAwazDataProcessor:
    def __init__(self, webhook_url=None):
        """
        Initialize the data processor
        
        Args:
            webhook_url (str): Google Apps Script webhook URL for data retrieval
        """
        self.webhook_url = webhook_url
        self.data = []
        
    def load_data_from_webhook(self):
        """Load data from Google Sheets via webhook"""
        if not self.webhook_url:
            print("No webhook URL provided. Please provide a valid webhook URL.")
            return False
            
        try:
            # Try to get data from the webhook
            response = requests.get(f"{self.webhook_url}?data=1", timeout=30)
            response.raise_for_status()
            
            # Parse the response
            data = response.json()
            if isinstance(data, list):
                self.data = data
            else:
                print("Unexpected data format from webhook")
                return False
                
            print(f"Successfully loaded {len(self.data)} records from Google Sheets")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"Error loading data from webhook: {e}")
            return False
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {e}")
            return False
    
    def load_data_from_csv(self, csv_file):
        """Load data from CSV file"""
        try:
            df = pd.read_csv(csv_file)
            self.data = df.to_dict('records')
            print(f"Successfully loaded {len(self.data)} records from CSV")
            return True
        except Exception as e:
            print(f"Error loading CSV file: {e}")
            return False
    
    def load_data_from_json(self, json_file):
        """Load data from JSON file"""
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
            print(f"Successfully loaded {len(self.data)} records from JSON")
            return True
        except Exception as e:
            print(f"Error loading JSON file: {e}")
            return False
    
    def get_basic_statistics(self):
        """Get basic statistics about the data"""
        if not self.data:
            print("No data loaded")
            return None
            
        stats = {
            'total_responses': len(self.data),
            'unique_sessions': len(set(record.get('Session ID', '') for record in self.data)),
            'countries': len(set(record.get('User Country', '') for record in self.data)),
            'polls': len(set(record.get('Poll ID', '') for record in self.data)),
            'date_range': {
                'earliest': min(record.get('Timestamp', '') for record in self.data if record.get('Timestamp')),
                'latest': max(record.get('Timestamp', '') for record in self.data if record.get('Timestamp'))
            }
        }
        
        return stats
    
    def get_poll_breakdown(self):
        """Get breakdown by poll questions"""
        if not self.data:
            return None
            
        poll_stats = {}
        for record in self.data:
            poll_id = record.get('Poll ID', 'Unknown')
            if poll_id not in poll_stats:
                poll_stats[poll_id] = {
                    'question': record.get('Question', ''),
                    'category': record.get('Category', ''),
                    'responses': 0,
                    'unique_sessions': set()
                }
            
            poll_stats[poll_id]['responses'] += 1
            poll_stats[poll_id]['unique_sessions'].add(record.get('Session ID', ''))
        
        # Convert sets to counts
        for poll_id in poll_stats:
            poll_stats[poll_id]['unique_sessions'] = len(poll_stats[poll_id]['unique_sessions'])
        
        return poll_stats
    
    def get_geographic_breakdown(self):
        """Get breakdown by geographic location"""
        if not self.data:
            return None
            
        geo_stats = {}
        for record in self.data:
            country = record.get('User Country', 'Unknown')
            if country not in geo_stats:
                geo_stats[country] = {
                    'responses': 0,
                    'unique_sessions': set()
                }
            
            geo_stats[country]['responses'] += 1
            geo_stats[country]['unique_sessions'].add(record.get('Session ID', ''))
        
        # Convert sets to counts
        for country in geo_stats:
            geo_stats[country]['unique_sessions'] = len(geo_stats[country]['unique_sessions'])
        
        return geo_stats
    
    def get_demographic_breakdown(self):
        """Get demographic breakdown (age, residence, affiliation)"""
        if not self.data:
            return None
            
        # Get demographic data from specific polls
        age_data = {}
        residence_data = {}
        affiliation_data = {}
        
        for record in self.data:
            poll_id = record.get('Poll ID', '')
            response = record.get('Response', '')
            session_id = record.get('Session ID', '')
            
            if poll_id == 'poll17':  # Age group poll
                age_data[response] = age_data.get(response, 0) + 1
            elif poll_id == 'poll16':  # Residence poll
                residence_data[response] = residence_data.get(response, 0) + 1
            elif poll_id == 'poll18':  # Political affiliation poll
                affiliation_data[response] = affiliation_data.get(response, 0) + 1
        
        return {
            'age_groups': age_data,
            'residence': residence_data,
            'political_affiliation': affiliation_data
        }
    
    def export_to_csv(self, filename=None):
        """Export data to CSV file"""
        if not self.data:
            print("No data to export")
            return False
            
        if not filename:
            filename = f"hamroawaz_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        try:
            df = pd.DataFrame(self.data)
            df.to_csv(filename, index=False)
            print(f"Data exported to {filename}")
            return True
        except Exception as e:
            print(f"Error exporting to CSV: {e}")
            return False
    
    def export_analysis_to_json(self, filename=None):
        """Export analysis results to JSON"""
        if not filename:
            filename = f"hamroawaz_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        analysis = {
            'generated_at': datetime.now().isoformat(),
            'basic_statistics': self.get_basic_statistics(),
            'poll_breakdown': self.get_poll_breakdown(),
            'geographic_breakdown': self.get_geographic_breakdown(),
            'demographic_breakdown': self.get_demographic_breakdown()
        }
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(analysis, f, indent=2, ensure_ascii=False)
            print(f"Analysis exported to {filename}")
            return True
        except Exception as e:
            print(f"Error exporting analysis: {e}")
            return False
    
    def print_summary(self):
        """Print a summary of the data"""
        if not self.data:
            print("No data loaded")
            return
            
        print("\n" + "="*60)
        print("HAMRO AWAZ POLLING DATA SUMMARY")
        print("="*60)
        
        # Basic statistics
        stats = self.get_basic_statistics()
        if stats:
            print(f"\n📊 BASIC STATISTICS:")
            print(f"   Total Responses: {stats['total_responses']:,}")
            print(f"   Unique Sessions: {stats['unique_sessions']:,}")
            print(f"   Countries: {stats['countries']}")
            print(f"   Active Polls: {stats['polls']}")
            print(f"   Date Range: {stats['date_range']['earliest']} to {stats['date_range']['latest']}")
        
        # Poll breakdown
        poll_stats = self.get_poll_breakdown()
        if poll_stats:
            print(f"\n📋 POLL BREAKDOWN:")
            for poll_id, stats in sorted(poll_stats.items()):
                print(f"   {poll_id}: {stats['responses']} responses ({stats['unique_sessions']} unique sessions)")
                print(f"      Category: {stats['category']}")
                print(f"      Question: {stats['question'][:80]}...")
        
        # Geographic breakdown
        geo_stats = self.get_geographic_breakdown()
        if geo_stats:
            print(f"\n🌍 GEOGRAPHIC BREAKDOWN:")
            sorted_countries = sorted(geo_stats.items(), key=lambda x: x[1]['responses'], reverse=True)
            for country, stats in sorted_countries[:10]:  # Top 10 countries
                print(f"   {country}: {stats['responses']} responses ({stats['unique_sessions']} unique sessions)")
        
        # Demographic breakdown
        demo_stats = self.get_demographic_breakdown()
        if demo_stats:
            print(f"\n👥 DEMOGRAPHIC BREAKDOWN:")
            
            if demo_stats['age_groups']:
                print(f"   Age Groups:")
                for age, count in sorted(demo_stats['age_groups'].items()):
                    print(f"      {age}: {count} responses")
            
            if demo_stats['residence']:
                print(f"   Residence:")
                for residence, count in sorted(demo_stats['residence'].items()):
                    print(f"      {residence}: {count} responses")
            
            if demo_stats['political_affiliation']:
                print(f"   Political Affiliation:")
                for affiliation, count in sorted(demo_stats['political_affiliation'].items()):
                    print(f"      {affiliation}: {count} responses")
        
        print("\n" + "="*60)

def main():
    """Main function for command-line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Process Hamro Awaz polling data')
    parser.add_argument('--webhook-url', help='Google Apps Script webhook URL')
    parser.add_argument('--csv-file', help='CSV file to load data from')
    parser.add_argument('--json-file', help='JSON file to load data from')
    parser.add_argument('--export-csv', help='Export data to CSV file')
    parser.add_argument('--export-analysis', help='Export analysis to JSON file')
    parser.add_argument('--summary', action='store_true', help='Print data summary')
    
    args = parser.parse_args()
    
    # Initialize processor
    processor = HamroAwazDataProcessor(args.webhook_url)
    
    # Load data
    data_loaded = False
    if args.webhook_url:
        data_loaded = processor.load_data_from_webhook()
    elif args.csv_file:
        data_loaded = processor.load_data_from_csv(args.csv_file)
    elif args.json_file:
        data_loaded = processor.load_data_from_json(args.json_file)
    else:
        print("Please provide either --webhook-url, --csv-file, or --json-file")
        sys.exit(1)
    
    if not data_loaded:
        print("Failed to load data")
        sys.exit(1)
    
    # Print summary if requested
    if args.summary:
        processor.print_summary()
    
    # Export data if requested
    if args.export_csv:
        processor.export_to_csv(args.export_csv)
    
    if args.export_analysis:
        processor.export_analysis_to_json(args.export_analysis)

if __name__ == "__main__":
    main()
