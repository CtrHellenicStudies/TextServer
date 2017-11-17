FROM node:8-wheezy

RUN mkdir /app
COPY . /app/.
WORKDIR /app
RUN npm i -g yarn
RUN yarn add serve
RUN yarn add pm2
RUN yarn pm2 install pm2-logrotate

CMD ["yarn", "execute"]
