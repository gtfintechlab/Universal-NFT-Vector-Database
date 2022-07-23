<template>
  <div class="container">
    <Sidebar id="sidebar" />
    <NuxtPage class="inner-container" />
  </div>
</template>

<style lang="scss">

// Probably a better way to do this -- fix later
.inner-container {
  margin-left: 340px;
}

@font-face {
  font-family: "Outfit";
  src: local("Outfit"),   url("./assets/fonts/Outfit-Regular.ttf") format("truetype");
}

html, body {
  margin: 0px !important;
  padding: 0px !important;
}
  </style>
