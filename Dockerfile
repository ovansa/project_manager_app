FROM node:12

WORKDIR /project_manager_app

COPY package.json ./

RUN yarn install
# yarn install --frozen-lockfile -- in prod

COPY . .

EXPOSE 5000

CMD ["yarn", "dev-docker"]