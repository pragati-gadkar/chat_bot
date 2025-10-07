# Use a standard PHP Apache image as the base
FROM php:8.1-apache

# Set the working directory to the web root
WORKDIR /var/www/html

# --- FIX: INSTALL cURL DEPENDENCIES BEFORE INSTALLING THE PHP EXTENSION ---
# Update package lists and install the cURL development library
RUN apt-get update && \
    apt-get install -y libcurl4-openssl-dev && \
    rm -rf /var/lib/apt/lists/*
# -------------------------------------------------------------------------

# Copy all project files into the web root
COPY . /var/www/html

# Install the PHP cURL extension (this will now succeed)
RUN docker-php-ext-install curl