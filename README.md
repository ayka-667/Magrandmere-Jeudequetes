# Ma grand mère 👵

Bienvenue sur un projet interactif qui te permet de discuter avec une mamie virtuelle pleine de sagesse et de tendresse ! Explore des quêtes simples, joue à des mini-jeux et reçois des conseils de ta mamie numérique.

# Fonctionnalités ✨

- **Chat interactif avec Mamie** : Pose-lui des questions, reçois des conseils de vie ou d'informatique, et écoute ses anecdotes. Mamie répond de manière concise et affectueuse.
- **Quêtes et mini-jeux** : Accomplis de petites tâches comme "Accepter les cookies", "Donner un câlin" ou "Jouer à Pierre-Feuille-Ciseaux".
- **Personnalisation** : Mamie connaît ton prénom et s'adapte à toi !
- **Thèmes** : Bascule entre le mode clair et le mode sombre pour une expérience visuelle personnalisée.

# Technologies Utilisées 🛠️

- **Frontend** : HTML, CSS, JavaScript
- **Backend** : Node.js (Express.js)
- **IA** : Google Gemini API (via `gemini-2.5-flash`)
- **Gestionnaire de Processus** : PM2
- **Serveur Web** : Nginx

# Installation et Lancement du Projet 🚀

Suis ces étapes pour installer et lancer le projet sur ton serveur.

# Pré-requis

Assure-toi d'avoir les éléments suivants installés sur ton serveur :

- **Node.js et npm** :
```
sudo apt update
sudo apt install nodejs npm
```
- **Nginx** :
```
sudo apt install nginx
```
- **PM2** : (Gestionnaire de processus Node.js)
```
sudo npm install -g pm2
```
- **Accès SSH** à ton serveur.
- Un **enregistrement DNS** `A` pour `exemple.com` pointant vers l'**adresse IP publique de ton serveur**.

# **1. Préparation du Projet**
1. **Clone le dépot** sur tno serveur, ou transfère les fichier de ton projet (si tu ne l'as pas déjà fait dans `/var/www/magrandmere`):
```
# Exemple si tu clones directement depuis GitHub sur le serveur
sudo mkdir -p /var/www/ayka
sudo chown $USER:$USER /var/www/ayka # Assure-toi d'avoir les droits
cd /var/www/ayka
git clone https://github.com/ton_nom_utilisateur/Mamie-IA.git ma-grand-mere
```
Ou si tu copies localement :
```
# Depuis ton ordinateur local (ton PC)
scp -r /chemin/vers/ton/dossier/ma-grand-mere user@ton_adresse_ip_serveur:/var/www/magrandmere/
```
2. **Navigue vers le dossier du projet** sur le serveur :
```
cd /var/www/magrandmere
```
3. **Installe les dépendances Node.js** :
```
npm install
```
4. **Crée ton fichier** `.env` à la racine du projet (`/var/www/magrandmere/.env`) et ajoute ta clé API Gemini :
```
GEMINI_API_KEY=
```

# **2. Lancement de l'Application Node.js avec PM2**
PM2 maintiendra ton `server.js` en ligne en permanence.
1. **Démarre ton application :
```
pm2 start serveur.js --name "magrandmere"
```
2. **Vérifie que l'application tourne :**
```
pm2 list
```
Tu devrais voir `magrandmere` avec un statut `online`.
3. **Configure PM2 pour un démarrage automatique** au redémarrage du serveur :
```
pm2 startup systemd
pm2 save
```

# **3. Configuration de Nginx**

Nginx va servir tes fichiers statiques et agir comme un proxy pour les requêtes API vers ton application Node.js.
1. **Crée le fichier de configuration Nginx** pour ton domaine :
```
sudo nano /etc/nginx/sites-available/exemple.com
```
2. **Colle la configuration suivante** :
```
server {
    listen 80;
    listen [::]:80;
    server_name exemple.com;

    root /var/www/magrandmere/public;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api {
        proxy_pass http://localhost:3000; # Le port où tourne ton server.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
3. **Enregistre et ferme** le fichier (`Ctrl+X`, `Y`, `Entrée`).
4. **Active la configuration** en créant un lien symbolique :
```
sudo ln -s /etc/nginx/sites-available/exemple.com /etc/nginx/sites-enabled/
```
5. **Teste la configuration Nginx** pour les erreurs :
```
sudo nginx -t
```
Assure-toi de voir `syntax is ok` et `test is successful`.
6. **Redémarre Nginx** pour appliquer les changements :
```
sudo systemctl restart nginx
```

# **4. Activation HTTPS avec Certbot (Fortement Recommandé)**

Sécurise ton site avec un certificat SSL/TLS gratuit de Let's Encrypt.

1. **Installe Certbot et le plugin Nginx** :
```
sudo apt install certbot python3-certbot-nginx
```
2. **Exécute Certbot** :
```
sudo certbot --nginx -d exemple.com
```
Suis les instructions. On te demandera ton email et si tu veux rediriger tout le trafic HTTP vers HTTPS (choisis l'option `2`).

# Contribuer 🤔
Ce projet est développé par Ayka. Pour toute question, suggestion ou contribution, n'hésite pas à ouvrir une issue ou à soumettre une pull request sur ce dépôt GitHub !
