<script setup>
import * as pkg from "survey-core";
import "survey-js-ui";
import "survey-core/defaultV2.min.css";
import { themeJson } from "./theme";
import { json } from "./json";
import { onMounted } from "vue";

const { Model } = pkg;

const survey = new Model(json);
survey.applyTheme(themeJson);

onMounted(() => {
  survey.render(document.getElementById("surveyElement"));
});
</script>
<template>
  <div id="surveyElement" width="100%" height="100%" />
</template>

<style>
#surveyElement
  > div
  > div
  > form
  > div
  > div.sv-components-row
  > div
  > div
  > div.sd-page.sd-body__page
  > div
  > div
  > div
  > div.sd-element__content.sd-question__content {
  min-height: 784px;
}
</style>
