# The official nodejs docker image
FROM node:14.8.0-alpine AS builder

WORKDIR /

COPY . .

RUN apk add --no-cache --virtual .gyp \
		python \
		make \
		g++ \
	&& npm install \
	&& apk del .gyp

RUN npm run build

WORKDIR /

EXPOSE 3000

CMD ["npm", "run", "start"]