<template>
  <LegalLayout title="Gestion des cookies" subtitle="Le rôle des cookies et du stockage local sur Parentia.">
    <h2>Qu'est-ce qu'un cookie ?</h2>
    <p>Un cookie est un petit fichier déposé sur votre appareil. Parentia utilise principalement le <strong>stockage local</strong> du navigateur pour mémoriser votre session.</p>

    <h2>Cookies utilisés</h2>
    <ul>
      <li><strong>Essentiels</strong> : conservation de votre connexion (jeton et profil) pour ne pas vous redemander vos identifiants à chaque page.</li>
      <li><strong>Préférences</strong> : mémorisation de petits réglages d'affichage.</li>
    </ul>
    <p>Parentia n'utilise pas de cookies publicitaires ni de traceurs tiers.</p>

    <h2>Gérer les cookies</h2>
    <p>Vous pouvez à tout moment vider le stockage local et les cookies depuis les paramètres de votre navigateur. La déconnexion supprime également les données de session conservées.</p>
  </LegalLayout>
</template>

<script setup>
import LegalLayout from '../components/LegalLayout.vue'
</script>
