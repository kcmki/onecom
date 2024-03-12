FROM node:21.6.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install

# Bundle app source
COPY . /usr/src/app

ENV MONGODB_URI "mongodb://owner:owner127@mongo:27017/"

CMD [ "npm", "run","dev" ]