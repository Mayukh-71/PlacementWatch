FROM node:22-bullseye

# Install Python
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy project
COPY . .

# Install Python dependencies
RUN pip3 install --upgrade pip && \
    pip3 install -r AI/requirement.txt

EXPOSE 3000

CMD ["npm", "start"]