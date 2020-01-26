# Grailed Monitor
This is a pretty basic monitor to get live updates when a product is updated or is listed on https://grailed.com.

## Requirements
- MongoDB
- Node
- Docker #optional

## Setup NodeJS
- `cd /app`
- Edit the config file in `/app/config.js`
- `npm install`
- `npm run start`

## Setup Docker
- Edit the config file in `/app/config.js`
- Start a mongodb instance using `docker run -d -p 27017:27017 mongo:4.2`
- `docker build .`
- `docker run -d <IMAGE-NAME>`

## Todo
- Make the query value in config nicer 😆
- 🤷🏾‍♂️