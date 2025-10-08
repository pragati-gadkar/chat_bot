# Use a standard PHP Apache image as the base
FROM php:8.1-apache

# Set the working directory to the web root
WORKDIR /var/www/html

# --- 1. INSTALL DEPENDENCIES ---
# Update package lists and install the cURL development library
RUN apt-get update && \
    apt-get install -y libcurl4-openssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Install the PHP cURL extension
RUN docker-php-ext-install curl

# --- 2. CONFIGURE WEB SERVER ---
# Enable the Apache Rewrite Module (essential for routing and .htaccess support)
RUN a2enmod rewrite

# NOTE: The default php:8.1-apache configuration needs to be told to allow
# .htaccess files to be processed if you were to use them, but the 'a2enmod rewrite'
# is often enough to resolve simple file access issues.

# --- 3. COPY APPLICATION FILES ---
# Copy all project files into the web root
COPY . /var/www/html

# The base image's default command (CMD ["apache2-foreground"]) will automatically
# start the server and serve the files from /var/www/html, which is correct.