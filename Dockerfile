# Use a standard PHP Apache image as the base
FROM php:8.1-apache

# Set the working directory to the web root
WORKDIR /var/www/html

# Update package lists and install the cURL development library
# NOTE: Keeping this for consistency, but often the base image has a simple way to enable it.
RUN apt-get update && \
    apt-get install -y libcurl4-openssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy all project files into the web root
COPY . /var/www/html

# Install the PHP cURL extension
RUN docker-php-ext-install curl

# The ENTRYPOINT and CMD commands are inherited from the base image (php:8.1-apache),
# which is designed to automatically start Apache and serve files in /var/www/html.
# We do not need a custom START COMMAND or CMD here.