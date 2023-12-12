(function () {
  var selectorForQandADivs = "div.w-full.text-token-text-primary";
  let chatId = "";

  setInterval(() => {
    let firstTime = true;
    if (location.pathname.startsWith('/c/')) {
      let newChatId = location.pathname.split('/')[2];
      firstTime = (newChatId != chatId);
      chatId = newChatId;
    }

    document.querySelectorAll(selectorForQandADivs).forEach((qa, i) => {
      if (qa.getAttribute('data-entry-no')) {
        return;
      }

      if (i % 2 === 0) { // this is a new message from user

        let qaTitle = qa.querySelector('div.break-words > div');
        qaTitle.style.cursor = "pointer";
        qaTitle.onclick = (event) => {
          let a = qa.nextSibling;
          if (!a) return;

          if (a.style.display == "none") {
            a.style.display = "block";
          } else {
            a.style.display = "none";
          }

          event.stopPropagation();
        };

      } else {
        if (firstTime) qa.style.display = 'none';
      }

      qa.setAttribute('data-entry-no', i + 1);
    });
  }, 1000);

})();