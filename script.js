const songname =  document.getElementById("song-name");
const cover = document.getElementById("cover");
const bandname = document.getElementById("menor");
const song = document.getElementById("song");
const play = document.getElementById("play");
const back = document.getElementById("back");
const next = document.getElementById("next");
const currentprogress = document.getElementById("current-progress")
const progressbar = document.getElementById("progress-bar")
const shuffle = document.getElementById("shuffle")
const like = document.getElementById("like")
const repeat = document.getElementById("repeat")
const songtime = document.getElementById("songtime")
const totaltime = document.getElementById("totaltime")

let isplaying = false;
let isshuffle = false;
let isrepeat = false;

const hereWithoutYou = {
     songname: 'Here Without You',
     artist: "3 Doors",
     file: 'Here Without You',
     liked: false
}

const youngBlood = {
    songname: 'YoungBlood',
    artist: "5 Seconds of Summers",
    file: 'YoungBlood',
    liked: false
}

const theEmptinessMachine = {
    songname: 'The Emptiness Machine',
    artist: "Linkin Park",
    file: 'The Emptiness Machine',
    liked: false
}

const playlist = JSON.parse(localStorage.getItem('PLAYLIST')) ?? [hereWithoutYou,youngBlood,theEmptinessMachine];

let sortedplaylist = [...playlist];

let index = 0;

function playsong(){
    play.querySelector('.bi').classList.remove("bi-play-circle-fill");
    play.querySelector('.bi').classList.add("bi-pause-circle-fill");
    song.play();
    isplaying = true;
}

function pausesong(){
    play.querySelector('.bi').classList.remove("bi-pause-circle-fill");
    play.querySelector('.bi').classList.add("bi-play-circle-fill");
    song.pause();
    isplaying = false;
}

function playpausedecider(){
    if (isplaying === true){
        pausesong();
    }
    else{
        playsong();
    }

}

function initializesong(){
    cover.src = `imagens/${sortedplaylist[index].file}.png`;
    song.src = `musicas/${sortedplaylist[index].file}.mp3`;
    songname.innerText = sortedplaylist[index].songname;
    bandname.innerText = sortedplaylist[index].artist;
    likebuttom();
}

function backsong(){
    if (index === 0){
        index = sortedplaylist.length - 1;
    }
    else{
        index -= 1;
    }

    initializesong();
    playsong();
}

function nextsong(){
    if (index === sortedplaylist.length - 1 ){
        index = 0;
    }
    else{
        index += 1;
    }

    initializesong();
    playsong();
}

function updateprogress(){
    const barswidth = (song.currentTime/song.duration)*100;
    currentprogress.style.setProperty("--progress", `${barswidth}%`);
    updatecurrenttime();
}

function jumpto(event){
    const witdh = progressbar.clientWidth;
    const clickposition = event.offsetX;

    const jumpto = (clickposition/witdh)*song.duration;
    song.currentTime = jumpto;
    
}

function  shufflearray(preshuffle){
    const size = preshuffle.length;
    let currentindex = size -1;

    while(currentindex>0){
        let randomindex = Math.floor(Math.random()*size);
        let aux = preshuffle[currentindex];
        preshuffle[currentindex] = preshuffle[randomindex];
        preshuffle[randomindex] = aux;
        currentindex -= 1;
    }
}

function shuffleclicked(){
    if(isshuffle === false){
        isshuffle = true;
        shufflearray(sortedplaylist);
        shuffle.classList.add("buttom-activated");
    }
    else{
        isshuffle = false;
        sortedplaylist = playlist;
        shuffle.classList.remove("buttom-activated");
    }
}

function likebuttom(){
    if(sortedplaylist[index].liked === true){
        like.querySelector('.bi').classList.remove("bi-heart");
        like.querySelector('.bi').classList.add("bi-heart-fill");
        like.classList.add("buttom-activated");
    }
    else{
        like.querySelector('.bi').classList.add("bi-heart");
        like.querySelector('.bi').classList.remove("bi-heart-fill");
        like.classList.remove("buttom-activated");
    }
}

function likedd(){
    if(sortedplaylist[index].liked === false){
        sortedplaylist[index].liked = true;
    }

    else{
        sortedplaylist[index].liked = false;
    }
    likebuttom();
    localStorage.setItem('PLAYLIST', JSON.stringify(playlist));
}

function nextorrepeat(){
    if(isrepeat === false){
        nextsong();
        
    }

    else{
        playsong();
    }
}

function repeater(){
    if(isrepeat === false){
        isrepeat = true;
        repeat.classList.add("buttom-activated");
    }
    else{
        isrepeat = false;
        repeat.classList.remove("buttom-activated");
    }
}

function tempo(tempomusica){
    let hours = Math.floor(tempomusica/3600);
    let min = Math.floor((tempomusica - hours* 3600)/60);
    let sec = Math.floor(tempomusica - hours * 3600 - min *60 );

    return `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
}

function updatecurrenttime(){
    songtime.innerText = tempo(song.currentTime);
}

function updatetotaltime(){
    totaltime.innerText = tempo(song.duration);
}

initializesong()
back.addEventListener("click",backsong);
next.addEventListener("click",nextsong);
play.addEventListener("click", playpausedecider);
song.addEventListener("timeupdate",updateprogress);
song.addEventListener("ended",nextorrepeat);
song.addEventListener("loadedmetadata",updatetotaltime);
progressbar.addEventListener("click",jumpto);
shuffle.addEventListener("click",shuffleclicked);
like.addEventListener("click",likedd);
repeat.addEventListener("click",repeater);