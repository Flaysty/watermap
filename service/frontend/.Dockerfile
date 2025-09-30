FROM nginx:stable

RUN apt-get update && apt-get install -y \
    curl \
    nano \
    mc \
  && rm -rf /var/lib/apt/lists/*

#COPY ./service/frontend/www /usr/share/nginx/html

#EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
