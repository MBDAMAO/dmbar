<template>
    <div class="videoContainer">
        <div class="pre-back"></div>
        <div class="shadow"></div>
        <div class="test"></div>
        <div class="background">
            <canvas id="canvas" class="canvas" ref="canvas"></canvas>
        </div>
        <div class="vbox">
            <div class="expand" @click="showSide()" v-show="!showside">
                <Expand />
            </div>
            <div class="topPlay" @click="change()" v-show="!playing">
                <Pause />
            </div>
            <div class="details">

            </div>
            <div class="sideBar">
                <div class="headimg">
                    <img class="himg" />
                    <AddFollow></AddFollow>
                </div>
                <div class="like" v-on:click="like()">
                    <LikeIcon ref="likeButton" class="icon1"></LikeIcon>
                    <div class="numinfo">{{ }}</div>
                </div>
                <div class="comment" v-on:click="openComment()">
                    <Comment />
                    <div class="numinfo"></div>
                </div>
                <div class="save" v-on:click="save()">
                    <SaveStar></SaveStar>
                    <div class="numinfo"></div>
                </div>
                <div class="share">
                    <svg-share />
                    <div class="numinfo">{</div>
                </div>
                <div class="more" v-on:click="openMoreSide()">
                    <SvgVideoWindow />
                    <div class="numinfo">看相关</div>
                </div>
                <div class="other">
                    <Dotx3 />
                </div>
            </div>

            <div class="videoBlock">
                <video class="videoEntity" ref="video" @click="change()" @timeupdate="update()">
                </video>
                <div class="controller">
                    <div class="progressBar" @click="tapProgressBar" ref="progressBar">
                        <div class="progressBackground">
                            <div class="progressNow" ref="progressNow"></div>
                        </div>
                    </div>
                    <div class="controlItems">
                        <div class="left">
                            <div class="playButton" v-on:click="change()">
                                <Pause2 v-show="!playing" />
                                <Play v-show="playing"></Play>
                            </div>
                            <div class="timeDetails">{{ timeNow }} / {{ duration }}</div>
                        </div>
                        <div class="right"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sideInfo" v-if="showside">
            <VideoSide @close-event="showSide()" @changeStatus="(p: number) => changeStatus(p)" :status="sideStatus"
                :vid="props.modal?.feed_item_id"></VideoSide>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import flvjs from 'flv.js';
const canvas = ref();
const video = ref<HTMLVideoElement | null>(null);
function draw() {
    const context = canvas.value.getContext("2d");
    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;
    console.log(video.value.videoWidth)
    context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
    canvas.value.style.scale = 1.6;
    canvas.value.style.filter = "blur(30px)";
}
onMounted(() => {
    if (video.value && flvjs.isSupported()) {
        const player = flvjs.createPlayer({
            type: 'flv',
            url: 'https://d1--cn-gotcha04.bilivideo.com/live-bvc/557317/live_3493137471244811_86205246.flv?expires=1733502774&len=0&oi=3525928160&pt=web&qn=10000&trid=10006a6145691f7d889d69b6e962b3675319&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=cn-gotcha04&sign=4e2b258be40089e039a9cdae8c38f389&site=b7d0867617b2f855795507351c029d5d&free_type=0&mid=330838998&sche=ban&trace=4&isp=fx&rg=SouthWest&pv=Sichuan&deploy_env=prod&pp=srt&source=puv3_onetier&suffix=origin&hot_cdn=0&origin_bitrate=832001&p2p_type=1&sk=8968c61f7ee47eea970c1885863753c1&score=1&sl=1&info_source=cache&vd=bc&src=puv3&order=1'
        });
        player.attachMediaElement(video.value);
        player.load();
        player.play();
    }
});
</script>

<style scoped>
.numinfo {
    font-size: 13px;
    color: white;
}

.test {
    position: absolute;
    height: 20px;
    width: 20px;
    z-index: 50;
    background-color: aqua;
    cursor: pointer;
}

.shadow {
    z-index: -0.5;
    position: absolute;
    height: 100%;
    width: 100%;
    box-shadow: 0 0 50px 20px rgba(0, 0, 0, 0.5) inset;
}

.sideBar {
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 500px;
    width: 50px;
    padding-right: 38px;
    right: 0;
    bottom: 50px;
    z-index: 99;
}

.sideBar>div {
    display: flex;
    flex-direction: column;
    justify-self: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.sideInfo {
    height: 100%;
    width: 40%;
    min-width: 350px;
}

.canvas {
    position: relative;
}

.details {
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 99;
    padding: 16px 0 16px 0;
    box-sizing: content-box;
    height: 70px;
    /* background-color: aqua; */
    bottom: 50px;
    width: 100%;

    .account {
        width: 100%;
        height: 50%;
        /* background-color: wheat; */
        align-items: center;
        display: flex;

        .uploader {
            font-family: "PingFang SC", serif;
            font-size: 19px;
            color: white;
            padding-left: 16px;
            padding-right: 5px;
            /* background-color: aquamarine; */
        }

        .pubTime {
            font-size: 14px;
            color: white;
        }
    }

    .title {
        width: 100%;
        height: 50%;
        /* background-color: black; */
        align-items: center;
        display: flex;

        .content {
            padding-left: 16px;
            font-size: 15px;
            color: white;
        }

        .tags {
            padding-left: 5px;
            font-size: 15px;
            color: rgb(250, 206, 21);
        }
    }
}

.expand {
    overflow: hidden;
    position: absolute;
    right: -15px;
    top: 45%;
    width: 50px;
    /* background-color: antiquewhite; */
    height: 50px;
    bottom: 45%;
    z-index: 114514;
}

.expand:hover {
    fill: rgba(255, 255, 255, 1);
    margin-right: 10px;
    transition: 300ms;
}

.topPlay {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
    top: 40%;
    left: 40%;
    right: 40%;
    bottom: 40%;
    height: 20%;
    width: 20%;
}

.icon {
    opacity: 0.75;
}

.icon:hover {
    opacity: 0.9;
}

.controlItems {
    height: 100%;
    width: 100%;
    display: flex;

    .left {
        height: 100%;
        width: 70%;
        /* background-color: antiquewhite; */
        display: flex;
        align-items: center;

        .playButton {
            margin-left: 20px;
            height: 20px;
            width: 20px;
            /* background-color: aquamarine; */
        }

        .timeDetails {
            margin-left: 5px;
            height: 20px;
            color: white;
            /* background-color: blue; */
        }
    }

    .right {
        height: 100%;
        width: 30%;
        /* background-color: aqua; */
    }
}

.videoContainer {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    overflow-x: hidden;
}

.vbox {
    overflow: hidden;
    position: relative;
    height: 100%;
    width: 100%;
    min-width: 440px;
}

.vbox:hover {
    cursor: pointer;
}


.background {
    position: absolute;
    display: flex;
    height: 100%;
    width: 100%;
    z-index: -1;
    overflow: hidden;
}

.videoBlock {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 0;
}

.icon1 {
    width: 40px;
    height: 40px;
}

.icon1:hover {
    scale: 1.2;
    transition: 300ms;
}

.videoEntity {
    height: 100%;
    width: 100%;
}

.controller {
    height: 46px;
    width: 100%;
    display: flex;
    flex-direction: column;

    /* background-color: rgb(176, 102, 102); */

    .progressBar {
        padding-bottom: 2px;
        width: 100%;
        opacity: 0.5;

        .progressBackground {
            width: 100%;
            height: 2.55px;
            background-color: rgb(104, 104, 104);

            .progressNow {
                height: 100%;
                background-color: rgb(255, 255, 255);
            }
        }
    }

    .progressBar:hover {
        background-color: rgb(104, 104, 104);
        opacity: 0.9;
    }
}

.himg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.headimg {
    display: flex;
    justify-content: center;
    position: relative;
    margin-bottom: 10px;
}

.follow {
    position: absolute;
    z-index: 100;
    bottom: 0;
}

.follow:hover {
    scale: 1.2;
    transition: 200ms;
}
</style>