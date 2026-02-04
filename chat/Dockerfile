FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app sources
COPY . .

EXPOSE 4000

CMD ["npm", "start"]
