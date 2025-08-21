FROM python:3.10-slim

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy frontend templates & static files into correct Flask dirs
COPY frontend/templates/ ./frontend/templates/
COPY frontend/static/ ./frontend/static/

# Create uploads directory (volume mount target)
RUN mkdir -p /app/uploads

# Expose Flask port
EXPOSE 5000

# Start backend app
CMD ["python", "backend/app.py"]
