<script setup>
import { Model } from "survey-core";
import "survey-js-ui";
import "survey-core/defaultV2.min.css";
import { themeJson } from "./theme";
import { json } from "./json";
import { onMounted } from "vue";

const survey = new Model(json);
survey.applyTheme(themeJson);

onMounted(() => {
  survey.render(document.getElementById("surveyElement"));
});
</script>
<template>
  <div
    id="surveyElement"
    width="100%"
    height="100%"
  />
</template>
