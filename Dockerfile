FROM node:21.6.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install

# Bundle app source
COPY . /usr/src/app

ENV MONGODB_URI = "mongodb://127.0.0.1:27017/"

ENV SESSION_DURATION = 6000000

ENV DBNAME = "KCMKI"

ENV DOCKERENV = "true"

EXPOSE 3000

CMD [ "npm", "run","dev" ]