/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect } from "react";
import "../style/mouseInteractive.css";
import cubeImage from "../assets/mouse-interactive/Lovepik_com-401467010-cube.png";
import poset1 from "../assets/mouse-interactive/poster_image_1.png";
import poset2 from "../assets/mouse-interactive/poster_image_2.png";
import poset3 from "../assets/mouse-interactive/poster_image_3.png";
import music from "../assets/mouse-interactive/The Greatest Showman Cast - A Million Dreams (Instrumental) [Official Lyric Video].mp3";
import play from "../assets/mouse-interactive/play.svg";
import pause from "../assets/mouse-interactive/pause.svg";
export default function MouseInteractive() {
  useEffect(() => {
    const header = document.querySelector(".header");
    const music = document.querySelector("#music");

    // 따라오는 커서
    document.addEventListener("mousemove", (e) => {
      const 커서앞배경 = document.querySelector(".cursor__default__inner");
      const 커서뒤배경 = document.querySelector(".cursor__trace__inner");

      커서앞배경.style.top = e.clientY + "px";
      커서앞배경.style.left = e.clientX + "px";

      커서뒤배경.style.top = e.clientY + "px";
      커서뒤배경.style.left = e.clientX + "px";
    });

    const 커서 = document.querySelector(".cursor");

    // * 클릭시 커서의 배경 이미지 축소/확대
    document.addEventListener("mousedown", () => {
      커서.classList.add("cursor--active");
    });
    document.addEventListener("mouseup", () => {
      커서.classList.remove("cursor--active");
    });

    // * 물결 모양 만들기
    function createRipple(e) {
      let 물결 = document.createElement("span");
      물결.classList.add("ripple");
      커서.appendChild(물결);
      물결.style.top = e.clientY - 물결.clientHeight / 2 + "px";
      물결.style.left = e.clientX - 물결.clientWidth / 2 + "px";

      물결.addEventListener("animationend", () => {
        커서.removeChild(물결);
      });
    }

    // 클릭시 물결모양
    document.addEventListener("click", (e) => {
      createRipple(e);
    });

    const 홀드버튼 = document.querySelector(".preloader__btn");
    let interverId = null;
    let scale = 1;
    const 홀드버튼최대크기 = 18;

    function setPreloaderStyle(scale) {
      홀드버튼.style.transform = `scale(${scale})`;
      document.querySelector(".preloader__btn_hold").style.opacity =
        1 - (scale - 1) / 홀드버튼최대크기;
      document.querySelector(".preloader__title").style.opacity =
        1 - (scale - 1) / 홀드버튼최대크기;
      document.querySelector(".preloader__text").style.opacity =
        1 - (scale - 1) / 홀드버튼최대크기;
    }

    // 버튼 3초 이상 누를 시
    홀드버튼.addEventListener("mousedown", () => {
      clearInterval(interverId);
      interverId = setInterval(() => {
        scale += 0.175;
        setPreloaderStyle(scale);

        if (scale >= 1 + 홀드버튼최대크기) {
          document.querySelector(".preloader").classList.add("hidden-area");
          const poster = document.querySelector(".poster");

          poster.classList.add("shown-area");
          poster.classList.remove("hidden-area");
          header.classList.add("shown-area");
          header.classList.remove("hidden-area");
          // music.play();
          clearInterval(interverId);
        }
      }, 10);
    });

    // 버튼 3초 미만 누를 시
    홀드버튼.addEventListener("mouseup", () => {
      clearInterval(interverId);
      interverId = setInterval(() => {
        scale -= 0.075;

        setPreloaderStyle(scale);

        if (scale <= 1) {
          clearInterval(interverId);
        }
      }, 10);
    });

    // 마우스 움직임에 따른 애니메이션
    header.addEventListener("mousemove", (e) => {
      const xRelativeToHeader = e.clientX / header.clientWidth;
      const yRelativeToHeader = e.clientY / header.clientHeight;

      document.querySelector(".header__title").style.transform = `translate(${
        xRelativeToHeader * -100
      }px, ${yRelativeToHeader * -100}px)`;
      document.querySelector(".header__sub").style.transform = `translate(${
        xRelativeToHeader * -20
      }px, ${yRelativeToHeader * -20}px `;
      document.querySelector("#bar-wrap").style.transform = `translate(${
        xRelativeToHeader * -20
      }px, ${yRelativeToHeader * -20}px `;

      document.querySelector("#circle-1").style.transform = `translate(${
        xRelativeToHeader * -50
      }px, ${yRelativeToHeader * -50}px)`;

      document.querySelector("#circle-2").style.transform = `translate(${
        xRelativeToHeader * 75
      }px, ${yRelativeToHeader * 75}px)`;

      document.querySelector("#cube__image_1").style.transform = `translate(${
        xRelativeToHeader * -30
      }px, ${yRelativeToHeader * -30}px) rotate(${yRelativeToHeader * 10}deg) `;
      document.querySelector("#cube__image_2").style.transform = `translate(${
        xRelativeToHeader * -40
      }px, ${yRelativeToHeader * -40}px) rotate(${yRelativeToHeader * 15}deg)`;

      document.querySelector("#cube__image_3").style.transform = `translate(${
        xRelativeToHeader * -60
      }px, ${yRelativeToHeader * -60}px) rotate(${yRelativeToHeader * -10}deg)`;

      document.querySelector("#cube__image_4").style.transform = `translate(${
        xRelativeToHeader * 40
      }px, ${yRelativeToHeader * 40}px) rotate(${yRelativeToHeader * -18}deg)`;
    });

    // music effect
    for (let i = 0; i < 50; i++) {
      const left = i * 2 + 1;
      const anim = Math.floor(Math.random() * 75 + 400);
      const height = Math.floor(Math.random() * 25 + 3);

      document.querySelector(
        "#bars"
      ).innerHTML += `<div class="bar" style="left:${left}px;animation-duration:${anim}ms;height:${height}px"></div>`;
    }

    const icon = document.querySelector(".play-icon");
    const bar = document.querySelectorAll(".bar");

    // 재생 버튼
    icon.setAttribute("width", "28px");
    icon.addEventListener("click", () => {
      if (icon.className === "play-icon play") {
        icon.classList.remove("play");
        icon.classList.add("pause");
        icon.setAttribute("src", pause);
        icon.setAttribute("width", "20px");
        bar.forEach(function (data) {
          data.style["animation-play-state"] = "paused";
        });
        music.pause();
      } else {
        icon.classList.remove("pause");
        icon.classList.add("play");
        icon.setAttribute("src", play);
        icon.setAttribute("width", "28px");
        bar.forEach(function (data) {
          data.style["animation-play-state"] = "running";
        });
        music.play();
      }
    });

    // intersaction
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("poster-image_state_visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".poster-image_wrapper").forEach((poster) => {
      observer.observe(poster);
    });
    const posterParallax = document.querySelector(".poster__parallax");

    posterParallax.addEventListener("mousemove", (e) => {
      const xRelativeToPosterParallax = e.clientX / posterParallax.clientWidth;
      const yRelativeToPosterParallax = e.clientY / posterParallax.clientHeight;

      document.querySelector(
        "#poster-image_wrapper_2"
      ).style.transform = `translate(${xRelativeToPosterParallax * -40}px, ${
        yRelativeToPosterParallax * -40
      }px)`;
      document.querySelector(
        "#poster-image_wrapper_3"
      ).style.transform = `translate(${xRelativeToPosterParallax * 40}px, ${
        yRelativeToPosterParallax * 40
      }px)`;
    });
  }, []);

  return (
    <main style={{ backgroundColor: "#1e4029", cursor: "none !important" }}>
      <div className="cursor">
        <div className="cursor__default">
          <span className="cursor__default__inner"> </span>
        </div>
        <div className="cursor__trace">
          <span className="cursor__trace__inner"></span>
        </div>
      </div>
      <section className="preloader">
        <button className="preloader__btn">
          <span className="preloader__btn_hold">Hold</span>
        </button>
        <h3 className="preloader__title">PRESS HOLD</h3>
        <h3 className="preloader__text">
          <div>We grow fearless when we do the things we fear.</div>
          <div>
            If you are working on something that really excites you, you don't
            have to be pushed. The vision pulls you.
          </div>
        </h3>
      </section>

      <section className="header hidden-area">
        <div className="icon-wrap">
          <img className="play-icon play" src={play} />
        </div>
        <span className="circle" id="circle-1"></span>
        <span className="circle" id="circle-2"></span>
        <img
          id="cube__image_1"
          src={cubeImage}
          alt="cube image"
          className="cube__image"
        />
        <img
          id="cube__image_2"
          src={cubeImage}
          alt="cube image"
          className="cube__image"
        />
        <img
          id="cube__image_3"
          src={cubeImage}
          alt="cube image"
          className="cube__image"
        />
        <img
          id="cube__image_4"
          src={cubeImage}
          alt="cube image"
          className="cube__image"
        />
        <audio id="music">
          <source src={music} type="audio/mp3" />
        </audio>
        <h1 className="header__title">
          <div style={{ fontSize: "80px" }}>KOGONG</div>
          <div style={{ fontSize: "80px" }}>PROJECT</div>
          <div id="bar-width">
            <div id="bar-wrap">
              <div id="bars"></div>
            </div>
          </div>
          <div className="header__sub">LITTLECOLLECTION</div>
        </h1>
      </section>
      <section className="poster hidden-area">
        <div className="poster__parallax">
          <div className="poster__parallax">
            <div id="poster-image_wrapper_1" className="poster-image_wrapper">
              <img
                id="poster-image_1"
                src={poset1}
                alt="1"
                className="poster-image"
              />
            </div>
            <div id="poster-image_wrapper_2" className="poster-image_wrapper">
              <img
                id="poster-image_2"
                src={poset2}
                alt="2"
                className="poster-image"
              />
            </div>
            <div id="poster-image_wrapper_3" className="poster-image_wrapper">
              <img
                id="poster-image_3"
                src={poset3}
                alt="3"
                className="poster-image"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
