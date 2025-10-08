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

# --- 3. COPY APPLICATION FILES & APPLY OWNERSHIP (CRITICAL FIXES) ---

# Copy all project files into the web root (This includes your 000-default.conf)
COPY . /var/www/html

# CRITICAL FIX B: Set correct ownership for all files
RUN chown -R www-data:www-data /var/www/html

# CRITICAL FIX C: Copy custom Apache config and enable it. 
# We copy the config from /var/www/html/000-default.conf 
# to the Apache directory and then enable it, disabling the default one.
RUN cp /var/www/html/000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2ensite 000-default.conf && a2dissite 000-default.conf

# Restart Apache (or rely on the default container CMD to start it with new config)