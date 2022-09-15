import "./Styles.css";
import ViteLogo from "/ViteWithEyes.svg";
import SkyMeteor from "/SkyMeteor.svg";

let App = document.getElementById("App");

// Rendering every 10 milliseconds. (less = better & fast)
SkyAutoRender(10);

// Creating memories to save the current rotate for Vite logo and the current score.
SkyCreateMemories({
    Rotate: 0,
    Score: 0
});

// Building the app interface.
// For the 20th line we used style="transform: rotate(((Rotate))deg)" to rotate Vite logo when the memory "Rotate" changes
// and we can't change it with the style object in javascript because Sky.js reads just HTML files.
App.innerHTML += `
<div id="Container">
<h1 id="Heading">Sky.js & Vite App</h1>
<h4 id="GameStart">To start the game click on the page.</h4>
<img SkyElement id="ViteLogo" src="${ViteLogo}" style="transform: rotate(((Rotate))deg)" />
<h3 id="Docs">Learn how to use Vite by <a href="https://vitejs.dev" target="_blank">clicking here</a>
<br>Learn how to use Sky.js by <a href="https://sky-js.pages.dev" target="_blank">clicking here</a></h3>
<div>
<h1 SkyElement id="Score" class="Hide">Your Score: ((Score))</h1>
<h3 id="GameExplain" class="Hide">Shoot meteors to increase your score</h3></div>
</div>
<div id="shootingCenter"></div>
<div id="Overlay" class="Hide"></div>
`;

// Watching the "Rotate" memory and if it changes, this function will automatically be called.
SkyWatchMemory("Rotate", () => {
    setTimeout(() => {
        // Updating the "Rotate" memory to recall the function above. (infinite loop)
        SkyUpdateMemory("Rotate", (Icon) => Icon += 1);

        // Launching the bullets to the top.
        [...document.querySelectorAll("#Bullet")].forEach(Bullet => {
            if (+Bullet.style.top.split("px")[0] < 0) return App.removeChild(Bullet);
            let BulletLeft = +Bullet.offsetLeft;
            let BulletTop = +Bullet.offsetTop;

            // Filtering the nearest meteors for the bullet.
            let Meteors = [...document.querySelectorAll("#Meteor")].filter(Meteor =>
                ((BulletLeft - Meteor.offsetLeft <= 15 && BulletLeft - Meteor.offsetLeft > -15) ||
                    (Meteor.offsetLeft - BulletLeft <= 15 && Meteor.offsetLeft - BulletLeft > -15)) &&
                BulletTop - Meteor.offsetTop <= 10);

            // If there's a near meteor, it will be destroyed, even the bullet, and of course increase the score.
            if (Meteors[0]) {
                App.removeChild(Meteors[0]);
                App.removeChild(Bullet);
                SkyUpdateMemory("Score", (Score) => Score += 1);
            };

            Bullet.style.top = `${Bullet.offsetTop - 10}px`;
        });

        // Falling the meteors to the bottom.
        [...document.querySelectorAll("#Meteor")].forEach(Meteor => {

            // If there's a meteor reached the bottom, it will ending the game, else continue with falling the meteors.
            if (+Meteor.style.bottom.split("px")[0] < -120) {
                setTimeout(() => {
                    FirstClick = true;
                    [...document.querySelectorAll("#Meteor")].forEach(Meteor => {
                        App.removeChild(Meteor);
                    });
                }, 20);
                document.getElementById("Docs").classList.remove("Hide");
                document.getElementById("Heading").classList.remove("Hide");
                document.getElementById("GameStart").classList.remove("Hide");
                document.getElementById("ViteLogo").classList.remove("Hide");
                document.getElementById("Score").classList.add("Hide");
                document.getElementById("Overlay").classList.add("Hide");
                document.getElementById("GameExplain").classList.add("Hide");
                SkyUpdateMemory("Score", (Score) => Score = 0);
            } else Meteor.style.bottom = `${+Meteor.style.bottom.split("px")[0] - 3}px`;
        });
    }, 10);
});

// Updating the "Rotate" memory once to start calling the above watch function.
SkyUpdateMemory("Rotate", (Icon) => Icon += 1);

// Moving the shooting center to the cursor position.
let MousePosition;
document.addEventListener("mousemove", (e) => {
    let shootingCenter = document.getElementById("shootingCenter");
    shootingCenter.style.left = `${e.clientX}px`;
    MousePosition = e.clientX;
});

// Shoot bullets when clicking on the page.
let FirstClick = true;
document.addEventListener("click", () => {
    if (FirstClick) { // Starting the game when clicking the page for the first time.
        FirstClick = false;
        document.getElementById("Docs").classList.add("Hide");
        document.getElementById("Heading").classList.add("Hide");
        document.getElementById("GameStart").classList.add("Hide");
        document.getElementById("ViteLogo").classList.add("Hide");
        document.getElementById("Overlay").classList.remove("Hide");
        document.getElementById("Score").classList.remove("Hide");
        document.getElementById("GameExplain").classList.remove("Hide");
    };
    let Bullet = document.createElement("span");
    Bullet.id = "Bullet";
    Bullet.style.top = `${window.innerHeight - 40}px`;
    Bullet.style.left = `${MousePosition + 22}px`;
    App.appendChild(Bullet);
});


// Throwing meteors at random places if the game started.
setInterval(() => {
    if (FirstClick) return;
    let Random = Math.floor(Math.random() * window.innerWidth);
    ThrowMeteor(Random > 500 ? Random - 20 : Random + 20);
}, 1000);

function ThrowMeteor(Left) {
    let Meteor = document.createElement("img");
    Meteor.src = SkyMeteor;
    Meteor.id = "Meteor";
    Meteor.style.left = `${Left}px`;
    Meteor.style.bottom = `${window.innerHeight}px`;
    App.appendChild(Meteor);
};
