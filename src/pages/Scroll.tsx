/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { useEffect } from "react";
import "../style/scroll.css";
import topImg from "../assets/scroll/Lovepik_com-401339128-data-management-data-analysis-icon-free-vector-illustration-mate.png";
import textImg from "../assets/scroll/05-text.png";
import santa from "../assets/scroll/santa_flying.png";
import animation3 from "../assets/scroll/animation3.mp4";
import arrow from "../assets/scroll/down-arrow.png";

export default function Scroll() {
  useEffect(() => {
    const 화면길이 = document.documentElement.clientHeight;

    // * li 리스트의 시작 스크롤 위치와 끝나는 스크롤 위치를 기억.
    const 리스트시작위치 = 373;
    const 리스트끝나는위치 = 1500;

    const 리스트아이템 = document.querySelectorAll(".list-item");

    // * 리스트의 전체 길이를 리스트의 갯수로 나눔
    const 리스트1개의구간 =
      (리스트끝나는위치 - 리스트시작위치) / 리스트아이템.length;
    const panel1Img = document.getElementById("panel1-img");
    const SantaImg = document.getElementById("flying-santa-image");

    const videoPlayBack = 500;
    const videoElement = document.getElementById("video");
    const videoSection = document.getElementById("video-section");
    const fixedWrapper = document.getElementById("fixed-wrapper");
    const fixedDescription = document.getElementById("fixed-description");

    function centerElement(elementId, video) {
      const element = document.getElementById(elementId);
      const parent = element.parentElement;
      const 현재스크롤위치 = window.scrollY;
      // element의 시작부분 - (화면 길이 - element의 길이) / 2 = 화면 중앙 위치
      if (
        현재스크롤위치 >
        parent.offsetTop - (화면길이 - element.offsetHeight) / 2
      ) {
        element.style.position = "fixed";
        element.style.top = "50%";
        element.style.left = "50%";
        element.style.transform = "translate(-50%, -50%)";

        if (video) {
          video.currentTime =
            (현재스크롤위치 - videoSection.offsetTop) / videoPlayBack;
        }
      } else {
        element.style.position = "relative";
        element.style.top = "initial";
        element.style.left = "initial";
        element.style.transform = "initial";
      }
    }

    videoElement.addEventListener("loadedmetadata", () => {
      document.getElementById("video-section").style.height =
        videoElement.duration * videoPlayBack + "px";
    });

    const 글씨애니메이션나오는스크롤위치 = 2300;
    const 글씨애니메이션끝나는스크롤위치 = 2600;

    window.addEventListener("scroll", () => {
      const 현재스크롤위치 = window.scrollY;
      // li 애니메이션
      if (document.getElementById("on")) {
        document.getElementById("on").removeAttribute("id");
      }
      // 범위 안에 들어오면
      if (
        현재스크롤위치 > 리스트시작위치 &&
        현재스크롤위치 < 리스트끝나는위치
      ) {
        const tagetIndex = Math.round(
          (현재스크롤위치 - 리스트시작위치) / 리스트1개의구간
        );
        if (리스트아이템[tagetIndex]) {
          리스트아이템[tagetIndex].id = "on";
        }
      }

      // 스크롤 위치 + 화면 길이 = 스크롤 제일 밑 부분
      const 스크롤제일밑부분 = 현재스크롤위치 + 화면길이;

      //* 오른쪽 산타 이미지
      // 스크롤이 panel1Img 구간 + 100px 추가 구간 만큼 안에 들어왔을 때
      if (
        스크롤제일밑부분 > panel1Img.offsetTop &&
        스크롤제일밑부분 < panel1Img.offsetTop + panel1Img.offsetHeight + 100
      ) {
        const translateX =
          80 -
          (80 * (스크롤제일밑부분 - panel1Img.offsetTop)) /
            (panel1Img.offsetHeight + 100);

        const rotation =
          23 -
          (23 * 3.5 * (스크롤제일밑부분 - panel1Img.offsetTop)) /
            (panel1Img.offsetHeight + 100);

        SantaImg.style.transform = `translate(${translateX}px, ${13}px) rotate(${rotation}deg)`;
      }
      centerElement("fixed-wrapper", videoElement);

      // * 스크롤에 따른 비디오 재생 + 글씨 효과
      // 스크롤이 비디오를 지나갈 때
      if (
        현재스크롤위치 >
        videoSection.offsetTop +
          videoSection.offsetHeight -
          (fixedWrapper.offsetHeight +
            (화면길이 - fixedWrapper.offsetHeight) / 2)
      ) {
        fixedWrapper.style.position = "relative";
        fixedWrapper.style.top = "initial";
        fixedWrapper.style.left = "initial";
        fixedWrapper.style.transform = `translateY(${
          videoSection.offsetHeight - fixedWrapper.offsetHeight
        }px)`;
      }

      // 스크롤이 애니메이션 재생 구간일 때
      if (
        현재스크롤위치 > 글씨애니메이션나오는스크롤위치 &&
        현재스크롤위치 < 글씨애니메이션끝나는스크롤위치
      ) {
        fixedDescription.style.transform = `translateY(${
          글씨애니메이션끝나는스크롤위치 - 현재스크롤위치
        }px)`;
        console.log("ASD");
        fixedDescription.style.opacity =
          (현재스크롤위치 - 글씨애니메이션나오는스크롤위치) / 300;
        // 스크롤이 애니메이션 끝나는 위치 일 때
      } else if (현재스크롤위치 > 글씨애니메이션끝나는스크롤위치) {
        fixedDescription.style.opacity = `translateY(0px)`;
        fixedDescription.style.opacity = 1;
        // 스크롤이 위로 올라갈 때
      } else {
        fixedDescription.style.transform = `translateY(100px)`;
        fixedDescription.style.opacity = 0;
      }

      centerElement("bank-beyond");
    });

    // let currentImage = 0;

    // const sliderImages = document.querySelectorAll(".slider-image");
    // const sliderIndex = document.getElementById("slider-index");

    // const handleSlideChange = (step) => {
    //   currentImage += step;

    //   if (currentImage < 0) {
    //     currentImage = sliderImages.length - 1;
    //   } else if (currentImage >= sliderImages.length) {
    //     currentImage = 0;
    //   }

    //   sliderContentWrapper.scrollLeft = sliderImages[currentImage].offsetLeft;
    //   sliderIndex.innerText = `${currentImage + 1}/ 3`;
    // };

    // document.getElementById("left-button").addEventListener("click", () => {
    //   handleSlideChange(-1);
    // });
    // document.getElementById("right-button").addEventListener("click", () => {
    //   handleSlideChange(1);
    // });

    // const sliderContentWrapper = document.getElementById(
    //   "slider-content-wrapper"
    // );

    // sliderContentWrapper.addEventListener("scroll", () => {
    //   const imageWidth =
    //     document.querySelectorAll(".slider-image")[0].offsetWidth;

    //   currentImage = Math.round(sliderContentWrapper.scrollLeft / imageWidth);
    //   sliderIndex.innerText = `${currentImage + 1}/ 3`;
    // });
  }, []);

  return (
    <div style={{ backgroundColor: "#111" }}>
      <div id="main-image-wrapper">
        <img width="320" src={topImg} alt="coding image" />
      </div>
      <div id="intro-main">
        <p>이미 모두의 게임, LOL</p>
        <p>함께 해요.</p>
        <p id="join-us-text">Join us!</p>
        <img id="down-arrow-icon" src={arrow} alt="down arrow icon" />
      </div>
      <ul id="list-item-wrapper">
        <li className="list-item">케이틀린</li>
        <li className="list-item">카이사</li>
        <li className="list-item">바루스</li>
        <li className="list-item">미스포츈</li>
        <li className="list-item">드레이븐</li>
        <li className="list-item">제리</li>
        <li className="list-item">자야</li>
        <li className="list-item">애쉬</li>
        <li className="list-item">진</li>
        <li className="list-item">베인</li>
        <li className="list-item">이즈리얼</li>
        <li className="list-item">칼리스타</li>
        <li className="list-item">징크스</li>
        <li className="list-item">아펠리오스</li>
        <li className="list-item">사미라</li>
        <li className="list-item">루시안</li>
        <li className="list-item">세나</li>
        <li className="list-item">코르키</li>
        <li className="list-item">퀸</li>
        <li className="list-item">트위치</li>
        <li className="list-item">트리스타나</li>
        <li className="list-item">티모</li>
        <li className="list-item">아크샨</li>
        <li className="list-item">그레이브즈</li>
        <li className="list-item">시비르</li>
        <li className="list-item">아트록스</li>
        <li className="list-item">나미</li>
      </ul>
      <main>
        <section id="panel1-img">
          <img id="flying-santa-image" src={santa} alt="santa image" />
        </section>
        <section id="video-section">
          <div id="fixed-wrapper">
            <video id="video" src={animation3} muted loop></video>
            <div id="fixed-description">
              <div>캐리가 만든</div>
              <div>압도적인 성장</div>
            </div>
          </div>
        </section>
        <div id="bank-beyond-wrapper">
          <div id="bank-beyond">
            <img width="315" src={textImg} alt="text" />
          </div>
        </div>

        <div id="white-wrapper">
          <div id="slider-container">
            <div id="slider-content-wrapper">
              <div id="slider-content">
                <img
                  src="https://picsum.photos/id/10/600/600"
                  className="slider-image"
                  alt="slider image"
                />
                <img
                  src="https://picsum.photos/id/12/600/600"
                  className="slider-image"
                  alt="slider image"
                />
                <img
                  src="https://picsum.photos/id/30/600/600"
                  className="slider-image"
                  alt="slider image"
                />
              </div>
            </div>
            {/* <div className="slider-button" id="left-button">
              &lt;
            </div>
            <div className="slider-button" id="right-button">
              &gt;
            </div>
            <div id="slider-index">1/3</div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
