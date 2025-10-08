# Use a standard PHP Apache image as the base
FROM php:8.1-apache

# Set the working directory to the web root
WORKDIR /var/www/html

# --- 1. INSTALL DEPENDENCIES & EXTENSIONS ---

# Update package lists and install the cURL development library (libcurl4-openssl-dev)
# This is necessary to build the PHP cURL extension later.
RUN apt-get update && \
    apt-get install -y libcurl4-openssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Install the PHP cURL extension
RUN docker-php-ext-install curl

# --- 2. CONFIGURE WEB SERVER & PERMISSIONS (CRITICAL FIXES) ---

# Enable the Apache Rewrite Module (aids in serving files like .htaccess)
RUN a2enmod rewrite

# CRITICAL FIX A: Create a separate directory for writing appointments and set permissions
# This prevents permission denied errors when save_appointment.php tries to write the CSV.
RUN mkdir -p /var/www/html/data && \
    chown -R www-data:www-data /var/www/html/data && \
    chmod -R 775 /var/www/html/data

# --- 3. COPY APPLICATION FILES & SET OWNERSHIP ---

# Copy all project files into the web root
COPY . /var/www/html

# CRITICAL FIX B: Set correct ownership so the Apache user (www-data) can read/execute all files
RUN chown -R www-data:www-data /var/www/html

# Final command inherited from base image will start Apache and serve the PHP files.