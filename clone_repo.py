#!/usr/bin/env python3
"""
Simple Git Repository Cloner
This script provides functionality to clone Git repositories.
"""

import os
import sys
import subprocess
import re


def is_valid_git_url(url):
    """
    Validate if the provided string is a valid Git repository URL.
    
    Args:
        url (str): The URL to validate
    
    Returns:
        bool: True if URL is valid, False otherwise
    """
    # Pattern for common Git URL formats
    # Supports: https://, http://, git://, ssh (git@), and file://
    git_url_pattern = re.compile(
        r'^(https?://|git://|git@|file://|ssh://)'
        r'[^\s;|&$()<>]+\.git$|'
        r'^(https?://|git://|git@|file://|ssh://)'
        r'[^\s;|&$()<>]+$'
    )
    
    # Check for potentially dangerous characters
    if any(char in url for char in [';', '|', '&', '$', '(', ')', '<', '>', '`', '\n', '\r']):
        return False
    
    return bool(git_url_pattern.match(url))


def clone_repository(repo_url, destination=None):
    """
    Clone a Git repository from the given URL.
    
    Args:
        repo_url (str): The URL of the Git repository to clone
        destination (str, optional): The destination directory for the cloned repository
    
    Returns:
        bool: True if cloning was successful, False otherwise
    """
    # Validate the repository URL
    if not is_valid_git_url(repo_url):
        print(f"Error: Invalid or potentially unsafe repository URL: {repo_url}", file=sys.stderr)
        return False
    
    try:
        # Build the clone command
        cmd = ["git", "clone", repo_url]
        
        if destination:
            cmd.append(destination)
        
        # Execute the clone command
        print(f"Cloning repository from {repo_url}...")
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        
        print("Repository cloned successfully!")
        if result.stdout:
            print(result.stdout)
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"Error cloning repository: {e}", file=sys.stderr)
        if e.stderr:
            print(e.stderr, file=sys.stderr)
        return False
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        return False


def main():
    """Main function to handle command-line arguments."""
    if len(sys.argv) < 2:
        print("Usage: python3 clone_repo.py <repository_url> [destination]")
        print("\nExample:")
        print("  python3 clone_repo.py https://github.com/user/repo.git")
        print("  python3 clone_repo.py https://github.com/user/repo.git my-folder")
        sys.exit(1)
    
    repo_url = sys.argv[1]
    destination = sys.argv[2] if len(sys.argv) > 2 else None
    
    success = clone_repository(repo_url, destination)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
