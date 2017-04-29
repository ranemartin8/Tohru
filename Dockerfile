FROM ubuntu:zesty

RUN apt update
RUN apt upgrade -y
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash
RUN apt update
RUN apt install -y build-essential ffmpeg git python nodejs
RUN apt autoremove -y

RUN mkdir -p /usr/src/Tohru
WORKDIR /usr/src/Tohru

COPY . .

RUN npm install

ENV TOKEN= \
	COMMAND_PREFIX= \
	OWNERS= \
	DB= \
	REDIS= \
	REQUEST_CHANNEL= \
	ISSUE_CHANNEL= \
	ANNOUNCEMENT_CHANNEL=

CMD node Tohru.js
