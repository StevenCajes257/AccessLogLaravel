# Use PHP 8.4-FPM
FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl \
 && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Copy all Laravel files first
WORKDIR /var/www
COPY . .

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Run composer install
RUN composer install --no-dev --optimize-autoloader

EXPOSE 9000
CMD ["php-fpm"]
