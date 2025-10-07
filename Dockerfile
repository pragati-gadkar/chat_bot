# Use a standard PHP Apache image as the base
FROM php:8.1-apache

# Set the working directory to the web root
WORKDIR /var/www/html

# Copy all project files into the web root
COPY . /var/www/html

# The standard PHP Apache image is usually configured to start the web server
# You can ensure the required PHP extensions are installed for cURL, though they are often default
RUN docker-php-ext-install curl