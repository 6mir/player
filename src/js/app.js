// "use strict"

["contextmenu", "keydown", "selectstart"].forEach((x) => {
    window.addEventListener(x, (e) => e.preventDefault())
})

window.addEventListener("DOMContentLoaded", function () {

    let dataMusics = [
        { id: 1, name: "بیم - یاس", audio: "./music/YasBeem.mp3", img: "./src/img/" },
        { id: 2, name: "چرخه - بهرام", audio: "./music/BahramCharkheh.mp3", img: "./src/img/" },
        { id: 3, name: "افعی - تتلو", audio: "./music/Tataloo-Afee.mp3", img: "./src/img/" },
        { id: 4, name: "مثلا - اررور", audio: "./music/www.mp3", img: "./src/img/" },
        { id: 5, name: "نصف شب - تتلو", audio: "./music/TatalooNesfeShab.mp3", img: "./src/img/" },
        { id: 6, name: "خلاص - شایع", audio: "./music/ShayeKhales.mp3", img: "./src/img/" },
        { id: 7, name: "حق - تتلو", audio: "./music/TatalooHagh.mp3", img: "./src/img/" },
    ]
    const imgError = "./src/img/error-img.png"


    const player = document.querySelector("#player-Elem")

    function selectPlayer(idElemPlayer) {
        return player.querySelector(idElemPlayer)
    }

    const audioPlayer = selectPlayer("#audio")
    const loaderPlayer = selectPlayer("#audio-loader")
    const errorPlayer = document.querySelector("#audio-error")

    const imgPlayer = selectPlayer("#img")
    const loadImgPlayer = selectPlayer("#img-loader")

    const namePlayer = selectPlayer("#name")

    const btnPlayer = selectPlayer("#play")
    const downlodPlayer = selectPlayer("#downlod")

    const nextBtnPlayer = selectPlayer("#next")
    const prevBtnPlayer = selectPlayer("#prev")

    const timePlayer = selectPlayer("#time")
    const progresPlayer = selectPlayer("#progres-time")

    const boxAll = document.querySelector("#main-music")

    let isMusicPlay = false


    let appendItemMusic = document.createDocumentFragment();
    dataMusics.forEach((dataMusic) => {

        const itemMusic = document.createElement('div')
        itemMusic.setAttribute("data-id", dataMusic.id)
        itemMusic.className = "flex items-center justify-between w-10/12 bg-gray-700 p-1 pl-4 rounded-2xl"
        itemMusic.innerHTML = `
        <div class="flex items-center gap-x-1">
            <div class="size-14 md:size-[5.8rem] p-1.5 rounded-full">
                <div class="loaderItemMusic animate-pulse size-full rounded-full bg-gray-500"></div>
                <img src="${dataMusic.img}" alt="${dataMusic.name}" class="imgItemMusic size-full rounded-full" style="display: none;">
            </div>
            <h2 class="font-BoldFt text-base">${dataMusic.name}</h2>
        </div>
        <div class="flex items-center gap-x-1 md:gap-x-2">
            <button class="play size-[1.7rem] md:size-7" data-action="play">
                <svg class="size-full">
                    <use href="#playIcon">
                </svg>
            </button>
            <a download="${dataMusic.name}" href="${dataMusic.audio}" class="size-[1.3rem]  md:size-6">
                <svg class="size-full">
                    <use href="#downloadIcon">
                </svg>
            </a>
        </div>
    `;

        const imgItem = itemMusic.querySelector(".imgItemMusic");
        const loader = itemMusic.querySelector(".loaderItemMusic");

        imgItem.addEventListener("load", function () {
            imgItem.style.display = "block";
            loader.style.display = "none";
        });

        imgItem.addEventListener("error", function () {
            loader.style.display = "none";
            imgItem.src = imgError
        });

        appendItemMusic.appendChild(itemMusic);
    });

    boxAll.appendChild(appendItemMusic);
    const playItemMusics = boxAll.querySelectorAll(".play")




    let targetMusic, getIdMusic

    boxAll.addEventListener("click", function (e) {

        targetMusic = e.target;

        if (targetMusic.classList.contains("play")) {

            if (targetMusic.getAttribute("data-action") == "play") {

                let idMusic = targetMusic.closest("div[data-id]").getAttribute("data-id")

                dataMusics.find((dataMusic) => {
                    if (dataMusic.id == idMusic) {
                        getIdMusic = dataMusic.id
                    }
                })
                playMusic(getIdMusic);
            }
            else {
                pauseMusic()
            }
        }
    })

    function updatePlayButton(id) {
        playItemMusics.forEach(button => {
            const parentDiv = button.closest("div[data-id]");
            if (parentDiv.getAttribute("data-id") == id) {
                button.querySelector("svg>use").setAttribute("href", "#pauseIcon")
                button.setAttribute("data-action", "pause")
            } else {
                button.querySelector("svg>use").setAttribute("href", "#playIcon")
                button.setAttribute("data-action", "play")
            }
        });
    }


    let isNexOrPrev

    function playMusic(getIdMusic) {
        dataMusics.forEach((dataMusic) => {
            if (dataMusic.id == getIdMusic) {

                progresPlayer.style.width = "0";
                rotateNum = 0
                audioPlayer.src = dataMusic.audio;
                namePlayer.innerHTML = dataMusic.name;
                imgPlayer.src = dataMusic.img;
                downlodPlayer.href = dataMusic.audio
                downlodPlayer.download = dataMusic.name
                player.style.display = "flex";

                targetMusic.querySelector("svg>use").setAttribute("href", "#pauseIcon")

                FloaderImgPlayer()
                audioPlayer.play()
                    .then(() => {
                        rotateImg(false)
                        rotateImg(true)
                        updatePlayButton(getIdMusic);
                        btnPlayer.querySelector("svg>use").setAttribute("href", "#pauseIcon")
                        isMusicPlay = true;
                    })
                    .catch(function () {
                        if (isNexOrPrev == "next") {
                            nextBtnPlayer.click()
                        }
                        else if (isNexOrPrev == "prev") {
                            prevBtnPlayer.click()
                        }
                        else {
                            nextBtnPlayer.click()
                        }

                        errorPlayer.style.display = "flex";
                        setTimeout(() => {
                            errorPlayer.style.display = "none";
                        }, 2000);
                    });
            }
        });
        playItemMusics.forEach(boxAllbtn => {
            boxAllbtn.querySelector("svg>use").setAttribute("href", "#playIcon")
            boxAllbtn.setAttribute("data-action", "play")
        });
    }

    function pauseMusic() {
        player.style.display = "none"
        btnPlayer.querySelector("svg>use").setAttribute("href", "#playIcon")
        namePlayer.innerHTML = ""
        isMusicPlay = false
        audioPlayer.pause()
        rotateImg(false)
        audioPlayer.src = ""

        playItemMusics.forEach(boxAllbtn => {
            boxAllbtn.querySelector("svg>use").setAttribute("href", "#playIcon")
            boxAllbtn.setAttribute("data-action", "play")
        });
    }


    function FloaderImgPlayer() {

        imgPlayer.addEventListener("load", function () {
            imgPlayer.style.display = "block"
            loadImgPlayer.style.display = "none"
        })

        imgPlayer.addEventListener("error", function () {
            imgPlayer.src = imgError
            loadImgPlayer.style.display = "none"
        })
    }


    btnPlayer.addEventListener("click", function () {
        if (isMusicPlay) {
            btnPlayer.querySelector("svg>use").setAttribute("href", "#playIcon")
            audioPlayer.pause()
            isMusicPlay = false
            rotateImg(false)

        } else {
            btnPlayer.querySelector("svg>use").setAttribute("href", "#pauseIcon")
            audioPlayer.play()
            isMusicPlay = true
            rotateImg(true)
        }
    })

    nextBtnPlayer.addEventListener("click", function () {
        if (dataMusics.length <= getIdMusic) {
            getIdMusic = 0
        }
        getIdMusic++
        playMusic(getIdMusic)
        isNexOrPrev = "next";
    })

    prevBtnPlayer.addEventListener("click", function () {
        if (1 >= getIdMusic) {
            getIdMusic = dataMusics.length + 1
        }
        getIdMusic--
        playMusic(getIdMusic)
        isNexOrPrev = "prev";
    })


    let currentMin = 0, currentSec = 0, durationMin = 0, durationSec = 0;
    audioPlayer.addEventListener("timeupdate", function () {

        durationMin = String(Math.floor(audioPlayer.duration / 60)).padStart(2, "0");
        durationSec = String(Math.floor(audioPlayer.duration % 60)).padStart(2, "0");
        currentMin = String(Math.floor(audioPlayer.currentTime / 60)).padStart(2, "0");
        currentSec = String(Math.floor(audioPlayer.currentTime % 60)).padStart(2, "0");

        timePlayer.innerHTML = `${durationMin}:${durationSec} / ${currentMin}:${currentSec}`;

        if (durationMin == "NaN" || durationSec == "NaN" || currentMin == "NaN" || currentSec == "NaN") {
            timePlayer.innerHTML = "00:00 / 00:00";
        }

        progresPlayer.style.width = (audioPlayer.currentTime / audioPlayer.duration) * 100 + "%";
    });

    let rotateFucton, rotateNum = 0;
    function rotateImg(tF) {
        if (tF) {
            rotateFucton = setInterval(() => {
                rotateNum = (rotateNum + 1) % 360;
                imgPlayer.style.transform = `rotate(${rotateNum}deg)`;
            }, 20);
        }
        else {
            clearInterval(rotateFucton)
        }
    }


    audioPlayer.addEventListener('ended', () => {
        nextBtnPlayer.click()
    });

    audioPlayer.addEventListener("loadstart", () => {
        loaderPlayer.style.display = "block";
        timePlayer.style.display = "none";
    });

    audioPlayer.addEventListener("canplay", () => {
        loaderPlayer.style.display = "none";
        timePlayer.style.display = "block";
    });

    function loopPlaye(eleman) {
        if (audioPlayer.loop == true) {
            audioPlayer.loop = false
            if (eleman) {
                eleman.style.color = "#999999"
            }
        } else {
            audioPlayer.loop = true
            if (eleman) {
                eleman.style.color = "#e5e7eb"
            }
        }
    }

    function movePlaye(n) {
        audioPlayer.currentTime += (5 * n)
    }




    let isDragging = false;
    const progresParentElement = progresPlayer.closest("#main-progres-time");

    function handleDrag(e) {
        if (!isDragging) return;

        if (audioPlayer.paused) {
            btnPlayer.click()
        }

        e.preventDefault();
        let rect = progresParentElement.getBoundingClientRect();
        let clickX = (e.clientX || e.touches[0].clientX) - rect.left;
        audioPlayer.currentTime = (1 - clickX / rect.width) * audioPlayer.duration;
    }

    function startDragging(e) {
        isDragging = true;
        handleDrag(e);
    }

    function stopDragging() {
        isDragging = false;
    }

    progresParentElement.addEventListener("mousedown", startDragging);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDragging);

    progresParentElement.addEventListener("touchstart", startDragging, { passive: true });
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", stopDragging);
})