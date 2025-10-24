FROM python:3.9-slim

# Install curl so the healthcheck can run
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001

# Healthcheck with grace period
HEALTHCHECK --interval=30s --timeout=10s --retries=5 --start-period=15s \
  CMD curl --fail http://localhost:5001/health || exit 1

CMD ["python", "app.py"]