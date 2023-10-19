const textWhite = "background-color: black; color: white; font-size: 16px; padding: 5px 10px; border-radius: 5px;"
const textGreen = "background-color: black; color: #00ff23; font-size: 16px; padding: 5px 10px; border-radius: 5px;"
const textYellow = "background-color: black; color: #ffef00; font-size: 16px; padding: 5px 10px; border-radius: 5px;"

function getUserInteractionState() {
    const playButton = document.querySelector(".ytp-play-button")
    if (playButton.dataset.userInteraction) {
        return playButton.dataset.userInteraction // "true"
    }
    return undefined
}

function setUserInteractionState() {
    const playButton = document.querySelector(".ytp-play-button")
    playButton.setAttribute("data-user-interaction", "true")
    // display user interaction state but ignore click by extension
    if(!playButton.dataset?.continuePlaying) {
        console.log(`%cUser interaction occurred. Autoplay idle...`, textWhite)
    }
}

function resetUserInteractionState() {
    const videoPlayer = document.querySelector("video")
    const playButton = document.querySelector(".ytp-play-button")
    // attach event listeners to video player and play button
    videoPlayer.removeEventListener("click", setUserInteractionState)
    videoPlayer.addEventListener("click", setUserInteractionState)
    playButton.removeEventListener("click", setUserInteractionState)
    playButton.addEventListener("click", setUserInteractionState)
    // remove user interaction data from play button
    playButton.removeAttribute("data-user-interaction")
}

function continuePlaying() {
    setTimeout(() => {
        const playButton = document.querySelector(".ytp-play-button")
        // if play button exists
        if (playButton) {
            // get play button state by user
            const userInteractionState = getUserInteractionState()
            // get play button state by youtube
            const getYoutubePlayState = playButton.dataset.titleNoTooltip
            const isPausedByYoutube = getYoutubePlayState === "Play"

            // if play button is paused and pause was not made by user
            if (isPausedByYoutube && userInteractionState === undefined) {
                playButton.setAttribute("data-continue-playing", "true")
                playButton.click()
                playButton.removeAttribute("data-continue-playing")
                console.log("%cThe video was paused by popup. Play clicked...", textGreen)
            }
        }
    }, 0)
}

// Declare the MutationObserver outside to use unsubscribe
let buttonObserver;

// Function to subscribe the MutationObserver
function buttonSubscribe() {
    const videoPlayer = document.querySelector("video");
    const playButton = document.querySelector(".ytp-play-button");

    if (videoPlayer) {
        buttonObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    continuePlaying();
                }
            }
        });
        buttonObserver.observe(playButton, {
            attributes: true,
            attributeFilter: ['data-title-no-tooltip'],
        });
    }
}

// Function to unsubscribe the MutationObserver
function buttonUnsubscribe() {
    if (buttonObserver) {
        buttonObserver.disconnect();
    }
}

function popupRemover() {
    // collect all popups found
    const popups = document.querySelectorAll("ytd-popup-container")

    // if no popups found
    if (popups.length === 0) {
        console.log("%cNo popups found. Idling...", textWhite)
        return
    }

    // debug message
    console.log(`%cFound ${popups.length} popup${popups.length === 1 ? "." : "s."}`, textGreen);

    // remove popups if they exist
    for (const popup of popups) {
        console.log("%cRemoved popup... 👇", textGreen)
        console.log(popup)
        popup.remove()
    }

    // debug message
    console.log("%cPopup cleanup finished!", textGreen);
    console.log("%cEvent monitoring started...", textYellow);
}

// Attach MutationObserver to title element.
// Each time the title changes, that means a new page/video/event is happening, then run cleanup
// If popup tries to sneak in, it will be detected

const titleElement = document.querySelector('title')

const observer = new MutationObserver(() => {
    console.log("%cEvent detected. Searching for popups...", textYellow);
    popupRemover() // remove popups every time title changes
    resetUserInteractionState() // reset user interaction state to undefined
    buttonUnsubscribe() // unsubscribe the MutationObserver before each new event
    buttonSubscribe() // subscribe the MutationObserver
})

observer.observe(titleElement, {
    subtree: true,
    characterData: true,
    childList: true
});