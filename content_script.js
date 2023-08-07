(function () {

  let chatId = "";
  if (location.pathname.startsWith('/c/')) chatId = location.pathname.split('/')[2];

  let onload = () => {
    let sessionSettings = JSON.parse(localStorage.getItem(chatId));
    document.querySelectorAll(".group.w-full").forEach((qa, index) => {
      if (qa.querySelector("img")) {
        let entryNo = Math.floor(index / 2);
        qa.setAttribute('data-entry-no', entryNo);
        if (sessionSettings?.deleted?.includes(entryNo)) {
          deleteQA(qa);
        }
        return;
      }
      qa.style.display = "none";
    });
  }
  setTimeout(onload, 1000);

  function deleteQA(qa) {
    let entryNo = parseInt(qa.getAttribute('data-entry-no'));
    qa.style.display = "none";
    qa.nextSibling.style.display = "none";

    let btn = document.createElement('button');
    btn.style = "background:#ffa5003d;font-size:10px";
    btn.id = 'btnRestore' + entryNo;
    btn.innerHTML = "restore deleted message";

    qa.parentElement.insertBefore(btn, qa);

    btn.onclick = () => restoreQA(qa);
  }
  function restoreQA(qa) {
    let entryNo = parseInt(qa.getAttribute('data-entry-no'));
    qa.style.display = "block";
    qa.nextSibling.style.display = "block";

    document.getElementById('btnRestore' + entryNo).remove();

    let sessionSettings = JSON.parse(localStorage.getItem(chatId));
    sessionSettings.deleted = sessionSettings.deleted.filter(i => i != entryNo);
    if (sessionSettings.deleted.length == 0) localStorage.removeItem(chatId);
    else localStorage.setItem(chatId, JSON.stringify(sessionSettings));
  }

  setInterval(() => {

    document.querySelectorAll(".group.w-full").forEach((qa, i) => {
      if (qa.querySelector('.btnDelete')) return;

      if (location.pathname.startsWith('/c/')) {
        let newChatId = location.pathname.split('/')[2];
        if (newChatId != chatId) {
          chatId = newChatId;
          onload();
        }
      }

      let entryNo = Math.floor(i / 2);
      qa.setAttribute('data-entry-no', entryNo);

      let isPrompt = qa.querySelector("img");

      if (isPrompt) {
        let buttonContainer = qa.children[0].children[1].querySelector('button').parentElement;

        let btnDelete = document.createElement('button');
        btnDelete.className = "btnDelete p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible";
        btnDelete.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
        buttonContainer.insertBefore(btnDelete, buttonContainer.firstChild);

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

        if (chatId) {
          btnDelete.onclick = (event) => {
            let sessionSettings = localStorage.getItem(chatId);
            if (!sessionSettings) {
              sessionSettings = { deleted: [] };
              localStorage.setItem(chatId, JSON.stringify(sessionSettings));
            }
            else sessionSettings = JSON.parse(sessionSettings);
            sessionSettings.deleted.push(entryNo);
            localStorage.setItem(chatId, JSON.stringify(sessionSettings));
            deleteQA(qa);
            event.stopPropagation();
          };
        }
      }
    });
  }, 1000);

})();