<template>
    <Base :name="'App Version'" :sub="'Current version: v' + appVersion" @click="fetch()">

    <template v-slot:right>
        <div class="flex items-center">
            <el-tag disable-transitions v-show="fetchStatus == 'isupdate'" type="primary">已是最新版本</el-tag>
            <el-tag disable-transitions v-show="fetchStatus == 'haveupdate'" type="success">
                下载 {{ newVersion }}</el-tag>
            <el-tag disable-transitions v-show="fetchStatus == 'unfetched'" type="info">点击获取更新</el-tag>
            <el-tag disable-transitions v-show="fetchStatus == 'fetching'" type="warning">正在获取更新</el-tag>
            <el-tag disable-transitions v-show="fetchStatus == 'error'" type="danger">获取更新失败</el-tag>
        </div>
    </template>
    </Base>
</template>
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Base from './Base.vue';
import { fetchUpdate, getVersion } from '@/apis/other';
import { open } from '@tauri-apps/plugin-shell';
let downLoadUrl: string;
const appVersion = ref("")
const newVersion = ref("");
let fetchStatus = ref("unfetched");

function fetch() {
    if (fetchStatus.value == 'haveupdate') {
        openExternalBrowser(downLoadUrl);
        return;
    }
    if (fetchStatus.value != 'unfetched') return;
    fetchStatus.value = "fetching";
    fetchUpdate().then(async (res) => {
        if (res.status != 200) {
            fetchStatus.value = "error";
            return;
        }
        console.log(res.body);
        const githubTag = res.body.tag_name;
        const appVersionParts = appVersion.value.split('.').map(Number);
        const githubVersionParts = githubTag.replace(/^v/, '').split('.').map(Number);
        for (let i = 0; i < appVersionParts.length; i++) {
            if (appVersionParts[i] < githubVersionParts[i]) {
                fetchStatus.value = "haveupdate";
                newVersion.value = githubTag;
                for (const asset of res.body.assets) {
                    if (asset.name == 'app-universal-release.apk') {
                        downLoadUrl = asset.browser_download_url;
                        break;
                    }
                }
                return;
            } else if (appVersionParts[i] > githubVersionParts[i]) {
                fetchStatus.value = "isupdate";
                return;
            }
        }
        fetchStatus.value = "isupdate";
        return;
    }).catch(() => {
        fetchStatus.value = "error";
    }).finally(() => {
    })
}
async function openExternalBrowser(url: string) {
    try {
        open(url);
    } catch (error) {
        console.error('打开浏览器失败:', error);
    }
}
onMounted(async () => {
    appVersion.value = await getVersion();
})
</script>
<style scoped></style>