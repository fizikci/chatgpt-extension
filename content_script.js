let findQuestion = (e) => {
  let q = e;
  while (q) {
    if (q.getAttribute("class")?.includes("group w-full text-gray-800")) break;
    q = q.parentElement;
  }
  return q;
};

document.onclick = (e) => {
  let q = findQuestion(e.target);
  if (!q) return;

  if (q.querySelector("img")) {
    let a = q.nextSibling;
    if (!a) return;

    if (a.style.display == "none") {
      a.style.display = "block";
    } else {
      a.style.display = "none";
    }

    document.querySelectorAll(".group.w-full.text-gray-800").forEach((qa) => {
      if (qa.querySelector("img")) return;
      if (qa !== a) qa.style.display = "none";
    });
  }
};
