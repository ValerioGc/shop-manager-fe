<template>
  <div class="section-title-container">
    <slot class="section-title"></slot>
  </div>
</template>

<style lang="scss">

  .section-title-container {
    & > h1, h2, h3, h4, h5 {
      padding: 1rem 0 1rem 0;  
      font-weight: bold;
      color: var(--secondary-color);
    }
  }
  
</style>
