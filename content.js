function addCopyButtons() {
  const tweets = document.querySelectorAll("article[role='article']");

  tweets.forEach(tweet => {
    if (tweet.querySelector(".copy-tweet-button")) return;

    const tweetLinkElement = tweet.querySelector("a[href*='/status/']");
    if (!tweetLinkElement) return;
    let tweetURL = tweetLinkElement.href;
    tweetURL = tweetURL.replace(/\/status\/(\d+)\/(photo|video)\/\d+$/, '/status/$1');

    const copyTextButton = document.createElement("img");
    copyTextButton.src = chrome.runtime.getURL("icon1.png");
    copyTextButton.alt = "Copy Tweet Text";
    copyTextButton.className = "copy-tweet-button";

    copyTextButton.style.marginLeft = "5px";
    copyTextButton.style.width = "35px";
    copyTextButton.style.height = "35px";
    copyTextButton.style.cursor = "pointer";
    copyTextButton.style.verticalAlign = "middle";
    copyTextButton.style.position = "static";
    copyTextButton.style.top = "";
    copyTextButton.style.zIndex = "10";

    copyTextButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const tweetTextElement = tweet.querySelector("div[lang]");
      if (!tweetTextElement) return;
      const tweetText = tweetTextElement.innerText;

      navigator.clipboard.writeText(tweetText)
        .then(() => {
          copyTextButton.src = chrome.runtime.getURL("success.png");
          setTimeout(() => {
            copyTextButton.src = chrome.runtime.getURL("icon1.png");
          }, 1000);
        })
        .catch(err => console.error("TwiCopia-Error FAILED-TO-COPY-TEXT: ", err));
    });

    const urlButton = document.createElement("img");
    urlButton.src = chrome.runtime.getURL("icon2.png");
    urlButton.alt = "Get URL";
    urlButton.className = "url-tweet-button";

    urlButton.style.marginLeft = "5px";
    urlButton.style.width = "35px";
    urlButton.style.height = "35px";
    urlButton.style.cursor = "pointer";
    urlButton.style.verticalAlign = "middle";
    urlButton.style.position = "static";
    urlButton.style.top = "";
    urlButton.style.zIndex = "10";

    function updateDropdownStyle(dropdown) {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      dropdown.style.backgroundColor = isDarkMode ? "#1e1e1e" : "#fff";
      dropdown.style.color = isDarkMode ? "#fff" : "#000";
      dropdown.style.border = isDarkMode ? "1px solid #333" : "1px solid #ccc";
    }

    const dropdown = document.createElement("div");
    dropdown.style.display = "none";
    dropdown.style.position = "absolute";
    dropdown.style.bottom = "40px";
    dropdown.style.right = "0px";
    dropdown.style.borderRadius = "4px";
    dropdown.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    dropdown.style.zIndex = "20";
    dropdown.style.padding = "5px";
    updateDropdownStyle(dropdown);

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      updateDropdownStyle(dropdown);
    });

    const normalURL = document.createElement("div");
    normalURL.textContent = "Normal";
    normalURL.style.padding = "5px 10px";
    normalURL.style.cursor = "pointer";
    normalURL.addEventListener("click", (event) => {
      event.stopPropagation();
      navigator.clipboard.writeText(tweetURL)
        .then(() => {
          normalURL.textContent = "done.";
          setTimeout(() => {
            normalURL.textContent = "Normal";
            dropdown.style.display = 'none'; 
          }, 1000);
        })
        .catch(err => console.error("TwiCopia-Error FAILED-TO-COPY-RAW-LINK: ", err));
    });

    const discordURL = document.createElement("div");
    discordURL.textContent = "Discord";
    discordURL.style.padding = "5px 10px";
    discordURL.style.cursor = "pointer";
    discordURL.addEventListener("click", (event) => {
      event.stopPropagation();
      const discordLink = tweetURL.replace("x.com", "fxtwitter.com");
      navigator.clipboard.writeText(discordLink)
        .then(() => {
          discordURL.textContent = "done.";
          setTimeout(() => {
            discordURL.textContent = "Discord";
            dropdown.style.display = 'none'; 
          }, 1000);
        })
        .catch(err => console.error("TwiCopia-Error FAILED-TO-COPY-FXTWITTER-LINK: ", err));
    });

    [normalURL, discordURL].forEach(option => {
      option.style.backgroundColor = "transparent";
      option.addEventListener("mouseover", () => option.style.backgroundColor = "#f0f0f0");
      option.addEventListener("mouseout", () => option.style.backgroundColor = "transparent");
      dropdown.appendChild(option);
    });

    urlButton.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    });

    urlButton.addEventListener("blur", () => {
      setTimeout(() => dropdown.style.display = "none", 200);
    });

    dropdown.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    const actionArea = tweet.querySelector("[role='group']");
    if (actionArea) {
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.marginLeft = "8px";

      container.appendChild(copyTextButton);
      container.appendChild(urlButton);
      container.appendChild(dropdown);

      actionArea.appendChild(container);
    }
  });
}

const observer = new MutationObserver(() => {
  addCopyButtons();
});
observer.observe(document.body, { childList: true, subtree: true });

