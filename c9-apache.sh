#! /bin/bash

# sed -i "s|^Listen 80$|Listen 8080|" /etc/apache2/ports.conf
# sed -i "s|<VirtualHost \*:80>|<VirtualHost *:8080>|" /etc/apache2/sites-enabled/000-default.conf
# doc root (add /web for craft)
# sed -i "s|/var/www/html|/home/ubuntu/environment/|" /etc/apache2/sites-enabled/000-default.conf
#directory
cat >> /etc/apache2/apache2.conf << END

<Directory /home/ubuntu/environment/>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
</Directory>
END
# a2enmod rewrite
# service apache2 restart