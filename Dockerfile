# Use a standard PHP Apache image as the base
FROM php:8.1-apache

# Set the working directory to the web root
WORKDIR /var/www/html

# --- 1. INSTALL DEPENDENCIES & EXTENSIONS ---
RUN apt-get update && \
    apt-get install -y libcurl4-openssl-dev && \
    rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install curl

# --- 2. CONFIGURE WEB SERVER & PERMISSIONS ---

# Enable the Apache Rewrite Module 
RUN a2enmod rewrite

# CRITICAL FIX A: Create and permission the writable directory for the CSV file
RUN mkdir -p /var/www/html/data && \
    chown -R www-data:www-data /var/www/html/data && \
    chmod -R 775 /var/www/html/data

# CRITICAL FIX B: Disable the default Apache configuration site (000-default.conf)
# This prevents the container from reverting to settings that block our APIs.
RUN a2dissite 000-default.conf

# --- 3. COPY APPLICATION FILES & APPLY OWNERSHIP ---

# Copy all project files into the web root
COPY . /var/www/html

# Set correct ownership for all files
RUN chown -R www-data:www-data /var/www/html