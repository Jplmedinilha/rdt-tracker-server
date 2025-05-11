if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

function notifyMe(msg, silent = true, img = "img/rdt.png") {
  if (Notification.permission === "granted") {
    new Notification("Rdt tracker", {
      body: msg,
      icon: img,
      silent: silent,
    });
  }
}

let token = "meu_token_secreto";

let somAtivo = false;
const ws_url = "https://rdt-tracker-server.onrender.com";
// const ws_url = "http://10.18.60.60:3000";
const socket = io(ws_url, {
  query: {
    token: token,
  },
});

const wsIndicator = document.getElementById("wsIndicator");

socket.on("connect", () => {
  wsIndicator.style.backgroundColor = "green";
  wsIndicator.style.boxShadow = "0 0 8px green";
});

socket.on("disconnect", () => {
  wsIndicator.style.backgroundColor = "red";
  wsIndicator.style.boxShadow = "0 0 8px red";
  const onlineIndicator = document.getElementById("onlineIndicator");

  onlineIndicator.style.backgroundColor = "red";
  onlineIndicator.style.boxShadow = "0 0 8px red";
});

socket.on("updateCurrentStats", ({ hp, dren, pray, buffs }) => {
  const hpBar = document.getElementById("hpBar");
  const drenBar = document.getElementById("drenBar");
  const prayBar = document.getElementById("prayBar");

  hpBar.style.width = `${hp * 100}%`;
  drenBar.style.width = `${dren * 100}%`;
  prayBar.style.width = `${pray * 100}%`;

  document.querySelectorAll("img[data-buff]").forEach((img) => {
    const buffKey = img.getAttribute("data-buff");
    const isActive = buffs[buffKey];

    const filter = isActive ? "none" : "grayscale(100%)";
    const opacity = isActive ? "1" : "0.3";

    if (img.style.filter !== filter) img.style.filter = filter;
    if (img.style.opacity !== opacity) img.style.opacity = opacity;
  });

  const onlineIndicator = document.getElementById("onlineIndicator");

  onlineIndicator.style.backgroundColor = "green";
  onlineIndicator.style.boxShadow = "0 0 8px green";
});

socket.on("inventoryUpdate", function (data) {
  updateTable("slayerTable", data.slayer);
  updateTable("serenTable", data.seren);
  updateLog("logTable", data.log);

  //  confetes
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
  });

  if (data.log[0].itemName == "Hazelmere's signet ring") {
    const sound = document.getElementById("hsrSound");
    sound.currentTime = 0;
    sound.play().catch((e) => console.warn("Som bloqueado:", e));
    setInterval(() => {
      confetti({
        particleCount: 500,
        spread: 150,
        origin: { y: 0.9 },
      });
    }, 3000);
    notifyMe("Brooooooooooooooo HSR LMAO", false, "img/hsr.png");
  } else {
    if (somAtivo) {
      const sound = document.getElementById("coinSound");
      sound.currentTime = 0;
      sound.play().catch((e) => console.warn("Som bloqueado:", e));
    }

    const img = data.slayer[data.log[0].itemName]?.img ?? "rdt.png";

    notifyMe(
      `Andtank received ${data.log[0].quantity}x ${data.log[0].itemName}`,
      true,
      `img/${img}`
    );
  }
  showToast(
    `Andtank received ${data.log[0].quantity}x ${data.log[0].itemName}`,
    30000
  );
});

function updateBar(valor) {
  const max = 16000;
  const percent = Math.min((valor / max) * 100, 100);
  const fill = document.getElementById("progressFill");
  const text = document.getElementById("progressText");

  fill.style.width = percent + "%";
  text.textContent = `${valor.toLocaleString()} / 16,000`;

  if (valor > 0 && valor < max) {
    fill.classList.add("animated");
  } else {
    fill.classList.remove("animated");
  }
}

function updateTable(tableId, data) {
  const table = document.getElementById(tableId);
  table.innerHTML = `
                  <thead>
                      <tr>
                          <th></th>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Hits</th>
                      </tr>
                  </thead>
                  <tbody></tbody>
              `;
  const tbody = table.querySelector("tbody");

  for (const itemName in data) {
    const item = data[itemName];
    const row = document.createElement("tr");
    row.innerHTML = `
                      <td><img src="img/${item.img}" alt="${itemName}"></td>
                      <td>${itemName}</td>
                      <td>${item.qty}</td>
                      <td>${item.hits}</td>
                  `;
    tbody.appendChild(row);
  }
}

function updateLog(tableId, data) {
  const table = document.getElementById(tableId);
  table.innerHTML = `
                  <thead>
                      <tr>
                          <th>Hour</th>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Method</th>
                      </tr>
                  </thead>
                  <tbody></tbody>
              `;
  const tbody = table.querySelector("tbody");

  data?.reverse().forEach((log) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                      <td>${log.time}</td>
                      <td>${log.itemName}</td>
                      <td>${log.quantity}</td>
                      <td>${log.method}</td>
                  `;
    tbody.appendChild(row);
  });

  updateBar(data.length);
  logCount.textContent = `Items displayed: ${data.length} `;
  // updateBar(8000);
}

const logInput = document.getElementById("logFilterInput");
const logCount = document.getElementById("logCount");

logInput.addEventListener("input", atualizarFiltroLog);

function atualizarFiltroLog() {
  const filtro = logInput.value.toLowerCase();
  const linhas = document.querySelectorAll("#logTable tbody tr");
  let visiveis = 0;

  linhas.forEach((linha) => {
    const texto = linha.innerText.toLowerCase();
    const deveMostrar = texto.includes(filtro);
    linha.style.display = deveMostrar ? "" : "none";
    if (deveMostrar) visiveis++;
  });

  logCount.textContent = `Items displayed: ${visiveis} `;
}

document.getElementById("enableSound").addEventListener("click", function () {
  const sound = document.getElementById("coinSound");
  const button = document.getElementById("enableSound");

  if (!somAtivo) {
    sound
      .play()
      .then(() => {
        somAtivo = true;
        button.innerHTML = "Disable sound 🔇";
        showToast("Audio enabled");
      })
      .catch((e) => {
        console.error(e);
      });
  } else {
    somAtivo = false;
    button.innerHTML = "Enable sound 🔊";
    showToast("Audio disabled");
  }
});

let currentSlayerIndex = 0;
let currentSerenIndex = 0;

function scrollNextRow(tableId, currentIndexRef) {
  const table = document.getElementById(tableId);
  const rows = table.querySelectorAll("tbody tr");

  if (rows.length === 0) return;

  if (currentIndexRef.index >= rows.length) {
    currentIndexRef.index = 0;
  }

  const row = rows[currentIndexRef.index];
  row.scrollIntoView({ behavior: "smooth", block: "center" });
  currentIndexRef.index++;
}

const slayerRef = { index: 0 };
const serenRef = { index: 0 };

setInterval(() => {
  scrollNextRow("slayerTable", slayerRef);
  scrollNextRow("serenTable", serenRef);
}, 60 * 1000);

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const toastBar = document.getElementById("toastBar");

  toastMessage.textContent = message;
  toast.style.display = "block";

  toastBar.style.transition = "none";
  toastBar.style.width = "100%";

  setTimeout(() => {
    toastBar.style.transition = `width ${duration}ms linear`;
    toastBar.style.width = "0%";
  }, 50);

  setTimeout(() => {
    toast.style.display = "none";
  }, duration);
}

function toggleFullscreen() {
  const doc = document.documentElement;

  if (!document.fullscreenElement) {
    if (doc.requestFullscreen) {
      doc.requestFullscreen();
    } else if (doc.webkitRequestFullscreen) {
      // Safari
      doc.webkitRequestFullscreen();
    } else if (doc.msRequestFullscreen) {
      // IE/Edge antigo
      doc.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

let wakeLock = null;

async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
      console.log("Wake Lock ativado");

      wakeLock.addEventListener("release", () => {
        console.log("Wake Lock liberado");
      });
    } else {
      console.warn("Wake Lock API não suportada neste navegador.");
    }
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

document.addEventListener("visibilitychange", () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    requestWakeLock();
  }
});

window.addEventListener("load", requestWakeLock);

//auto scroll do profileWrapper

const wrapper = document.getElementById("profileWrapper");

let direction = 1; // 1 = scroll para direita, -1 = volta
let scrollAmount = 0;

function autoScroll() {
  if (!wrapper) return;

  const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

  scrollAmount += direction * 1;
  wrapper.scrollLeft = scrollAmount;

  if (scrollAmount >= maxScroll || scrollAmount <= 0) {
    direction *= -1;
  }

  requestAnimationFrame(autoScroll);
}

window.addEventListener("load", () => {
  if (wrapper.scrollWidth > wrapper.clientWidth) {
    autoScroll();
  }
});
