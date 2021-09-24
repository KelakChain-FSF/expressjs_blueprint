FROM node:16.10.0-alpine AS alpine

# Here be stuff..
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
#CMD ["npm", "run" , "start-server"]
CMD ["npm", "run" , "dev"]
