@echo off
start "" "%~dp0/Index.html"
"%~dp0/venv/Scripts/python" "%~dp0\Extract_features.py"
"%~dp0/venv/Scripts/python" "%~dp0\Api.py"
