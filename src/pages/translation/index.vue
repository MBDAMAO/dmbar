<template>
    <div class="translator">
        <h1>Text Translator</h1>
        <textarea v-model="inputText" placeholder="Enter text to translate" rows="4" cols="50"></textarea>
        <button @click="translateText">Translate</button>

        <div v-if="translatedText">
            <h3>Translated Text:</h3>
            <p>{{ translatedText }}</p>
        </div>

        <div v-if="errorMessage" class="error">
            <p>{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { translate } from "google-translate-api-browser";

// Reactive variables
const inputText = ref<string>("");
const translatedText = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

// Translate function
const translateText = async () => {
    try {
        const response = await translate(inputText.value, { to: "en", corsUrl: "http://cors-anywhere.herokuapp.com/" });
        translatedText.value = response.text; // Set the translated text
        errorMessage.value = null; // Clear any previous errors
    } catch (error) {
        errorMessage.value = "Translation failed. Please try again later."; // Display error message
        translatedText.value = null; // Clear previous translations
    }
};
</script>

<style scoped>
.translator {
    text-align: center;
    margin: 20px;
}

textarea {
    width: 80%;
    padding: 10px;
    margin-bottom: 10px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
}

button:hover {
    background-color: #007bff;
    color: white;
}

.error {
    color: red;
    margin-top: 20px;
}
</style>