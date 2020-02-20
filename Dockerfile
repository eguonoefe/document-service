FROM node:10

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install --silent

COPY ./database-migration.sh /usr/src/app/database-migration.sh
# Make wait script an executable
RUN chmod +x /usr/src/app/database-migration.sh

CMD ["npm", "run", "dev"]
