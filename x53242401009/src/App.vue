<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
}

ul, ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
  border: none;
  outline: none;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

#app {
  min-height: 100vh;
}
</style>
