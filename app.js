const express = require("express");
const axios = require("axios");

const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const rdtMaster = [
  { id: 1, name: "Uncut dragonstone", img: "1.png", ge_price: 0, ge_id: 1631 },
  { id: 2, name: "Loop half of a key", img: "2.png", ge_price: 0, ge_id: 987 },
  { id: 3, name: "Tooth half of a key", img: "3.png", ge_price: 0, ge_id: 985 },
  {
    id: 4,
    name: "Huge plated rune salvage",
    img: "4.png",
    ge_price: 0,
    ge_id: 47314,
  },
  { id: 5, name: "Magic logs", img: "5.png", ge_price: 0, ge_id: 1513 },
  { id: 6, name: "Rune arrowheads", img: "6.png", ge_price: 0, ge_id: 44 },
  { id: 7, name: "Soft clay", img: "7.png", ge_price: 0, ge_id: 1761 },
  {
    id: 8,
    name: "Small bladed orikalkum salvage",
    img: "8.png",
    ge_price: 0,
    ge_id: 52945,
  },
  {
    id: 9,
    name: "Catalytic anima stone",
    img: "9.png",
    ge_price: 0,
    ge_id: 54019,
  },
  { id: 10, name: "Teak plank", img: "10.png", ge_price: 0, ge_id: 8780 },
  { id: 11, name: "Dragon bones", img: "11.png", ge_price: 0, ge_id: 536 },
  { id: 12, name: "Dragon helm", img: "12.png", ge_price: 0, ge_id: 1149 },
  { id: 13, name: "Dragon longsword", img: "13.png", ge_price: 0, ge_id: 1305 },
  {
    id: 14,
    name: "Off-hand dragon longsword",
    img: "14.png",
    ge_price: 0,
    ge_id: 25740,
  },
  { id: 15, name: "Molten glass", img: "15.png", ge_price: 0, ge_id: 1775 },
  {
    id: 16,
    name: "Runite stone spirit",
    img: "16.png",
    ge_price: 0,
    ge_id: 44808,
  },
  { id: 17, name: "Raw lobster", img: "17.png", ge_price: 0, ge_id: 377 },
  { id: 18, name: "Shield left half", img: "18.png", ge_price: 0, ge_id: 2366 },
  { id: 19, name: "Dragon spear", img: "19.png", ge_price: 0, ge_id: 1249 },
  { id: 20, name: "Yew logs", img: "20.png", ge_price: 0, ge_id: 1515 },
  {
    id: 21,
    name: "Super restore (4)",
    img: "21.png",
    ge_price: 0,
    ge_id: 3024,
  },
  {
    id: 22,
    name: "Prayer potion (4)",
    img: "22.png",
    ge_price: 0,
    ge_id: 2434,
  },
  { id: 23, name: "Raw rocktail", img: "23.png", ge_price: 0, ge_id: 15270 },
  { id: 24, name: "Mahogany plank", img: "24.png", ge_price: 0, ge_id: 8782 },
  { id: 25, name: "Magic seed", img: "25.png", ge_price: 0, ge_id: 5316 },
  { id: 26, name: "Water talisman", img: "26.png", ge_price: 0, ge_id: 1444 },
  { id: 27, name: "Battlestaff", img: "27.png", ge_price: 0, ge_id: 1391 },
  {
    id: 28,
    name: "Hardened dragon bones",
    img: "28.png",
    ge_price: 0,
    ge_id: 35008,
  },
  { id: 29, name: "Onyx bolt tips", img: "29.png", ge_price: 0, ge_id: 9194 },
  { id: 30, name: "Ciku seed", img: "30.png", ge_price: 0, ge_id: 48769 },
  {
    id: 31,
    name: "Golden dragonfruit seed",
    img: "31.png",
    ge_price: 0,
    ge_id: 48764,
  },
  { id: 32, name: "Uncut diamond", img: "32.png", ge_price: 0, ge_id: 1617 },
  { id: 33, name: "Soul rune", img: "33.png", ge_price: 0, ge_id: 566 },
  {
    id: 34,
    name: "Light animica stone spirit",
    img: "34.png",
    ge_price: 0,
    ge_id: 44814,
  },
  {
    id: 35,
    name: "Dark animica stone spirit",
    img: "35.png",
    ge_price: 0,
    ge_id: 44815,
  },
  {
    id: 36,
    name: "Primal stone spirit",
    img: "36.png",
    ge_price: 0,
    ge_id: 57174,
  },
  { id: 37, name: "Crystal key", img: "37.png", ge_price: 0, ge_id: 989 },
  { id: 38, name: "White berries", img: "38.png", ge_price: 0, ge_id: 239 },
  { id: 39, name: "Ectoplasm", img: "39.png", ge_price: 0, ge_id: 55336 },
  {
    id: 40,
    name: "Medium spiky orikalkum salvage",
    img: "40.png",
    ge_price: 0,
    ge_id: 51103,
  },
  {
    id: 41,
    name: "Large blunt necronium salvage",
    img: "41.png",
    ge_price: 0,
    ge_id: 53507,
  },
  {
    id: 42,
    name: "Wine of Saradomin",
    img: "42.png",
    ge_price: 0,
    ge_id: 28256,
  },
  { id: 43, name: "Aura refresh", img: "43.png", ge_price: 0, ge_id: 0 },
  {
    id: 44,
    name: "Distraction & Diversion reset token (daily)",
    img: "44.png",
    ge_price: 0,
    ge_id: 0,
  },
  {
    id: 45,
    name: "Distraction & Diversion reset token (weekly)",
    img: "45.png",
    ge_price: 0,
    ge_id: 0,
  },
  {
    id: 46,
    name: "Distraction & Diversion reset token (monthly)",
    img: "46.png",
    ge_price: 0,
    ge_id: 0,
  },
  { id: 47, name: "Vecna skull", img: "47.png", ge_price: 0, ge_id: 20667 },
  { id: 48, name: "Cheese+tom batta", img: "48.png", ge_price: 0, ge_id: 2259 },
  {
    id: 49,
    name: "Blurberry Special",
    img: "49.png",
    ge_price: 0,
    ge_id: 2064,
  },
  {
    id: 50,
    name: "Hazelmere's signet ring",
    img: "hsr.png",
    ge_price: 0,
    ge_id: 39814,
  },
];

let lastData = {};

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const VALID_TOKEN = "meu_token_secreto";

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  const token = socket.handshake.query.token;
  if (token != VALID_TOKEN) {
    return;
  }
  io.emit("inventoryUpdate", { ...lastData, first: true });

  socket.on("updateInventory", (data) => {
    let totalValue = 0;

    for (const category in data) {
      const items = data[category];

      for (const itemName in items) {
        const itemData = items[itemName];
        const itemId = Number(itemData.id);

        const matchedItem = rdtMaster.find((r) => r.id === itemId);

        if (matchedItem && matchedItem.ge_price) {
          totalValue += matchedItem.ge_price * itemData.qty;
        }
      }
    }

    lastData = { ...data, totalValue: parsePriceBack(totalValue) };

    io.emit("inventoryUpdate", lastData);
  });

  socket.on("updateCurrentStats", (data) => {
    // console.log(data);
    io.emit("updateCurrentStats", data);
  });
});

server.listen(3000, () => {
  console.log("Servidor ouvindo em http://localhost:3000");
});

function parsePrice(priceRaw) {
  if (typeof priceRaw === "number") return priceRaw;

  if (typeof priceRaw === "string") {
    const priceStr = priceRaw.replace(/,/g, "").toLowerCase();
    const suffixMultipliers = {
      k: 1_000,
      m: 1_000_000,
      b: 1_000_000_000,
    };

    const suffix = priceStr.slice(-1);
    const multiplier = suffixMultipliers[suffix];

    if (multiplier) {
      const numericPart = parseFloat(priceStr.slice(0, -1));
      return Math.round(numericPart * multiplier);
    }

    return parseInt(priceStr, 10);
  }

  return 0; // fallback
}

function parsePriceBack(value) {
  if (typeof value !== "number" || isNaN(value)) return "0";

  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "b";
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  } else {
    return value.toString();
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAndUpdatePrices() {
  for (const item of rdtMaster) {
    if (item.ge_id === 0) {
      continue;
    }

    try {
      const url = `https://secure.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=${item.ge_id}`;
      const response = await axios.get(url, { timeout: 10000 });
      const priceRaw = response.data.item.current.price;
      const price = parsePrice(priceRaw);

      if (!isNaN(price)) {
        item.ge_price = price;
      }
    } catch (error) {
      console.error(`Erro ao buscar preço: ${item.name}:`, error.message);
    }

    await delay(5000); // avoid jagex anti-spam
  }
}

fetchAndUpdatePrices();
setInterval(fetchAndUpdatePrices, 60 * 60 * 1000); //updte prices every hour
