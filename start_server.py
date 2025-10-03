#!/usr/bin/env python3
"""
Simple HTTP Server for Offline Examination System
Serves the examination system on localhost for testing
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Configuration
PORT = 8080
DIRECTORY = "."

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

        # Cache control for YAML files
        if self.path.endswith('.yaml'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')

        super().end_headers()

def main():
    # Change to the script directory
    script_dir = Path(__file__).parent.absolute()
    os.chdir(script_dir)

    # Check if we're in the right directory
    if not Path("index.html").exists():
        print("Error: index.html not found in current directory")
        print(f"Current directory: {os.getcwd()}")
        print("Please run this script from the examination system directory")
        sys.exit(1)

    # Start the server
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 Offline Examination System Server")
        print(f"📂 Serving directory: {os.getcwd()}")
        print(f"🌐 Server URL: http://localhost:{PORT}")
        print(f"📋 Open the URL in your browser to access the examination system")
        print(f"⏹️  Press Ctrl+C to stop the server")
        print("-" * 60)

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")
            httpd.shutdown()

if __name__ == "__main__":
    main()
