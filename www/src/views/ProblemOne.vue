<script setup lang="ts"></script>
<template>
  <div class="wrap">
    <img
      class="avatar"
      src="../assets/jobs3.jpg"
      alt="Jobs"
    >
    <div class="info">
      <div class="motto">
        <p>Stay hungry, stay foolish.</p>
        <p>求知若渴，虚心若愚</p>
      </div>
      <div class="name-wrap">
        <p class="name">
          Steve Jobs
        </p>
        <p class="title">
          著名企业家，苹果公司创始人
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
p {
  text-align: start;
}

.wrap {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: flex-start;
  border-radius: 1.25rem;
  overflow: hidden;
  background-color: rgb(244, 244, 246);
  width: 37.5rem;
}

.avatar {
  width: 11.875rem;
  height: 13.75rem;
  overflow: hidden;
  flex-shrink: 0;
}

.info {
  color: rgb(50, 60, 75);
  font-size: 1.375rem;
}

.info>div {
  margin-left: 2.1875rem;
}

.motto {
  margin-top: 1.25rem;
  font-weight: bold;
}

.name-wrap {
  margin-top: 2.665rem;
}

.name {
  font-size: 0.8125rem;
}

.title {
  font-size: 0.9375rem;
  font-weight: 500;
}

@media screen and (max-width: 1024px) {
  p {
    text-align: center;
  }

  .wrap {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .info {
    margin-bottom: 1rem;
  }

  .info>div {
    margin-left: 0;
  }

  .avatar {
    margin-top: 2.1875rem;
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
  }
}
</style>
