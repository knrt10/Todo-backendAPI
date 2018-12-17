FROM node:8

# Install gulp and pm2 globaly
RUN npm install --quiet -g gulp pm2

# Create app directory
RUN mkdir -p /usr/src/

WORKDIR /usr/src/

# Install app dependencies
COPY package.json /usr/src/

RUN npm install --quiet

# Bundle app source
COPY . /usr/src

# Build the project
RUN npm run build

WORKDIR /usr/src/dist

EXPOSE 4895
EXPOSE 5858
CMD ["pm2-docker", "process.yml"]
