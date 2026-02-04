FROM nginx:stable-alpine

# Custom nginx config that proxies API + socket.io to backend
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy static frontend files
COPY public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
