<template>
    <div style="display: flex; height: 100%; width: 100%;">
        <div id="left">
            <div id="left-up">
                here is left up
            </div>
            <div id="left-down">
                here is left down
            </div>
        </div>
        <div id="right">
            here is right
        </div>
    </div>
</template>
<script setup lang='ts'>
</script>
<style scoped>
#left {
    width: 50%;
    height: 100%;
    float: left;
    background-color: aliceblue;
}

#right {
    width: 50%;
    height: 100%;
    float: left;
    background-color: antiquewhite;
}

#left-up {
    display: flex;
    flex-direction: column;
}
</style>