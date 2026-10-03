# ZAYA Atelier — Dossier Commercial & Rapport de Cession Clé en Main

**Projet** : ZAYA Atelier | Boutique E-Commerce de Mode & Haute Confection Algérienne  
**Statut de Cession** : 100% Prêt à la Vente & à l'Exploitation Immédiate (Turnkey Ready)  
**Date d'Audit** : Octobre 2026  
**Marché Cible** : Algérie (58 Wilayas) & Maghreb  

---

## 1. Vue d'Ensemble & Positionnement Commercial

**ZAYA Atelier** est une plateforme e-commerce moderne, rapide et autonome, spécialement conçue pour répondre aux réalités du marché algérien :
- **Design Épuré & Haute Conversion** : Interface sobre, élégante et sans distraction superflue, permettant aux clientes de trouver leur article et de commander en moins de 30 secondes.
- **Zéro Coût d'Abonnement Cloud (0 $/mois)** : Fonctionne sur un moteur de base de données local persistant avec sauvegardes automatiques. Aucun abonnement récurrent obligatoire (contrairement à Shopify ou aux bases SaaS payantes).
- **Parcours d'Achat Algérien Natif** : Intégration complète du Paiement à la Livraison (**Cash-on-Delivery**), de **BaridiMob (Algérie Poste)**, des cartes **Edahabia / CIB**, et du routage direct sur **WhatsApp**.

---

## 2. Fonctionnalités Clés pour le Client & l'Acheteur

### A. Expérience Client (Front-Office)
1. **Recherche Instantanée & Filtres Rapides (Fast-Finder)** :
   - Recherche en direct par mot-clé (*lin, caftan, blazer, soie, couleur...*).
   - Onglets de catégories en 1 clic (*Tous les Modèles, Caftans & Soirée, Chemises en Lin, Vestes & Blazers, Pantalons & Ensembles, Robes Fluides, Maroquinerie*).
   - Tri dynamique par nouveautés et par prix croissant/décroissant en Dinars Algériens (DA).
2. **Calculateur de Livraison 58 Wilayas** :
   - Liste officielle complète des 58 Wilayas algériennes avec sélecteur de commune.
   - Calcul automatique et transparent des frais de port à domicile et en point relais (*Yalidine / ZR Express*).
3. **Paiement Multi-Canal DZ** :
   - **Espèces à la Livraison (COD)** : Le mode préféré de 90% des acheteurs en Algérie.
   - **BaridiMob / CCP** : Affichage et copie en 1 clic du RIP officiel (20 chiffres) et du numéro CCP pour virement rapide.
   - **Cartes Edahabia & CIB** : Interface de saisie de carte avec simulation de validation SMS 3D Secure (SATIM).
4. **Bilinguisme Intégral (Français / العربية)** :
   - Bascule instantanée de la langue avec prise en charge complète du sens de lecture droite-à-gauche (**RTL**).
5. **Commande Directe par WhatsApp** :
   - Bouton présent sur chaque fiche article pour commander directement via message pré-rempli auprès du service client.
6. **Suivi de Colis Sans Connexion** :
   - Les clientes peuvent suivre l'état de préparation et d'expédition de leur commande en saisissant simplement leur numéro de commande et leur numéro de téléphone.

---

### B. Espace d'Administration & Back-Office (Pour le Propriétaire)
1. **Tableau de Bord des Ventes & Statistiques en Direct** :
   - Chiffre d'affaires total en Dinars (DA), nombre de commandes, panier moyen, et répartition par wilaya.
2. **Gestion Complète des Commandes** :
   - Suivi des statuts (*En attente*, *Confirmée*, *En préparation*, *Expédiée*, *Livrée*, *Annulée*).
   - Ajout de notes internes de suivi et historique des modifications.
3. **Gestion du Catalogue & des Stocks** :
   - Fiches produits détaillées avec variantes (tailles, couleurs, matières).
   - Alertes automatiques de stock faible et déduction en temps réel lors des commandes.
4. **Générateur de Codes Promotionnels** :
   - Création de réductions en pourcentage ou en montant fixe (DA) avec montant minimum d'achat.
5. **Gestion de la Relation Client (CRM)** :
   - Fiches clientes, historique d'achats et segmentation fidélité (*Membre, Privilège, VIP Atelier*).

---

## 3. Outils de Transmission Inclus (Pour le Nouveau Propriétaire)

Le site intègre des outils développés sur mesure pour faciliter la cession au repreneur :
1. **Outil de Changement de Mot de Passe Maître** :
   - Le repreneur peut modifier le mot de passe administrateur directement depuis l'interface sécurisée (`POST /api/auth/change-password`), sans toucher au code source.
2. **Export Complet de la Boutique en 1 Clic** :
   - Téléchargement instantané d'une archive JSON complète de toutes les données (`GET /api/system/export`).
3. **Bouton de Réinitialisation Démo (Prêt pour le Jour 1)** :
   - Purge en un clic des commandes tests d'audit pour livrer une boutique propre et vierge à l'acheteur.

---

## 4. Architecture Technique & Sécurité

| Composant | Technologie | Détail & Rôle |
| :--- | :--- | :--- |
| **Front-End** | React 18, TypeScript, Tailwind CSS | Interface ultra-rapide, responsive mobile-first. |
| **Serveur Backend** | Node.js, Express, TypeScript | API REST stricte avec validation serveur des prix et des stocks. |
| **Base de Données** | JSON Persistant Atomique (`data/db.json`) | Écritures atomiques (`db.json.tmp` $\to$ `db.json`) avec sauvegardes tournantes dans `data/backups/`. Zéro coût cloud récurrent. |
| **Chiffrement** | Node.js `crypto.scryptSync` | Mots de passe protégés par un sel cryptographique aléatoire de 16 octets. Aucun mot de passe en clair. |
| **Anti-Brute-Force** | Rate Limiter IP en mémoire | Blocage de l'adresse IP après 5 tentatives infructueuses pendant 15 minutes. |
| **Sécurité HTTP** | En-têtes de protection | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`. |
| **Conformité Réglementaire** | Loi Algérienne 18-07 | Protection et isolation stricte des données personnelles des clientes. |

---

## 5. Identifiants de Remise & Démarrage Rapide

- **URL de la Boutique** : Accessible en ligne (Partageable directement aux clients)
- **Accès Administrateur** : Cliquer sur l'icône de cadenas en pied de page ou naviguer vers `/sign-in`
- **Email Administrateur par Défaut** : `admin@zaya.dz`
- **Mot de Passe Administrateur par Défaut** : `AdminZaya2026!`
- **Téléphone WhatsApp Boutique Pré-configuré** : `0550 00 11 22`

---

## 6. Conclusion de l'Audit

Le site **ZAYA Atelier** est un actif commercial clé en main, prêt à être vendu et déployé immédiatement auprès d'un entrepreneur, d'une maison de haute couture ou d'une boutique physique souhaitant développer ses ventes en ligne sur l'ensemble du territoire algérien.
