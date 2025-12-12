<script setup>
import TheHeader from '../components/TheHeader.vue'
</script>

<template>
    <div class="contact-view">
        <TheHeader />
        <div class="contact-card">
            <h1>Contact</h1>
            <p>Un problème ? Une suggestion ? Une envie de dire bonjour ?</p>
            <p>Envoyez un mail à : <a href="mailto:contact@horaire.com">contact@horaire.com</a></p>
            <p>(Ou contactez le créateur directement si vous le connaissez !)</p>
        </div>
    </div>
</template>

<style scoped>
.contact-view {
    min-height: 100vh;
    color: white;
    display: flex;
    flex-direction: column;
}

.contact-card {
    background-color: rgba(30, 41, 59, 0.8);
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 12px;
    max-width: 600px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
    color: #60a5fa;
    margin-bottom: 2rem;
}

a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: bold;
}

a:hover {
    text-decoration: underline;
}
</style>
