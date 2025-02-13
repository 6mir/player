// ["contextmenu", "keydown", "selectstart"].forEach((x) => {
//     window.addEventListener(x, (e) => e.preventDefault())
// })

// path data
const BA = "./music/"
const BI = "./src/img/"

let dataMusics = [
    { id: 1, name: "بیم - یاس", audio: `${BA}YasBeem.mp3`, img: `${BI}yas.jpg` },
    { id: 2, name: "چرخه - بهرام", audio: `${BA}BahramCharkheh.mp3`, img: `${BI}bahram.jpg` },
    { id: 3, name: "افعی - تتلو", audio: `${BA}Tataloo-Afee.mp3`, img: `${BI}tataloo.jpg` },
    { id: 4, name: "مثلا - اررور", audio: `${BA}www.mp3`, img: `${BI}` },
    { id: 5, name: "نصف شب - تتلو", audio: `${BA}TatalooNesfeShab.mp3`, img: `${BI}tataloo.jpg` },
    { id: 6, name: "خلاص - شایع", audio: `${BA}ShayeKhales.mp3`, img: `${BI}shaye.jpg` },
    { id: 7, name: "حق - تتلو", audio: `${BA}TatalooHagh.mp3`, img: `${BI}tataloo.jpg` },
]
const DEFALT_IMG = `${BI}error-img.png`


// select all item player

// player
const player = document.querySelector("player")
function selectPlayer(idElemPlayer) {
    return player.querySelector(idElemPlayer)
}
const audioPlayer = selectPlayer("audio")
const loaderPlayer = selectPlayer("audioLoader")
const imgPlayer = selectPlayer("img")
const loadImgPlayer = selectPlayer("imgLoader")
const namePlayer = selectPlayer("#name")
const btnPlayer = selectPlayer("#play")
const downlodPlayer = selectPlayer("#downlod")
const timePlayer = selectPlayer("time")
const progresPlayer = selectPlayer("progresTime")
const progresVolumePlayer = selectPlayer("progresVolume")
const volumeIconPlayer = selectPlayer("#volumeIcon")
const loopPlayer = selectPlayer("#loop")

// box music items
const boxAll = document.querySelector("boxMusic")


// is music play or pause
let isMusicPlay = false

// creat item muisc
let appendItemMusic = document.createDocumentFragment();
dataMusics.forEach((dataMusic) => {
    const itemMusic = document.createElement('div')
    itemMusic.setAttribute("data-id", dataMusic.id)
    itemMusic.className = "w-full bg-gray-700 flex items-center justify-between p-1 pl-4 rounded-xl"
    itemMusic.innerHTML = `
        <div class="flex items-center gap-x-1">
            <div class="size-14 md:size-[5.8rem] p-1">
                <loaderItemMusic class="animate-pulse size-full rounded-full block bg-gray-500"></loaderItemMusic>
                <img src="${dataMusic.img}" alt="${dataMusic.name}" class="size-full rounded-full object-cover" style="display: none;">
            </div>
            <p class="font-BoldFt text-base md:ext-lg">${dataMusic.name}</p>
        </div>
        <div class="flex items-center gap-x-1 md:gap-x-2">
            <button class="animateScale playItemBtn size-[1.7rem] md:size-7" data-action="play">
                <svg>
                    <use href="#playIcon">
                </svg>
            </button>
            <a download="${dataMusic.name}" href="${dataMusic.audio}" onclick="vibre(50)" class="animateScale size-[1.3rem] md:size-6">
                <svg>
                    <use href="#downloadIcon">
                </svg>
            </a>
        </div>
    `;

    const imgItem = itemMusic.querySelector("img");
    const loader = itemMusic.querySelector("loaderItemMusic");

    imgItem.addEventListener("load", function () {
        imgItem.style.display = "block";
        loader.style.display = "none";
    });

    imgItem.addEventListener("error", function () {
        loader.style.display = "none";
        imgItem.src = DEFALT_IMG
    });

    appendItemMusic.appendChild(itemMusic);
});
boxAll.appendChild(appendItemMusic);
const playItemMusics = boxAll.querySelectorAll(".playItemBtn")


// get id music is play
let targetMusic, getIdMusic
boxAll.addEventListener("click", function (e) {

    targetMusic = e.target;

    if (targetMusic.classList.contains("playItemBtn")) {

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

// play audio
let isNexOrPrev
function playMusic(getIdMusic) {
    dataMusics.forEach((dataMusic) => {
        if (dataMusic.id == getIdMusic) {

            timePlayer.innerHTML = `00:00 / 00:00`;
            targetMusic.querySelector("svg>use").setAttribute("href", "#pauseIcon");
            btnPlayer.querySelector("svg>use").setAttribute("href", "#pauseIcon");
            player.style.bottom = "2px";
            playItemMusics.forEach(button => {
                const parentDiv = button.closest("div[data-id]");
                if (parentDiv.getAttribute("data-id") == getIdMusic) {
                    button.querySelector("svg>use").setAttribute("href", "#pauseIcon")
                    button.setAttribute("data-action", "pause")
                } else {
                    button.querySelector("svg>use").setAttribute("href", "#playIcon")
                    button.setAttribute("data-action", "play")
                }
            });
            isMusicPlay = true;
            imgPlayer.src = dataMusic.img;
            imgPlayer.addEventListener("load", function () {
                imgPlayer.style.display = "block"
                loadImgPlayer.style.display = "none"
            })

            imgPlayer.addEventListener("error", function () {
                imgPlayer.src = DEFALT_IMG
                loadImgPlayer.style.display = "none"
            })
            namePlayer.innerHTML = dataMusic.name;
            downlodPlayer.href = dataMusic.audio;
            downlodPlayer.download = dataMusic.name;
            progresPlayer.style.width = "0";
            rotateNum = 0;
            rotateImg(false);
            rotateImg(true);
            vibre(60);
            audioPlayer.src = dataMusic.audio;

            audioPlayer.oncanplay = () => {
                audioPlayer.play();
            };

            audioPlayer.onerror = () => {

                targetMusic.querySelector("svg>use").setAttribute("href", "#playIcon");
                btnPlayer.querySelector("svg>use").setAttribute("href", "#playIcon");
                isMusicPlay = false;

                if (isNexOrPrev == "next") {
                    nextPlayer();
                } else if (isNexOrPrev == "prev") {
                    prevPlayer();
                } else {
                    nextPlayer();
                }

                const divErrorElem = document.createElement("div");
                divErrorElem.className =
                    "fixed inset-0 max-w-max h-9 md:h-11 px-2 text-base md:text-lg flex items-center justify-center bg-gray-700/60 backdrop-blur-lg m-4 rounded-md";
                divErrorElem.innerHTML = `
                    <p class="text-red-400 ml-2">خطا در بارگذاری<p class="text-gray-300">${dataMusic.name}</p></p>
                `;
                document.body.appendChild(divErrorElem);
                vibre([40, 50, 40, 50, 80, 400, 200])

                setTimeout(() => {
                    document.body.removeChild(divErrorElem);
                }, 2000);
            };
        }
    });
}

// pause audio
function pauseMusic() {
    vibre(70)
    player.style.bottom = "-999px"
    isMusicPlay = false
    rotateImg(false)
    audioPlayer.pause()

    playItemMusics.forEach(boxAllbtn => {
        boxAllbtn.querySelector("svg>use").setAttribute("href", "#playIcon")
        boxAllbtn.setAttribute("data-action", "play")
    });
}

// btn nex and prev player
btnPlayer.addEventListener("click", function () {
    vibre(60)

    if (isMusicPlay) {
        btnPlayer.querySelector("svg>use").setAttribute("href", "#playIcon")
        audioPlayer.pause()
        rotateImg(false)
        isMusicPlay = false

    } else {
        btnPlayer.querySelector("svg>use").setAttribute("href", "#pauseIcon")
        audioPlayer.play()
        rotateImg(true)
        isMusicPlay = true
    }
})

// update a time audio
let currentMin = 0, currentSec = 0, durationMin = 0, durationSec = 0;
audioPlayer.addEventListener("timeupdate", function () {
    if (isNaN(audioPlayer.duration)) return;

    durationMin = String(Math.floor(audioPlayer.duration / 60)).padStart(2, "0");
    durationSec = String(Math.floor(audioPlayer.duration % 60)).padStart(2, "0");
    currentMin = String(Math.floor(audioPlayer.currentTime / 60)).padStart(2, "0");
    currentSec = String(Math.floor(audioPlayer.currentTime % 60)).padStart(2, "0");

    timePlayer.innerHTML = `${durationMin}:${durationSec} / ${currentMin}:${currentSec}`;

    progresPlayer.style.width = (audioPlayer.currentTime / audioPlayer.duration) * 100 + "%";
});

// next a audio
function nextPlayer() {
    getIdMusic = (getIdMusic % dataMusics.length) + 1;
    playMusic(getIdMusic);

    isNexOrPrev = "next";
}

// prev a audio
function prevPlayer() {
    if (1 >= getIdMusic) {
        getIdMusic = dataMusics.length + 1
    }
    getIdMusic--
    playMusic(getIdMusic)

    isNexOrPrev = "prev";
}

// rotate a img player
let rotateFucton, rotateNum = 0;
function rotateImg(TorF) {
    if (TorF) {
        rotateFucton = setInterval(() => {
            rotateNum = (rotateNum + 1) % 360;
            imgPlayer.style.transform = `rotate(${rotateNum}deg)`;
        }, 40);
    }
    else {
        clearInterval(rotateFucton)
    }
}

// end a time audio
audioPlayer.addEventListener('ended', () => {
    setTimeout(() => {
        nextPlayer()
    }, 2000);
});

// lopp audio
loopPlayer.addEventListener("click", function () {
    vibre(50)
    if (audioPlayer.loop == true) {
        audioPlayer.loop = false
        loopPlayer.style.color = "#999999"
    } else {
        audioPlayer.loop = true
        loopPlayer.style.color = "#e5e7eb"
    }
})

// move audio
function movePlaye(n) {
    vibre(20)
    audioPlayer.currentTime += (5 * n)
    if (audioPlayer.paused) {
        btnPlayer.click()
    }
}

// vibre
function vibre(n) {
    navigator.vibrate(n);
};



// loader audio a player
audioPlayer.addEventListener("loadstart", () => {
    loaderPlayer.style.display = "block";
});

audioPlayer.addEventListener("canplay", () => {
    loaderPlayer.style.display = "none";
});

// click a time audio is player
let isDragging = false;
const progresParentElement = progresPlayer.closest("mainProgresTime");

function updateProgress(e) {
    if (!isDragging) return;
    e.preventDefault();

    let rect = progresParentElement.getBoundingClientRect();
    let clickX = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    let newTime = (clickX / rect.width) * audioPlayer.duration;

    if (!isNaN(newTime) && isFinite(newTime)) {
        progresPlayer.style.width = (clickX / rect.width) * 100 + "%";
        audioPlayer.currentTime = newTime;
    }

    if (audioPlayer.paused) {
        btnPlayer.click()
    }
}

function startDrag(e) {
    isDragging = true;
    updateProgress(e);
}

function stopDrag() {
    isDragging = false;
}

progresParentElement.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", updateProgress);
document.addEventListener("mouseup", stopDrag);

progresParentElement.addEventListener("touchstart", startDrag, { passive: true });
document.addEventListener("touchmove", updateProgress);
document.addEventListener("touchend", stopDrag);


// click a volume audio is player
let valueInput
let isDragging2 = false;
const progresParentElement2 = progresVolumePlayer.closest("mainProgresVolume");
const volumeIconPlayerUse = volumeIconPlayer.querySelector("use")

progresVolumePlayer.style.width = audioPlayer.volume * 100 + "%"

function handleDrag2(e) {
    if (!isDragging2) return;

    e.preventDefault();
    let rect = progresParentElement2.getBoundingClientRect();
    let clickX = (e.clientX || e.touches[0].clientX) - rect.left;

    valueInput = (clickX / rect.width).toFixed(1);
    valueInput = Math.max(0, Math.min(1, valueInput));

    if (valueInput <= 1 && valueInput >= 0) {
        audioPlayer.volume = valueInput
        progresVolumePlayer.style.width = valueInput * 100 + "%"
    }

    if (valueInput <= 0) {
        volumeIconPlayerUse.setAttribute("href", "#volumeOffIcon")
        navigator.vibrate([80, 150, 80, 180, 120]);
    } else {
        volumeIconPlayerUse.setAttribute("href", "#volumeOnIcon")
    }
}

function startDragging2(e) {
    isDragging2 = true;
    handleDrag2(e);
}

function stopDragging2() {
    isDragging2 = false;
}

progresParentElement2.addEventListener("mousedown", startDragging2);
document.addEventListener("mousemove", handleDrag2);
document.addEventListener("mouseup", stopDragging2);

progresParentElement2.addEventListener("touchstart", startDragging2, { passive: true });
document.addEventListener("touchmove", handleDrag2);
document.addEventListener("touchend", stopDragging2);