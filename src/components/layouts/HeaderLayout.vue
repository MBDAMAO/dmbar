<template>
    <!-- HeaderLayout.vue -->
    <div class="header-layout">
        <header class="header">
            <nav class="navbar">
                <div class="logo">
                    <router-link to="/">YourLogo</router-link>
                </div>
                <ul class="nav-links">
                    <li><router-link to="/">Home</router-link></li>
                    <li><router-link to="/about">About</router-link></li>
                    <li><router-link to="/contact">Contact</router-link></li>
                </ul>
            </nav>
        </header>
        <main class="body-content">
            <router-view />
        </main>
    </div>
</template>

<script setup lang='ts'>
</script>

<style scoped>
.header-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.header {
    background-color: #343a40;
    color: white;
    padding: 0.5rem 1rem;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo a {
    text-decoration: none;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 1rem;
}

.nav-links a {
    text-decoration: none;
    color: white;
    font-size: 1rem;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #17a2b8;
}

.body-content {
    flex: 1;
    overflow: auto;
    padding: 1rem;
    background-color: #f8f9fa;
}
</style>