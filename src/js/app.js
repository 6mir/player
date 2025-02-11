// "use strict"

// ["contextmenu", "keydown", "selectstart"].forEach((x) => {
//     window.addEventListener(x, (e) => e.preventDefault())
// })

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
const DEFALT_IMG = "./src/img/error-img.png"


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

const boxAll = document.querySelector("boxMusic")


let isMusicPlay = false


let appendItemMusic = document.createDocumentFragment();

dataMusics.forEach((dataMusic) => {
    const itemMusic = document.createElement('div')
    itemMusic.setAttribute("data-id", dataMusic.id)
    itemMusic.className = "w-full bg-gray-700 flex items-center justify-between p-1 pl-4 rounded-xl"
    itemMusic.innerHTML = `
        <div class="flex items-center gap-x-1">
            <div class="size-14 md:size-[5.8rem] p-1">
                <loaderItemMusic class="animate-pulse size-full rounded-full bg-gray-500"></loaderItemMusic>
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
            <a download="${dataMusic.name}" href="${dataMusic.audio}" class="animateScale size-[1.3rem] md:size-6">
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
            // اعمال تغییرات UI بلافاصله هنگام کلیک روی پلی
            targetMusic.querySelector("svg>use").setAttribute("href", "#pauseIcon");
            btnPlayer.querySelector("svg>use").setAttribute("href", "#pauseIcon");
            player.style.bottom = "2px";
            updatePlayButton(getIdMusic);
            isMusicPlay = true;
            imgPlayer.src = dataMusic.img;
            namePlayer.innerHTML = dataMusic.name;
            downlodPlayer.href = dataMusic.audio;
            downlodPlayer.download = dataMusic.name;
            progresPlayer.style.width = "0";
            rotateNum = 0;
            FloaderImgPlayer();
            rotateImg(false);
            rotateImg(true);
            vibra();

            // تنظیم آهنگ جدید
            audioPlayer.src = dataMusic.audio;

            // زمانی که فایل آماده پخش شد، پخش موسیقی انجام شود
            audioPlayer.oncanplay = () => {
                audioPlayer.play();
            };

            // اگر خطا رخ داد
            audioPlayer.onerror = () => {
                // ریست کردن تغییرات اگر خطا رخ داد
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
                    "fixed inset-0 w-40 md:w-52 h-8 md:h-10 flex items-center justify-center bg-gray-700/60 backdrop-blur-lg m-4 rounded-md";
                divErrorElem.innerHTML = `
                    <p class="text-red-400 text-lg md:text-xl">خطا در بارگذاری</p>
                `;
                document.body.appendChild(divErrorElem);
                navigator.vibrate([50, 40, 60, 40, 70, 300, 300]);

                setTimeout(() => {
                    document.body.removeChild(divErrorElem);
                }, 2000);
            };
        }
    });
}



function pauseMusic() {
    vibra()
    player.style.bottom = "-999px"
    btnPlayer.querySelector("svg>use").setAttribute("href", "#playIcon")
    namePlayer.innerHTML = ""
    isMusicPlay = false
    audioPlayer.pause()
    rotateImg(false)

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
        imgPlayer.src = DEFALT_IMG
        loadImgPlayer.style.display = "none"
    })
}


btnPlayer.addEventListener("click", function () {
    vibra()
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
function nextPlayer() {
    getIdMusic = (getIdMusic % dataMusics.length) + 1;
    playMusic(getIdMusic);

    isNexOrPrev = "next";
}
function prevPlayer() {
    if (1 >= getIdMusic) {
        getIdMusic = dataMusics.length + 1
    }
    getIdMusic--
    playMusic(getIdMusic)
    isNexOrPrev = "prev";
}


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
    setTimeout(() => {
        nextPlayer()
    }, 2000);
});

audioPlayer.addEventListener("loadstart", () => {
    showLoader();
});

audioPlayer.addEventListener("canplay", () => {
    hideLoader();
});

// 🔥 هنگام تغییر زمان (seek) لودینگ نمایش داده شود
audioPlayer.addEventListener("seeking", () => {
    showLoader();
});

audioPlayer.addEventListener("seeked", () => {
    hideLoader();
});

// 🔥 توابع بهینه‌شده برای نمایش و مخفی کردن لودینگ
function showLoader() {
    loaderPlayer.style.display = "block";
    timePlayer.style.display = "none";
}

function hideLoader() {
    loaderPlayer.style.display = "none";
    timePlayer.style.display = "block";
}




function loopPlaye(eleman) {
    vibra()
    if (audioPlayer.loop == true) {
        audioPlayer.loop = false
        eleman.style.color = "#999999"
    } else {
        audioPlayer.loop = true
        eleman.style.color = "#e5e7eb"
    }
}

function movePlaye(n) {
    vibra()
    audioPlayer.currentTime += (5 * n)
}


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



let valueInput
let isDragging2 = false;
const progresParentElement2 = progresVolumePlayer.closest("mainProgresVolume");
const volumeIconPlayerUse = volumeIconPlayer.querySelector("use")

progresVolumePlayer.style.width = audioPlayer.volume * 100 + "%"

function handleDrag2(e) {
    if (!isDragging2) return;

    e.preventDefault();
    vibra2()
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


function vibra() {
    navigator.vibrate(60);
};
function vibra2() {
    navigator.vibrate(5);
};