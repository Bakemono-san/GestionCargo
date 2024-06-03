import {
  Cargo,
  Product,
  User,
  fullIndicator,
  Status,
  CargoType,
  State,
  ChemicalProduct,
  Tonicity,
  MaterialProduct,
  AerialCargo,
  MaritimeCargo,
  RoadCargo,
  FoodProduct,
} from "./Cargos.js";
emailjs.init("tEhx_KOTiWjrPT4gB");

let data: any;
let page = 0;
let el = 5;
let donnee: Cargo[];

const getLocationName = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    if (data && data.display_name) {
      return data.address.country;
    } else {
      return "Location name not found";
    }
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "Error fetching location name";
  }
};

let startPoint: L.LatLng | null = null;
let endPoint: L.LatLng | null = null;
let line: L.Polyline | null = null;
let startingLocation: string;
let endingLocation: string;
let distance: number;

let map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Event listener for clicking on the map
map.on("click", async (e: L.LeafletMouseEvent) => {
  if (!startPoint) {
    startPoint = e.latlng; // Set the start point
    L.marker(startPoint).addTo(map); // Add a marker for the start point
  } else if (!endPoint) {
    endPoint = e.latlng; // Set the end point
    L.marker(endPoint).addTo(map); // Add a marker for the end point

    // Calculate the distance between the two points
  }

  distance = Math.round(startPoint.distanceTo(endPoint!));
  // Get the starting location name
  startingLocation = await getLocationName(startPoint.lat, startPoint.lng);
  let start = document.querySelector("#start") as HTMLElement;
  start.innerText = startingLocation;

  // Get the ending location name
  endingLocation = await getLocationName(endPoint!.lat, endPoint!.lng);
  let end = document.querySelector("#end") as HTMLElement;
  end.innerText = endingLocation;

  // Draw a line between the two points
  line = L.polyline([startPoint, endPoint!], {
    color: "red",
  }).addTo(map);
});

let fullIndicator = document.getElementById(
  "fullIndicator"
) as HTMLSelectElement;
let indicator = document.getElementById("indicator") as HTMLElement;
fullIndicator.addEventListener("input", (e) => {
  if (fullIndicator.selectedOptions[0].value == "weight") {
    indicator.innerText = "Max weight in kg:";
  } else {
    indicator.innerText = "Number of product";
  }
});

function validateCargo() {
  let start = document.querySelector("#start") as HTMLElement;
  let end = document.querySelector("#end") as HTMLElement;
  let startingDate = document.querySelector(
    "#startingDate"
  ) as HTMLInputElement;
  let endingDate = document.querySelector("#endingDate") as HTMLInputElement;

  if (start.innerText == "") {
    start.style.outline = "1px solid red";
  } else if (!end.innerText) {
    end.style.outline = "1px solid red";
  } else if (!startingDate.value) {
    startingDate.style.border = "1px solid red";
  } else if (!endingDate.value) {
    endingDate.style.border = "1px solid red";
  }
}

function generateCargoID(): number {
  return Math.floor(Math.random() * 1000) + 1; // Just a simple random number generator for demonstration
}

let addCargo = document.getElementById("addCargo") as HTMLElement;
addCargo.addEventListener("click", () => {
  createCargoFromForm();
  document.querySelector(".overlay")!.classList.remove("flex");
  document.querySelector(".overlay")!.classList.add("hidden");
  document.querySelector(".card")!.classList.remove("right-2");
  document.querySelector(".card")!.classList.add("-right-full");
  validateCargo();
});

function toggleSlide(index: number) {
  getProductType();
  let btnSliderAddProduct = document.getElementById(
    "btnSliderAddProduct"
  ) as HTMLElement;

  let sliderAddProduct = document.getElementById(
    "sliderAddProduct"
  ) as HTMLElement;
  let addProductForm = document.getElementById("addProductForm") as HTMLElement;

  btnSliderAddProduct.addEventListener("click", () => {
    if (sliderAddProduct.classList.contains("w-2")) {
      sliderAddProduct.classList.remove("w-2");
      sliderAddProduct.classList.add("w-1/2");
      addProductForm.classList.remove("hidden");
      addProductForm.classList.add("flex");
      btnSliderAddProduct.classList.add("bg-blue-500");
    } else {
      sliderAddProduct.classList.add("w-2");
      sliderAddProduct.classList.remove("w-1/2");
      addProductForm.classList.add("hidden");
      addProductForm.classList.remove("flex");
    }
  });

  btnSliderAddProduct.addEventListener("click", () => {
    if (sliderAddProduct.classList.contains("w-1/2")) {
      sliderAddProduct.classList.add("w-2");
      sliderAddProduct.classList.remove("w-1/2");
      addProductForm.classList.add("hidden");
    }
  });

  let cargo = data![index];
  let submitBtn = document.getElementById("addProduct") as HTMLElement;
  submitBtn.addEventListener("click", () => {
    let product = getProduct();
    data![index].addProduct(product);
    sendEmail(product.ProductID)
    sendToJson();
  });
}

function filter() {
  let filterAll = document.getElementById("filterAll") as HTMLInputElement;
  let filterType = document.getElementById("filterType") as HTMLSelectElement;
  let filterStatus = document.getElementById(
    "filterStatus"
  ) as HTMLSelectElement;
  let filterStep = document.getElementById("filterStep") as HTMLSelectElement;

  filterAll.addEventListener("keyup", (e: any) => {
    donnee = data!.filter((cargo: Cargo) => {
      return (
        cargo.typeOfCargo
          .toLowerCase()
          .includes(filterAll.value.toLowerCase().trim()) ||
        cargo.cargoStatus
          .toLowerCase()
          .includes(filterAll.value.toLowerCase().trim()) ||
        cargo.cargoFrom
          .toLowerCase()
          .includes(filterAll.value.toLowerCase().trim()) ||
        cargo.cargoTo
          .toLowerCase()
          .includes(filterAll.value.toLowerCase().trim()) ||
        cargo.getId.toString().includes(filterAll.value.toLowerCase().trim()) ||
        cargo.cargoStartingDate
          .toLowerCase()
          .includes(filterAll.value.toLowerCase().trim()) ||
        cargo.cargoEndingDate
          .toLowerCase()
          .includes(filterAll.value.toLowerCase().trim())
      );
    });
    donnee = donnee.slice(page * el, page * el + el);

    displayListCargos();
  });

  filterType.addEventListener("change", (e: any) => {
    donnee = data!.filter((cargo: Cargo) => {
      return cargo.typeOfCargo
        .toLowerCase()
        .includes(filterType.selectedOptions[0].value.toLowerCase());
    });
    donnee = donnee.slice(page * el, page * el + el);

    displayListCargos();
  });

  filterStatus.addEventListener("change", (e: any) => {
    donnee = data!.filter((cargo: Cargo) => {
      return cargo.cargoGlobalState
        .toLowerCase()
        .includes(filterStatus.selectedOptions[0].value.toLowerCase());
    });
    donnee = donnee.slice(page * el, page * el + el);
    displayListCargos();
  });

  filterStep.addEventListener("change", (e: any) => {
    donnee = data!.filter((cargo: Cargo) => {
      return cargo.cargoStatus
        .toLowerCase()
        .includes(filterStep.selectedOptions[0].value.toLowerCase());
    });
    donnee = donnee.slice(page * el, page * el + el);
    displayListCargos();
  });
}

function showDetailCargo(index: number) {
  let upgrade = document.getElementById("upgrade") as HTMLElement;
  upgrade.classList.add("bg-green-400");
  upgrade.classList.remove("bg-gray-300");
  upgrade.classList.remove("cursor-not-allowed");
  upgrade.classList.remove("text-slate-800");

  let cargo = data![index];
  console.log(cargo.totalPrice());

  if (cargo.cargoStatus == "loading") {
    upgrade.innerText = "start";
  } else if (cargo.cargoStatus == "transporting") {
    upgrade.innerText = "deliver";
  } else if (cargo.cargoStatus == "delivered") {
    upgrade.innerText = "delivered";
  } else {
    upgrade.innerText = "losted";
  }
  let cargoDetails = document.getElementById("cargoDetails") as HTMLElement;
  let productModel = data![index].listOfProducts
    .map((product: Product, indexProduct: number) => {
      return `<div class="flex"><p class="px-2 py-1 bg-slate-500 text-white rounded-l text-center">${product.productName}</p><p class="bg-red-600 text-white rounded-r px-2 py-1" data-indexProduct="${indexProduct}" data-indexCargo="${index}" id="delete">X</p></div>`;
    })
    .join("");
  let model = `<div class="flex-1 p-8 text-gray-100 flex flex-col justify-between">
    <div class="flex justify-between">
        <h1 class="text-2xl">Cargo ${cargo.id} </h1>
        <p class="px-2 py-1 bg-blue-500 text-white rounded text-center">${
          cargo.typeOfCargo
        }</p>
    </div>

    <div class="flex justify-between">
    <div>
        <h1 class="text-xl">Max weight : </h1>
        <p>${cargo.totalWeight}/${cargo.cargoMaxWeight} kg</p>
    </div>
    
    </div>
    <div class="flex justify-between">
    <div>
    <h1 class="text-xl">Steps : </h1>
    <p class="px-2 py-1 bg-gray-500 text-white rounded text-center" id="setStatus">${
      cargo.cargoStatus
    }</p>
</div><div>
<h1 class="text-xl">Status : </h1>
<p class="px-2 py-1 bg-green-500 text-white rounded text-center cursor-pointer" id="setGlobalState">${
    cargo.cargoGlobalState
  }</p>
</div>
    </div>

    <div class="flex justify-between">

        <div>
            <h1 class="text-xl">Starting location : </h1>
            <p>${cargo.from}</p>
        </div>

        <div>
            <h1 class="text-xl">ending Location : </h1>
            <p>${cargo.to}</p>
        </div>
    </div>

    <div class="flex justify-between">

        <div>
            <h1 class="text-xl">Starting Date : </h1>
            <p>${cargo.startingDate}</p>
        </div>

        <div>
            <h1 class="text-xl">Ending Date : </h1>
            <p>${cargo.endingDate}</p>
        </div>
    </div>
    <div class="flex justify-between">

    <div>
        <h1 class="text-xl">Distance : </h1>
        <p>${cargo.distance} km</p>
    </div>
    <div>
        <h1 class="text-xl">Prix : </h1>
        <p>${cargo.totalPrice()} fcfa</p>
    </div>
    </div>

</div>
<div class="flex-1 border-l p-8">
    <div class="flex justify-between text-white">
        <h1 class="text-2xl">List of Products </h1>
        <p class="px-2 py-1 bg-yellow-500 text-white rounded text-center">${
          cargo.listOfProducts.length
        } items</p>
    </div>
    <div class="flex gap-4 mt-4 flex-wrap">
        ${productModel}
    </div>
</div>`;

  cargoDetails.innerHTML = model;

  // let setStatus = document.getElementById("setStatus") as HTMLElement;
  let setGlobalState = document.getElementById("setGlobalState") as HTMLElement;

  setGlobalState.addEventListener("click", () => {
    cargo.changeState();
    let value: State = cargo.cargoGlobalState;
    displayListCargos();
    sendToJson();
    setGlobalState.innerText = value;
    if (value == "closed") {
      setGlobalState.classList.remove("bg-green-500");
      setGlobalState.classList.add("bg-red-500");
    } else {
      setGlobalState.classList.remove("bg-red-500");
      setGlobalState.classList.add("bg-green-500");
    }
  });

  upgrade.addEventListener("click", () => {
    data![index].upgradeStatus();
    setGlobalState.innerText = data![index].cargoGlobalState;
    sendToJson();
    donnee = data!.slice(page * el, page * el + el);
    displayListCargos();
    upgrade.innerText =
      data![index].cargoStatus == "loading" ? "start" : "transporting";
    let setStatus = document.getElementById("setStatus") as HTMLElement;
    setStatus.innerText = data![index].cargoStatus;
    let markLost = document.getElementById("markLost") as HTMLElement;
    if (data![index].cargoStatus == "transporting") {
      markLost.classList.remove("hidden");
      markLost.addEventListener("click", () => {
        data![index].markLost();
        upgrade.classList.remove("bg-green-400");
        upgrade.classList.add("bg-gray-300");
        upgrade.classList.add("cursor-not-allowed");
        upgrade.classList.add("text-slate-800");
        upgrade.innerText = " losted";
        markLost.classList.add("hidden");
        setStatus.innerText = data![index].cargoStatus;
        sendToJson();
      });
    } else {
      markLost.classList.add("hidden");
    }

    if (data![index].cargoStatus == "delivered") {
      upgrade.classList.remove("bg-green-400");
      upgrade.classList.add("bg-gray-300");
      upgrade.classList.add("cursor-not-allowed");
      upgrade.classList.add("text-slate-800");
      upgrade.innerText = " delivered";
    }
  });

  let deletes = document.querySelectorAll("#delete");

  deletes.forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      let indexProduct = deleteButton.getAttribute(
        "data-indexProduct"
      ) as string;
      let indexCargo = deleteButton.getAttribute("data-indexCargo") as string;
      data![indexCargo].removeProduct(indexProduct);
      deleteButton.parentElement!.remove();
      sendToJson();
      donnee = data!.slice(page * el, page * el + el);
      displayListCargos();
    });
  });

  document.querySelector("#DetailOverlay")!.classList.remove("hidden");
  document.querySelector("#DetailOverlay")!.classList.add("flex");
  document.querySelector("#DetailCargo")!.classList.add("right-2");
  document.querySelector("#DetailCargo")!.classList.remove("-right-full");
}

function getProduct() {
  let formProduct = document.getElementById("productForm") as HTMLFormElement;
  let sender = document.getElementById("sender") as HTMLFormElement;
  let receiver = document.getElementById("receiver") as HTMLFormElement;

  let formData = new FormData(formProduct);
  let senderData = new FormData(sender);
  let receiverData = new FormData(receiver);

  let senderName = senderData.get("clientName") as string;
  let senderLastName = senderData.get("clientLastName") as string;
  let senderPhone = senderData.get("clientPhone") as string;
  let senderAddress = senderData.get("clientAddress") as string;

  let receiverName = receiverData.get("receiverName") as string;
  let receiverLastName = receiverData.get("receiverLastName") as string;
  let receiverPhone = receiverData.get("receiverPhone") as string;
  let receiverAddress = receiverData.get("receiverAddress") as string;

  let senderUser: User = new User(
    senderName,
    senderLastName,
    senderPhone,
    senderAddress
  );
  let receiverUser: User = new User(
    receiverName,
    receiverLastName,
    receiverPhone,
    receiverAddress
  );

  let id = generateCargoID();
  let name = formData.get("productName") as string;
  let type = formData.get("productType") as string;
  let weight = parseFloat(formData.get("weight") as string);
  let newProduct;
  if (type == "Material") {
    let solidity = formData.get("solidity");
    newProduct = new MaterialProduct(
      id,
      name,
      weight,
      senderUser,
      receiverUser,
      type,
      solidity as "breakable" | "unbreakable"
    );
  } else if (type == "Chemical") {
    let tonicity = parseFloat(formData.get("tonicity") as string);
    newProduct = new ChemicalProduct(
      id,
      name,
      weight,
      senderUser,
      receiverUser,
      type,
      tonicity as Tonicity
    );
  } else {
    newProduct = new Product(id, name, weight, senderUser, receiverUser, type);
  }

  formProduct.reset();
  sender.reset();
  receiver.reset();
  return newProduct;
}

function getProductType() {
  let extraField = document.getElementById("extra") as HTMLElement;
  let productType = document.getElementById("productType") as HTMLSelectElement;
  productType.addEventListener("input", () => {
    extraField.innerHTML = "";
    if (productType.selectedOptions[0].value == "Material") {
      let model = `
          <select name="solidity" class="p-3 bg-gray-600 rounded">
          <option value="cassable">cassable</option>
          <option value="incassable">incassable</option>
          </select>`;

      extraField.innerHTML += model;
    } else if (productType.selectedOptions[0].value == "Chemical") {
      let model = `
          <input type="number" name="tonicity" class="p-2" min="0" max="10" placeholder="Tonicity"/>
          `;

      extraField.innerHTML += model;
    } else {
      extraField.innerHTML = "";
    }
  });
}

function sendToJson() {
  fetch("./dist/data.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {})
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// function createProductCard(data: any) {
//   let model = `<div class="card w-72 h-20 bg-base-100 shadow-xl image-full shadow-black/50">
//     <figure><img src="./img/${data.productType}.png" class="w-full" alt="Shoes" /></figure>
//     <div class="card-body" data-id="${data.id}">
//       <h2 class="card-title text-blue-400 flex justify-between"><p>Product : ${data.name} </p></h2>
//       <p class="text-2xl font-bold">${data.productType} Product</p>
//       <div>weight: ${data.weight}</div>
//       <div class="card-actions justify-end">
//         <button class="btn btn-error">Delete</button>
//         <button class="btn btn-primary" id="addToCargo" data-id="${data.id}">add to Cargo</button>
//       </div>
//     </div>
//   </div>`;

//   listProduct.innerHTML += model;
//   let addToCargo = document.querySelectorAll(
//     "#addToCargo"
//   ) as NodeListOf<HTMLElement>;
//   addToCargo.forEach((element) => {
//     element.addEventListener("click", (e) => {
//       let id = parseInt((e.target as HTMLElement).dataset.id!);
//       let product = getProduct(id);

//       openModalAjout(product);
//     });
//   });
// }

function createCargoFromForm() {
  // Select the cargo creation form
  const cargoForm = document.getElementById("formCargo") as HTMLFormElement;

  // Create a new FormData object from the form
  const formData = new FormData(cargoForm);

  // Extract values from FormData
  const cargoType = formData.get("cargoType") as CargoType;
  const maxWeight = parseFloat(formData.get("maxWeight") as string);
  const duration = parseInt(formData.get("duration") as string);
  const fullIndicator = formData.get("fullIndicator") as fullIndicator;
  const startingDate = formData.get("startingDate") as string;
  const endingDate = formData.get("endingDate") as string;

  // Validate input data
  if (!cargoType || isNaN(maxWeight) || !fullIndicator) {
    console.error("Invalid cargo data");
    return null;
  }

  if (isDateLate(startingDate)) {
    console.error("Invalid starting date");
    return null;
  }
  // Additional validation if needed

  // Create cargo object
  const cargo = Cargo.createCargo(
    generateCargoID(), // You need to implement a function to generate a unique cargo ID
    maxWeight,
    fullIndicator,
    startingLocation, // You need to extract this from the map or user input
    endingLocation,
    startingDate,
    endingDate, // You need to extract this from the map or user input
    distance, // You need to calculate this based on the selected locations
    duration,
    cargoType
  );

  // createCargoCard(cargo);
  //   displayCargosCard();

  sendToJson();

  fetchData();
}

function isDateLate(dateString: string): boolean {
  const [year, month, day] = dateString.split("-").map(Number);
  const today = new Date();
  const inputDate = new Date(year, month - 1, day); // Months are zero-based in JavaScript Date

  return inputDate < today;
}

function displayCargosCard() {
  let cardContainer = document.getElementById("cardContainer") as HTMLElement;
  cardContainer.style.display = "grid";
  cardContainer.innerHTML = "";
  let cards = data!
    .map((element: any, index: number) => {
      return `<div class="Card container md:max-w-56 lg:max-w-56 bg-gray-300 p-2 rounded flex flex-col gap-2" >
    <div class="flex justify-between items-center" >
        <div>
          <p>Cargo ${element.id}</p>
        </div>
        <div>
            <p class="px-2 py-1 bg-green-500 text-white rounded text-center">${element.cargoType}</p>
        </div>
    </div>
    <div>
        <img src="./img/${element.cargoType}.png" alt="">
    </div>
    <div class="flex justify-between">
        <p >${element.totalWeight}/${element.cargoMaxWeight} kg</p>
        <div class="relative " id="showAction" data-index="${index}">
        <div class="border absolute rounded bg-white min-w-44 -left-32 hidden">
            <p class="px-6 py-1 border-t" id="ajouterProduit" data-idCargo="${element.id}">Add Product</p>
            <p class="px-6 py-1 border-t" data-detailId="${index}" id="detailSlider">Show details</p>
            <p class="px-6 py-1 border-t">Start cargo</p>
            <p class="px-6 py-1 border-t">Archive</p>
        </div>
            <i  class="fa-solid fa-ellipsis"></i>
        </div>
    </div>
    <div class="flex justify-between">
        <p class="px-2 py-1 bg-slate-500 text-white rounded text-center" >${element.cargoGlobalState}</p>
    </div>
</div>`;
    })
    .join("");

  cardContainer.innerHTML = cards;
  let cargos = document.querySelectorAll(
    "#ajouterProduit"
  ) as NodeListOf<HTMLElement>;
  cargos.forEach((element) => {
    element.addEventListener("click", () => {
      let idCargo = element.getAttribute("data-idCargo");
      let index = data!.findIndex((element: any) => element.id == idCargo);
      openAddProduct(index, data![index].typeOfCargo);
    });
  });

  let detailSlider = document.querySelectorAll("#detailSlider");
  detailSlider.forEach((element) => {
    element.addEventListener("click", () => {
      let index = parseInt(element.getAttribute("data-detailId")!);

      showDetailCargo(index);
    });
  });

  let showActions = document.querySelectorAll(
    "#showAction"
  ) as NodeListOf<HTMLElement>;

  showActions.forEach((element: HTMLElement) => {
    element.addEventListener("click", () => {
      let index = parseInt(element.getAttribute("data-index")!);
      showAction(element);
    });
  });
}

function showAction(element: HTMLElement) {
  element.firstElementChild?.classList.remove("hidden");
}

function openAddProduct(index: number, typeOfCargo: CargoType) {
  toggleSlide(index);
  let btnSliderAddProduct = document.getElementById(
    "btnSliderAddProduct"
  ) as HTMLElement;

  let sliderAddProduct = document.getElementById(
    "sliderAddProduct"
  ) as HTMLElement;
  let addProductForm = document.getElementById("addProductForm") as HTMLElement;

  let productType = document.getElementById("productType") as HTMLSelectElement;
  productType.innerHTML = "";
  if (typeOfCargo === "Aerial") {
    productType.innerHTML += `
  <option value="Food">Food</option>
  <option value="Material">Material</option>
  `;
  } else if (typeOfCargo === "Maritime") {
    productType.innerHTML += `<option value="Food">Food</option><option value="Chemical">Chemical</option>`;
  } else {
    productType.innerHTML += `<option value="Food">Food</option><option value="Chemical">Chemical</option>
  <option value="Material">Material</option>`;
  }

  let clientPhone = document.getElementById("clientPhone") as HTMLInputElement;
  let client;
  clientPhone.addEventListener("input", () => {
    client = data![index].clientProduct(clientPhone.value);
    let clientName = document.getElementById("clientName") as HTMLInputElement;
    let clientLastName = document.getElementById(
      "clientLastName"
    ) as HTMLInputElement;
    let clientAddress = document.getElementById(
      "clientAddress"
    ) as HTMLInputElement;

    if (client.length > 0) {
      clientName.value = client[0]["client"].name;
      clientLastName.value = client[0]["client"].surname;
      clientAddress.value = client[0]["client"].address;
    }
  });

  sliderAddProduct.classList.remove("w-2");
  sliderAddProduct.classList.add("w-1/2");
  addProductForm.classList.remove("hidden");
  addProductForm.classList.add("flex");
  btnSliderAddProduct.classList.add("bg-blue-500");
}

function displayListCargos() {
  let cardContainer = document.getElementById("cardContainer") as HTMLElement;
  cardContainer.style.display = "flex";
  cardContainer.style.flexDirection = "column";
  cardContainer.innerHTML = "";
  let cards = donnee
    .map((element: any, index: number) => {
      return `<tr class="group">
      <td>${element.id}</td>
      <td>${element.cargoType}</td>
      <td>${element.maxWeight}</td>
      <td>${element.startingDate}</td>
      <td>${element.endingDate}</td>
      <td>${element.from}</td>
      <td>${element.to}</td>
      <td>${element.status}</td>
      <td>${element.globalState}</td>
      <td class="flex gap-2 justify-center items-center">
      <button class="rounded-full group-hover:flex border w-6 h-6 border-black border-solid items-center justify-center hidden" id="ajouterProduitList" data-idCargo="${element.id}">
      <i class="fa text-gray-700 fa-plus " aria-hidden="true"></i>
      </button>
      <button class="rounded-full group-hover:flex border  border-black border-solid items-center justify-center hidden w-6 h-6" data-detailId="${index}" id="detailSliderList">
      <i class="fa text-gray-700 fa-info" aria-hidden="true" ></i>
      </button>
      </td>
  </tr>`;
    })
    .join("");

  let model = `
  <table class="w-full">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Type</th>
                                <th>Weight</th>
                                <th>Starting Date</th>
                                <th>Ending Date</th>
                                <th>Starting point</th>
                                <th>End point</th>
                                <th>Step</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${cards}
                        </tbody>
                        </table>
                    <div class="flex justify-end w-full gap-4 h-fit" id="page" data-page="${page}">
                        <button class="rounded-full border w-12 h-12 border-black border-solid" id="previous">
                            <i class="fa fa-arrow-left" aria-hidden="true"></i>
                        </button>
                        <button class="rounded-full border w-12 h-12 border-black border-solid" id="next">
                            <i class="fa fa-arrow-right" aria-hidden="true"></i>
                        </button>
                    </div>`;

  cardContainer.innerHTML = model;
  let cargos = document.querySelectorAll(
    "#ajouterProduitList"
  ) as NodeListOf<HTMLElement>;
  cargos.forEach((element) => {
    element.addEventListener("click", () => {
      let idCargo = element.getAttribute("data-idCargo");
      let index = data!.findIndex((element: any) => element.id == idCargo);
      openAddProduct(index, data![index].typeOfCargo);
    });
  });

  let detailSlider = document.querySelectorAll("#detailSliderList");
  detailSlider.forEach((element) => {
    element.addEventListener("click", () => {
      let index = parseInt(element.getAttribute("data-detailId")!);
      showDetailCargo(index);
    });
  });

  paginate(5);
}

function paginate(el: number) {
  let next = document.querySelector("#next") as HTMLElement;
  let previous = document.querySelector("#previous") as HTMLElement;
  let pageInd = parseInt(
    (document.querySelector("#page") as HTMLElement).getAttribute("data-page")!
  );

  next.addEventListener("click", () => {
    if (data!.slice(pageInd * el, (pageInd + 1) * el + el).length > 0) {
      pageInd = pageInd + 1;
      page = pageInd;
      donnee = data!.slice(page * el, page * el + el);

      displayListCargos();
    }
  });
  previous.addEventListener("click", () => {
    if (pageInd > 0) {
      pageInd = pageInd - 1;
      page = pageInd;
      donnee = data!.slice(page * el, page * el + el);

      displayListCargos();
    }
  });
}

async function fetchData() {
  try {
    const response = await fetch(
      "http://www.bakemono.sn:8001/newGpApp/public/dist/data.php"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const responseData = await response.json();

    data = responseData.cargos; // Extracting the cargos array directly

    data.forEach((cargo: any, index: number) => {
      let products = cargo.products;
      products = products.map((product: any) => {
        return transformToProduct(product);
      });

      data[index] = transformToCargo(cargo);

      data[index].products = products;
    });

    donnee = data.slice(page * el, page * el + el);

    if (document.getElementById("cardContainer")?.style.display == "flex") {
      displayCargosCard();
    } else {
      displayListCargos();
    }

    filter();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();

function createProductFromForm() {
  let ProductData = new FormData(
    document.getElementById("productForm") as HTMLFormElement
  );

  let user: User = new User("bakemono", "san", "785953562", "Ouakam");
  let receiver: User = new User(
    "bakemono",
    "san",
    "785953562",
    "united kingdom"
  );
  let id = generateCargoID();
  let name = ProductData.get("productName") as string;
  let type = ProductData.get("productType") as string;

  let weight = parseFloat(ProductData.get("weight") as string);
  let newProduct;
  if (type == "Material") {
    let solidity = ProductData.get("solidity");
    newProduct = new MaterialProduct(
      id,
      name,
      weight,
      user,
      receiver,
      type,
      solidity as "breakable" | "unbreakable"
    );
  } else if (type == "Chemical") {
    let tonicity = parseFloat(ProductData.get("tonicity") as string);
    newProduct = new ChemicalProduct(
      id,
      name,
      weight,
      user,
      receiver,
      type,
      tonicity as Tonicity
    );
  } else {
    newProduct = new Product(id, name, weight, user, receiver, type);
  }

  //   createProductCard(newProduct);
  // console.log(newProduct);

  sendToJson();

  fetchData();
}

function transformToCargo(object: any) {
  const cargoType = object.cargoType;
  if (cargoType === "Aerial") {
    let cargo = AerialCargo.createCargo(
      object.id,
      object.maxWeight,
      object.fullIndicator,
      object.from,
      object.to,
      object.startingDate,
      object.endingDate,
      object.distance,
      object.duration,
      object.cargoType
    );
    cargo.status = object.status;
    cargo.globalState = object.globalState;
    return cargo;
  } else if (cargoType === "Maritime") {
    let cargo = MaritimeCargo.createCargo(
      object.id,
      object.maxWeight,
      object.fullIndicator,
      object.from,
      object.to,
      object.startingDate,
      object.endingDate,
      object.distance,
      object.duration,
      object.cargoType
    );
    cargo.status = object.status;
    cargo.globalState = object.globalState;
    return cargo;
  } else if (cargoType === "Road") {
    let cargo = RoadCargo.createCargo(
      object.id,
      object.maxWeight,
      object.fullIndicator,
      object.from,
      object.to,
      object.startingDate,
      object.endingDate,
      object.distance,
      object.duration,
      object.cargoType
    );
    cargo.status = object.status;
    cargo.globalState = object.globalState;
    return cargo;
  }
}

function transformToProduct(object: any) {
  if (object.productType == "Food") {
    return FoodProduct.createProduct(
      object.id,
      object.name,
      object.weight,
      object.client as User,
      object.receiver as User,
      object.productType
    );
  } else if (object.productType == "Chemical") {
    return new ChemicalProduct(
      object.id,
      object.name,
      object.weight,
      object.client as User,
      object.receiver as User,
      object.productType,
      object.tonicity as Tonicity
    );
  } else {
    return MaterialProduct.createProduct(
      object.id,
      object.name,
      object.weight,
      object.client as User,
      object.receiver as User,
      object.productType,
      object.productSolidity
    );
  }
}

// function createStatCard(stats: { name: string; number: number }): void {
//   const statsContainer = document.querySelector("#Stats") as HTMLElement;
//   let model = `<div class="card w-72 h-20 bg-base-100 shadow-xl image-full shadow-black/50">
//       <figure><img src="./img/${stats.name}.png" class="w-full" alt="Shoes" /></figure>
//       <div class="card-body">
//         <h2 class="card-title text-blue-400">${stats.name}</h2>
//         <p class="text-2xl font-bold">${stats.number} element(s)</p>
//         <div class="card-actions justify-end">
//           <button class="btn btn-primary">Go to list</button>
//         </div>
//       </div>
//     </div>
//       `;

//   statsContainer.innerHTML += model;
// }

// function createProductCard(data: any) {
//     let model = `<div class="card w-72 h-20 bg-base-100 shadow-xl image-full shadow-black/50">
//     <figure><img src="./img/${data.productType}.png" class="w-full" alt="Shoes" /></figure>
//     <div class="card-body" data-id="${data.id}">
//       <h2 class="card-title text-blue-400 flex justify-between"><p>Product : ${data.name} </p></h2>
//       <p class="text-2xl font-bold">${data.productType} Product</p>
//       <div>weight: ${data.weight}</div>
//       <div class="card-actions justify-end">
//         <button class="btn btn-error">Delete</button>
//         <button class="btn btn-primary" id="addToCargo" data-id="${data.id}">add to Cargo</button>
//       </div>
//     </div>
//   </div>`;
//     listProduct.innerHTML += model;
//     addToCargo = document.querySelectorAll(
//       "#addToCargo"
//     ) as NodeListOf<HTMLElement>;
//     addToCargo.forEach((element) => {
//       element.addEventListener("click", (e) => {
//         let id = parseInt((e.target as HTMLElement).dataset.id!);
//         let product = getProduct(id);
//         openModalAjout(product);
//       });
//     });
// }

let listView = document.getElementById("listView") as HTMLElement;
let cardView = document.getElementById("cardView") as HTMLElement;

listView.addEventListener("click", () => {
  displayListCargos();
});

cardView.addEventListener("click", () => {
  displayCargosCard();
});

let findProduct = document.getElementById("findProduct") as HTMLInputElement;
console.log("frhzk");

findProduct.addEventListener("input", () => {
  let product = data!.filter((element: any) => {
    element.searchProduct(findProduct.value);
  });
  console.log(product);
});


async function sendEmail(text: any) {
  const templateParams = {
    to_email: "ochatobake@gmail.com",
    subject: "added product",
    message: `product id : ${text}`,
  };

  try {
    const response = await emailjs.send('service_ihqi8ze', 'template_j89td5b', templateParams);
    console.log('Email sent successfully:', response.status, response.text);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
