---
layout: false
---
<script setup>
import {ref} from "vue"

const showButton = ref(false)
</script>

<div style="padding: 30px; position: relative; height: 100vh; width: 100vw"> 
<button @click="showButton = true">First Button</button>
<button v-if="showButton">Second Button</button>
<div style="position: absolute; top:30px; left:30px; width: 500px;height: 500px;background: purple;text-align: center; font-size:20px"> There is a button behind me and another button that shows only if you click the first one </div>

</div>

<style>

button {
 border: 1px solid purple;
 margin: 30px;
 padding: 6px;
}
</style>