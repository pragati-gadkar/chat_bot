# Use a standard PHP Apache image as the base
FROM php:8.1-apache

# Set the working directory to the web root
WORKDIR /var/www/html

# --- 1. INSTALL DEPENDENCIES & EXTENSIONS ---
RUN apt-get update && \
    apt-get install -y libcurl4-openssl-dev && \
    rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install curl

# --- 2. CRITICAL PHP HANDLER FIX (The Final Piece) ---
# Copy the custom Apache VHost configuration file
# This must be done before the files are copied over so we can use the config inside the container.
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2ensite 000-default.conf && a2dissite 000-default.conf

# --- 3. CONFIGURE WEB SERVER & PERMISSIONS ---
# Enable the Apache Rewrite Module 
RUN a2enmod rewrite

# CRITICAL FIX: Create and permission the writable directory for the CSV file
RUN mkdir -p /var/www/html/data && \
    chown -R www-data:www-data /var/www/html/data && \
    chmod -R 775 /var/www/html/data

# --- 4. COPY APPLICATION FILES & APPLY OWNERSHIP ---

# Copy all project files into the web root
COPY . /var/www/html

# Set correct ownership for all files
RUN chown -R www-data:www-data /var/www/html