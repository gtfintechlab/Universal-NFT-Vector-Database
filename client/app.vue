<template>
  <div class="container">
    <Sidebar id="sidebar" />
    <NuxtPage class="inner-container" />
  </div>
</template>

<style lang="scss">
body{
   background: #f1f1f4;
}
// 2 rem to account for padding, 300px = width of sidebar
$margin-width: calc(2rem + 260px);
.inner-container {
  margin-left: $margin-width;
}

@font-face {
  font-family: "Outfit";
  src: local("Outfit"),   url("./static/fonts/Outfit.ttf") format("truetype");
}

@font-face {
  font-family: "Inter";
  src: local("Inter"),   url("./static/fonts/Inter.ttf") format("truetype");
}

html, body {
  margin: 0px !important;
  padding: 0px !important;
}
</style>
