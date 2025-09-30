FROM python:3.13.7

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    nano \
    mc

#COPY ./server /home/backend/server
RUN mkdir -p /home/backend/server
COPY ./server/requirements.txt /home/backend/server/requirements.txt
WORKDIR /home/backend/server

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt
