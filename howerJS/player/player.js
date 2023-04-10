/*!
 *  Howler.js Audio Player Demo
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

// Cache references to DOM elements.
var elms = [
  "track",
  "timer",
  "duration",
  "playBtn",
  "pauseBtn",
  "prevBtn",
  "nextBtn",
  "playlistBtn",
  "volumeBtn",
  "progress",
  "bar",
  "wave",
  "loading",
  "playlist",
  "list",
  "volume",
  "barEmpty",
  "barFull",
  "sliderBtn",
];
elms.forEach(function (elm) {
  window[elm] = document.getElementById(elm);
});

let isLoop = false;

/**
 * 플레이어 클래스는 플레이리스트와 그것들이 있는 조건들을 가지고 있습니다.
 * 재생, 스킵, 디스플레이 업데이트 등 모든 메서드들을 포함합니다.
 * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
 */

/* Player 객체 정의부 */
const Player = function (playlist) {
  this.playlist = playlist;
  this.index = 0;

  // Display the title of the first track.
  track.innerHTML = "1. " + playlist[0].title;

  // Setup the playlist display.
  playlist.forEach(function (song) {
    var div = document.createElement("div");
    div.className = "list-song";
    div.innerHTML = song.title;
    div.onclick = function () {
      player.skipTo(playlist.indexOf(song));
    };
    list.appendChild(div);
  });
};

/* Player 프로토타입 정의부 */
Player.prototype = {
  /**
   * 플레이리스트의 곡을 재생합니다
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  play: function (index) {
    var self = this;
    var sound;

    index = typeof index === "number" ? index : self.index;
    var data = self.playlist[index];

    // 로드된 트렉이 있으면 이것을 사용하고, 없으면 새로운 Howl 객체를 설정하고 로드하세요
    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        src: ["./audio/" + data.file + ".mp3"],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        // loop: true,
        // autoplay: true,
        onplay: function () {
          // Display the duration.
          duration.innerHTML = self.formatTime(
            Math.round(sound.duration())
          );

          // Start updating the progress of the track.
          requestAnimationFrame(self.step.bind(self));

          // Start the wave animation if we have already loaded
          wave.container.style.display = "block";
          bar.style.display = "none";
          pauseBtn.style.display = "block";
        },
        onload: function () {
          // Start the wave animation.
          wave.container.style.display = "block";
          bar.style.display = "none";
          loading.style.display = "none";
        },
        onend: function () {
          console.log("onend 실행");
          // Stop the wave animation.
          wave.container.style.display = "none";
          bar.style.display = "block";

          console.log(`self.skip(next) 콜, isLoop : ${isLoop}`);
          if (isLoop) {
            console.log("isLoop 로직 호출");
            self.play(index);
          } else {
            self.skip("next");
          }
        },
        onpause: function () {
          // Stop the wave animation.
          wave.container.style.display = "none";
          bar.style.display = "block";
        },
        onstop: function () {
          // Stop the wave animation.
          wave.container.style.display = "none";
          bar.style.display = "block";
        },
        onseek: function () {
          // Start updating the progress of the track.
          requestAnimationFrame(self.step.bind(self));
        },
      });
    }

    // Begin playing the sound.
    sound.play();

    // Update the track display.
    track.innerHTML = index + 1 + ". " + data.title;

    // Show the pause button.
    if (sound.state() === "loaded") {
      playBtn.style.display = "none";
      pauseBtn.style.display = "block";
    } else {
      loading.style.display = "block";
      playBtn.style.display = "none";
      pauseBtn.style.display = "none";
    }

    // Keep track of the index we are currently playing.
    self.index = index;
  },

  /**
   * Pause the currently playing track.
   */
  pause: function () {
    console.log("pause 콜");
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Puase the sound.
    sound.pause();

    // Show the play button.
    playBtn.style.display = "block";
    pauseBtn.style.display = "none";
  },

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  skip: function (direction) {
    var self = this;

    // Get the next track based on the direction of the track.
    var index = 0;
    if (direction === "prev") {
      index = self.index - 1;
      if (index < 0) {
        index = self.playlist.length - 1;
      }
    } else {
      index = self.index + 1;
      if (index >= self.playlist.length) {
        index = 0;
      }
    }

    self.skipTo(index);
  },

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  skipTo: function (index) {
    var self = this;

    // Stop the current track.
    if (self.playlist[self.index].howl) {
      self.playlist[self.index].howl.stop();
    }

    // Reset progress.
    progress.style.width = "0%";

    // Play the new track.
    self.play(index);
  },

  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  volume: function (val) {
    var self = this;

    // Update the global volume (affecting all Howls).
    Howler.volume(val);

    // Update the display on the slider.
    var barWidth = (val * 90) / 100;
    barFull.style.width = barWidth * 100 + "%";
    sliderBtn.style.left =
      window.innerWidth * barWidth +
      window.innerWidth * 0.05 -
      25 +
      "px";
  },

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  seek: function (per) {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Convert the percent into a seek position.
    if (sound.playing()) {
      sound.seek(sound.duration() * per);
    }
  },

  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step: function () {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Determine our current seek position.
    var seek = sound.seek() || 0;
    timer.innerHTML = self.formatTime(Math.round(seek));
    progress.style.width =
      ((seek / sound.duration()) * 100 || 0) + "%";

    // If the sound is still playing, continue stepping.
    if (sound.playing()) {
      requestAnimationFrame(self.step.bind(self));
    }
  },

  /**
   * Toggle the playlist display on/off.
   */
  togglePlaylist: function () {
    var self = this;
    var display =
      playlist.style.display === "block" ? "none" : "block";

    setTimeout(
      function () {
        playlist.style.display = display;
      },
      display === "block" ? 0 : 500
    );
    playlist.className = display === "block" ? "fadein" : "fadeout";
  },

  /**
   * Toggle the volume display on/off.
   */
  toggleVolume: function () {
    var self = this;
    var display = volume.style.display === "block" ? "none" : "block";

    setTimeout(
      function () {
        volume.style.display = display;
      },
      display === "block" ? 0 : 500
    );
    volume.className = display === "block" ? "fadein" : "fadeout";
  },

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime: function (secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = secs - minutes * 60 || 0;

    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  },
  loop: function () {
    var self = this;
    //클릭한 현재곡 index를 가져와서 self에 담음.
    //해당 index를 play: function안의 loop_option에 넣기

    console.log("루프 함수 호출");
    isLoop = !isLoop;

    /* on end 리스너 호출 할 필요 없어졌음 */
    // sound.on("end", function () {
    //   console.log("sound.on end 함수 호출, index : " + self.index);
    //   self.playlist.forEach((e, i) => {
    //     e.howl = null;
    //     console.log(e);
    //     // if (e.howl) {
    //     //   console.log(`e.howl 존재 인덱스 ${i}`);
    //     //   e.howl = null;
    //     // }
    //   });
    // });
  },
};

// Setup our new audio player class and pass it the playlist.
/** 데이터 받아와서, Player 인스턴스 생성하기 
 *  플레이어 인스턴스는 지금 생성 되는데, Howl 인스턴스는 player의 프로토타입중 play()되는 순간 new Howl({}) 형태로 생성된다.
*/
const player = new Player([
  {
    title: "1",
    file: "1",
    howl: null,
  },
  {
    title: "2",
    file: "2",
    howl: null,
  },
  {
    title: "3",
    file: "3",
    howl: null,
  },
]);

// 플레이어 control 가능한 html 태그와 바인딩.
playBtn.addEventListener("click", function () {
  player.play();
});
pauseBtn.addEventListener("click", function () {
  player.pause();
});
prevBtn.addEventListener("click", function () {
  player.skip("prev");
});
nextBtn.addEventListener("click", function () {
  player.skip("next");
});
waveform.addEventListener("click", function (event) {
  player.seek(event.clientX / window.innerWidth);
});
playlistBtn.addEventListener("click", function () {
  player.togglePlaylist();
});
playlist.addEventListener("click", function () {
  player.togglePlaylist();
});
volumeBtn.addEventListener("click", function () {
  player.toggleVolume();
});
volume.addEventListener("click", function () {
  player.toggleVolume();
});
loopBtn.addEventListener("click", function () {
  //클릭한 곡 반복재생
  player.loop();
});

// Setup the event listeners to enable dragging of volume slider.
barEmpty.addEventListener("click", function (event) {
  var per = event.layerX / parseFloat(barEmpty.scrollWidth);
  player.volume(per);
});
sliderBtn.addEventListener("mousedown", function () {
  window.sliderDown = true;
});
sliderBtn.addEventListener("touchstart", function () {
  window.sliderDown = true;
});
volume.addEventListener("mouseup", function () {
  window.sliderDown = false;
});
volume.addEventListener("touchend", function () {
  window.sliderDown = false;
});

var move = function (event) {
  if (window.sliderDown) {
    var x = event.clientX || event.touches[0].clientX;
    var startX = window.innerWidth * 0.05;
    var layerX = x - startX;
    var per = Math.min(
      1,
      Math.max(0, layerX / parseFloat(barEmpty.scrollWidth))
    );
    player.volume(per);
  }
};

volume.addEventListener("mousemove", move);
volume.addEventListener("touchmove", move);

// Setup the "waveform" animation.
var wave = new SiriWave({
  container: waveform,
  width: window.innerWidth,
  height: window.innerHeight * 0.3,
  cover: true,
  speed: 0.03,
  amplitude: 0.7,
  frequency: 2,
});
wave.start();

// Update the height of the wave animation.
// These are basically some hacks to get SiriWave.js to do what we want.
var resize = function () {
  var height = window.innerHeight * 0.3;
  var width = window.innerWidth;
  wave.height = height;
  wave.height_2 = height / 2;
  wave.MAX = wave.height_2 - 4;
  wave.width = width;
  wave.width_2 = width / 2;
  wave.width_4 = width / 4;
  wave.canvas.height = height;
  wave.canvas.width = width;
  wave.container.style.margin = -(height / 2) + "px auto";

  // Update the position of the slider.
  var sound = player.playlist[player.index].howl;
  if (sound) {
    var vol = sound.volume();
    var barWidth = vol * 0.9;
    sliderBtn.style.left =
      window.innerWidth * barWidth +
      window.innerWidth * 0.05 -
      25 +
      "px";
  }
};
window.addEventListener("resize", resize);
resize();
