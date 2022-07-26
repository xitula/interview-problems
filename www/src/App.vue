<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

console.info('Talk is cheap. Show me the code. -- Linus Torvalds');
</script>

<template>
  <RouterLink
    class="nav-cell"
    to="/"
  >
    首页
  </RouterLink>
  <RouterLink
    class="nav-cell"
    to="/problem1"
  >
    问题1
  </RouterLink>
  <RouterView />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

/* .nav-cell {
  font-size: .16rem;
} */
</style>
