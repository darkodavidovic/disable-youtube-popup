const textWhite = "background-color: black; color: white; font-size: 16px; padding: 5px 10px; border-radius: 5px;"
const textGreen = "background-color: black; color: #00ff23; font-size: 16px; padding: 5px 10px; border-radius: 5px;"
const textYellow = "background-color: black; color: #ffef00; font-size: 16px; padding: 5px 10px; border-radius: 5px;"

function remover() {
    // collect all popups found
    const popups = document.querySelectorAll("ytd-popup-container")

    // get play button
    const playButton = document.querySelector("ytp-play-button")

    // if play button exists
    if (playButton) {
        // get play button state
        const playButtonState = playButton.getAttribute("data-title-no-tooltip")
        const isPaused = playButtonState === "Play"

        // if play button is paused, click it to play
        if (isPaused) {
            console.log("%cButton was paused. Clicking...", textGreen)
            playButton.click()
        }
    }

    // if no popups found
    if (popups.length === 0) {
        console.log("%cNo popups found. Exiting...", textWhite)
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
    console.log("%cEvent detected on the page. Searching for popups...", textYellow);
    remover()
})

observer.observe(titleElement, {
    subtree: true,
    characterData: true,
    childList: true
});