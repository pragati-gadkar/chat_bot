# Use a standard PHP Apache image as the base
FROM php:8.1-apache

# Set the working directory to the web root
WORKDIR /var/www/html

# --- 1. INSTALL DEPENDENCIES & EXTENSIONS ---
RUN apt-get update && \
    apt-get install -y libcurl4-openssl-dev && \
    rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install curl

# --- 2. CONFIGURE WEB SERVER & PERMISSIONS (CRITICAL FIXES) ---

# Enable the Apache Rewrite Module 
RUN a2enmod rewrite

# CRITICAL FIX A: Create and permission the writable directory for the CSV file
RUN mkdir -p /var/www/html/data && \
    chown -R www-data:www-data /var/www/html/data && \
    chmod -R 775 /var/www/html/data

# --- 3. COPY APPLICATION FILES & APPLY OWNERSHIP ---

# Copy all project files, including 000-default.conf and .htaccess, to the web root
COPY . /var/www/html

# CRITICAL FIX B: Set correct ownership for all files
RUN chown -R www-data:www-data /var/www/html

# CRITICAL FIX C: Copy the custom Apache config file to the correct location and enable it.
# NOTE: The default configuration is in sites-enabled, which points to sites-available.
# We copy the new config file and then enable it.
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2ensite 000-default.conf && a2dissite 000-default.conf # Disable the default config, enable ours