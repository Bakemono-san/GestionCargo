import { Cargo, Product, User, ChemicalProduct, MaterialProduct, AerialCargo, MaritimeCargo, RoadCargo, FoodProduct, } from "./Cargos.js";
emailjs.init("tEhx_KOTiWjrPT4gB");
let data;
let page = 0;
let el = 5;
let donnee;
let cardData;
const getLocationName = async (lat, lon) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        if (data && data.display_name) {
            return data.address.country;
        }
        else {
            return "Location name not found";
        }
    }
    catch (error) {
        console.error("Error fetching location name:", error);
        return "Error fetching location name";
    }
};
let startPoint = null;
let endPoint = null;
let line = null;
let startingLocation;
let endingLocation;
let distance;
let map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
// Event listener for clicking on the map
map.on("click", async (e) => {
    if (!startPoint) {
        startPoint = e.latlng; // Set the start point
        L.marker(startPoint).addTo(map); // Add a marker for the start point
    }
    else if (!endPoint) {
        endPoint = e.latlng; // Set the end point
        L.marker(endPoint).addTo(map); // Add a marker for the end point
        // Calculate the distance between the two points
    }
    distance = Math.round(startPoint.distanceTo(endPoint));
    // Get the starting location name
    startingLocation = await getLocationName(startPoint.lat, startPoint.lng);
    let start = document.querySelector("#start");
    start.innerText = startingLocation;
    // Get the ending location name
    endingLocation = await getLocationName(endPoint.lat, endPoint.lng);
    let end = document.querySelector("#end");
    end.innerText = endingLocation;
    // Draw a line between the two points
    line = L.polyline([startPoint, endPoint], {
        color: "red",
    }).addTo(map);
});
let createCargo = document.getElementById("createCargo");
createCargo.addEventListener("click", () => {
    show();
    let hidebtn = document.getElementById("hide");
    hidebtn.addEventListener("click", () => {
        hide();
    });
});
function show() {
    document.querySelector(".overlay").classList.remove("hidden");
    document.querySelector(".overlay").classList.add("flex");
    document.querySelector(".card").classList.add("right-2");
    document.querySelector(".card").classList.remove("-right-full");
    let fullIndicator = document.getElementById("fullIndicator");
    let indicator = document.getElementById("indicator");
    fullIndicator.addEventListener("input", (e) => {
        if (fullIndicator.selectedOptions[0].value == "weight") {
            indicator.innerText = "Max weight in kg:";
        }
        else {
            indicator.innerText = "Number of product";
        }
    });
    let addCargo = document.getElementById("addCargo");
    addCargo.addEventListener("click", () => {
        createCargoFromForm();
        document.querySelector(".overlay").classList.remove("flex");
        document.querySelector(".overlay").classList.add("hidden");
        document.querySelector(".card").classList.remove("right-2");
        document.querySelector(".card").classList.add("-right-full");
        validateCargo();
    });
}
function hide() {
    document.querySelector(".overlay").classList.remove("flex");
    document.querySelector(".overlay").classList.add("hidden");
    document.querySelector(".card").classList.remove("right-2");
    document.querySelector(".card").classList.add("-right-full");
}
function showDetail() {
    document.querySelector("#DetailOverlay").classList.remove("hidden");
    document.querySelector("#DetailOverlay").classList.add("flex");
    document.querySelector("#DetailCargo").classList.add("right-2");
    document.querySelector("#DetailCargo").classList.remove("-right-full");
}
function hideDetail() {
    document.querySelector("#DetailOverlay").classList.remove("flex");
    document.querySelector("#DetailOverlay").classList.add("hidden");
    document.querySelector("#DetailCargo").classList.remove("right-2");
    document.querySelector("#DetailCargo").classList.add("-right-full");
}
function validateCargo() {
    let start = document.querySelector("#start");
    let end = document.querySelector("#end");
    let startingDate = document.querySelector("#startingDate");
    let endingDate = document.querySelector("#endingDate");
    if (start.innerText == "") {
        start.style.outline = "1px solid red";
    }
    else if (!end.innerText) {
        end.style.outline = "1px solid red";
    }
    else if (!startingDate.value) {
        startingDate.style.border = "1px solid red";
    }
    else if (!endingDate.value) {
        endingDate.style.border = "1px solid red";
    }
}
function generateCargoID() {
    return Math.floor(Math.random() * 1000) + 1; // Just a simple random number generator for demonstration
}
function toggleSlide(index) {
    getProductType();
    let btnSliderAddProduct = document.getElementById("btnSliderAddProduct");
    let sliderAddProduct = document.getElementById("sliderAddProduct");
    let addProductForm = document.getElementById("addProductForm");
    btnSliderAddProduct.addEventListener("click", () => {
        if (sliderAddProduct.classList.contains("w-2")) {
            sliderAddProduct.classList.remove("w-2");
            sliderAddProduct.classList.add("w-1/2");
            addProductForm.classList.remove("hidden");
            addProductForm.classList.add("flex");
            btnSliderAddProduct.classList.add("bg-blue-500");
        }
        else {
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
    let submitBtn = document.getElementById("addProduct");
    submitBtn.addEventListener("click", async () => {
        if (validate("#sender") == false &&
            validate("#receiver") == false &&
            validate("#productForm") == false) {
            let product = getProduct();
            let res = data[index].addProduct(product);
            document.getElementById("messageBody").innerText = res;
            document.getElementById("message").classList.add("right-2");
            document.getElementById("message").classList.add("top-2");
            setTimeout(() => {
                document.getElementById("message").classList.remove("right-2");
                document.getElementById("message").classList.remove("top-2");
            }, 2000);
            let message = {
                sendMessage: "sendMessage",
                id: product.ProductID,
                clientInfo: [product.receiverNumber],
            };
            const pdfFile = await generateRecipePDF(product);
            // sendEmail(product.ProductID, pdfFile);
            // sendToJson();
        }
    });
}
function filter() {
    let filterAll = document.getElementById("filterAll");
    let filterType = document.getElementById("filterType");
    let filterStatus = document.getElementById("filterStatus");
    let filterStep = document.getElementById("filterStep");
    filterAll.addEventListener("keyup", (e) => {
        donnee = data.filter((cargo) => {
            return (cargo.typeOfCargo
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
                    .includes(filterAll.value.toLowerCase().trim()));
        });
        donnee = donnee.slice(page * el, page * el + el);
        if (document.getElementById("cardContainer")?.style.display == "flex") {
            displayListCargos();
        }
        else {
            displayCargosCard();
        }
    });
    filterType.addEventListener("change", (e) => {
        donnee = data.filter((cargo) => {
            return cargo.typeOfCargo
                .toLowerCase()
                .includes(filterType.selectedOptions[0].value.toLowerCase());
        });
        donnee = donnee.slice(page * el, page * el + el);
        if (document.getElementById("cardContainer")?.style.display == "flex") {
            displayListCargos();
        }
        else {
            displayCargosCard();
        }
    });
    filterStatus.addEventListener("change", (e) => {
        donnee = data.filter((cargo) => {
            return cargo.cargoGlobalState
                .toLowerCase()
                .includes(filterStatus.selectedOptions[0].value.toLowerCase());
        });
        donnee = donnee.slice(page * el, page * el + el);
        if (document.getElementById("cardContainer")?.style.display == "flex") {
            displayListCargos();
        }
        else {
            displayCargosCard();
        }
    });
    filterStep.addEventListener("change", (e) => {
        donnee = data.filter((cargo) => {
            return cargo.cargoStatus
                .toLowerCase()
                .includes(filterStep.selectedOptions[0].value.toLowerCase());
        });
        donnee = donnee.slice(page * el, page * el + el);
        if (document.getElementById("cardContainer")?.style.display == "flex") {
            displayListCargos();
        }
        else {
            displayCargosCard();
        }
    });
}
function showDetailCargo(index) {
    fetchData();
    let upgrade = document.getElementById("upgrade");
    upgrade.classList.add("bg-green-400");
    upgrade.classList.remove("bg-gray-300");
    upgrade.classList.remove("cursor-not-allowed");
    upgrade.classList.remove("text-slate-800");
    let DetailOverlay = document.getElementById("DetailOverlay");
    DetailOverlay.addEventListener("click", (e) => {
        hideDetail();
    });
    let cargo = data[index];
    let cargoDetails = document.getElementById("cargoDetails");
    let productModel = data[index].listOfProducts
        .map((product, indexProduct) => {
        return `<div class="flex cursor-pointer"><p id="showProduct" data-index="${indexProduct}" class="px-2 py-1 bg-slate-500 text-white rounded-l text-center">${product.productName}</p><p class="bg-red-600 text-white rounded-r px-2 py-1" data-indexProduct="${indexProduct}" data-indexCargo="${index}" id="delete">X</p></div>`;
    })
        .join("");
    let model = `<div class="flex-1 p-8 text-gray-100 flex flex-col justify-between">
    <div class="flex justify-between">
        <h1 class="text-2xl">Cargo ${cargo.id} </h1>
        <p class="px-2 py-1 bg-blue-500 text-white rounded text-center">${cargo.typeOfCargo}</p>
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
    <p class="px-2 py-1 bg-gray-500 text-white rounded text-center" id="setStatus">${cargo.cargoStatus}</p>
</div><div>
<h1 class="text-xl">Status : </h1>
<p class="px-2 py-1 bg-green-500 text-white rounded text-center cursor-pointer" id="setGlobalState">${cargo.cargoGlobalState}</p>
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
        <p class="px-2 py-1 bg-yellow-500 text-white rounded text-center">${cargo.listOfProducts.length} items</p>
    </div>
    <div class="flex gap-4 mt-4 flex-wrap">
        ${productModel}
    </div>
</div>`;
    cargoDetails.innerHTML = model;
    if (cargo.cargoStatus == "loading") {
        upgrade.innerText = "start";
    }
    else if (cargo.cargoStatus == "transporting") {
        upgrade.innerText = "deliver";
        let globalState = document.getElementById("setGlobalState");
        globalState.style.cursor = "not-allowed";
    }
    else if (cargo.cargoStatus == "delivered") {
        upgrade.innerText = "archiver";
    }
    else if (cargo.cargoStatus == "archived") {
        upgrade.innerText = "archived";
    }
    else {
        upgrade.innerText = "lost";
    }
    let showProducts = document.querySelectorAll("#showProduct");
    showProducts.forEach((showProduct) => {
        showProduct.addEventListener("click", () => {
            let indexproduct = showProduct.getAttribute("data-index");
            let product = cargo.getProduct(indexproduct);
            console.log(product, "produit --||");
            hideDetail();
            let detailProduct = document.getElementById("detailProduct");
            detailProduct.style.display = "flex";
            detailProduct.innerHTML = `<div class="mx-auto w-full max-w-4xl p-8 bg-white rounded-lg shadow-2xl text-gray-800 space-y-8">
      <!-- Top Details Section -->
      <div class="flex flex-col items-center text-center p-6 border-b border-gray-200">
        <h1 class="text-3xl font-semibold mb-4">Product ID: ${product.ProductID}</h1>
        <p class="text-2xl font-medium mb-2">Name: ${product.productName}</p>
        <div class="flex space-x-8 justify-center gap-8">
          <div class="text-center">
            <h2 class="text-xl font-semibold">Weight:</h2>
            <p class="mt-1">${product.ProductWeight} kg</p>
          </div>
          <div class="text-center">
            <h2 class="text-xl font-semibold">Status:</h2>
            <p class="mt-1 px-2 py-1 bg-yellow-500 text-white rounded" id="productStatus">${product.ProductStatus}</p>
          </div>
          <div class="text-center">
            <h2 class="text-xl font-semibold">Price:</h2>
            <p class="mt-1">${product.productPrice} FCFA</p>
          </div>
        </div>
      </div>
    
      <!-- Bottom Section: Client and Receiver Info -->
      <div class="flex space-x-6">
        <!-- Client Section -->
        <div class="w-1/2 p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold mb-4 text-gray-700 border-b border-gray-300 pb-2">Client</h2>
          <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg font-medium">Name:</h3>
            <p class="mt-1 px-4 py-2 bg-gray-200 text-gray-900 rounded">${product.productClient.name}</p>
          </div>
          <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg font-medium">Phone:</h3>
            <p class="mt-1">${product.productClient.phone}</p>
          </div>
          <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg font-medium">Address:</h3>
            <p class="mt-1">${product.productClient.address}</p>
          </div>
        </div>
    
        <!-- Receiver Section -->
        <div class="w-1/2 p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 class="text-2xl font-semibold flex items-center gap-4 mb-4 text-gray-700 border-b border-gray-300 pb-2">Receiver</h2>
          <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg font-medium">Name:</h3>
            <p class="mt-1 px-4 py-2 bg-green-200 text-gray-900 rounded">${product.productReceiver.name}</p>
          </div>
          <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg font-medium">Phone:</h3>
            <p class="mt-1">${product.productReceiver.phone}</p>
          </div>
          <div class="flex items-center gap-4 mb-4">
            <h3 class="text-lg font-medium">Address:</h3>
            <p class="mt-1">${product.productReceiver.address}</p>
          </div>
        </div>
      </div>
    
      <!-- Recuperer Button -->
      <div class="flex justify-between pt-4">
        <button class="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300" id="lostProduct">
          mark lost
        </button>
        <button class="px-6 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300" id="closeProduct">
          close
        </button>
      </div>
    </div>`;
            let closeProduct = document.getElementById("closeProduct");
            closeProduct.addEventListener("click", () => {
                detailProduct.style.display = "none";
            });
            let lostProduct = document.getElementById("lostProduct");
            lostProduct.addEventListener("click", () => {
                let message = data[index].markProductLost(indexproduct);
                document.getElementById("messageBody").innerText = message;
                document.getElementById('productStatus').innerText = data[index].getProduct(indexproduct).ProductStatus;
                document.getElementById("message").classList.add("right-2");
                document.getElementById("message").classList.add("top-2");
                setTimeout(() => {
                    document.getElementById("message").classList.remove("right-2");
                    document.getElementById("message").classList.remove("top-2");
                }, 2000);
            });
        });
    });
    // let setStatus = document.getElementById("setStatus") as HTMLElement;
    let setGlobalState = document.getElementById("setGlobalState");
    setGlobalState.addEventListener("click", () => {
        cargo.changeState();
        let value = cargo.cargoGlobalState;
        if (document.getElementById("cardContainer")?.style.display == "flex") {
            displayListCargos();
        }
        else {
            displayCargosCard();
        }
        sendToJson();
        setGlobalState.innerText = value;
        if (value == "closed") {
            setGlobalState.classList.remove("bg-green-500");
            setGlobalState.classList.add("bg-red-500");
        }
        else {
            setGlobalState.classList.remove("bg-red-500");
            setGlobalState.classList.add("bg-green-500");
        }
    });
    upgrade.addEventListener("click", () => {
        let message = data[index].upgradeStatus();
        document.getElementById("messageBody").innerText = message;
        document.getElementById("message").classList.add("right-2");
        document.getElementById("message").classList.add("top-2");
        setTimeout(() => {
            document.getElementById("message").classList.remove("right-2");
            document.getElementById("message").classList.remove("top-2");
        }, 2000);
        if (message.includes("start")) {
            document.getElementById("messageBody").classList.add("bg-green-500");
        }
        else if (message.includes("sending")) {
            document.getElementById("messageBody").classList.add("bg-yellow-500");
        }
        setGlobalState.innerText = data[index].cargoGlobalState;
        sendToJson();
        donnee = data.slice(page * el, page * el + el);
        if (document.getElementById("cardContainer")?.style.display == "flex") {
            displayListCargos();
        }
        else {
            displayCargosCard();
        }
        if (cargo.cargoStatus == "loading") {
            upgrade.innerText = "start";
        }
        else if (cargo.cargoStatus == "transporting") {
            upgrade.innerText = "deliver";
            let globalState = document.getElementById("setGlobalState");
            globalState.style.cursor = "not-allowed";
        }
        else if (cargo.cargoStatus == "delivered") {
            upgrade.innerText = "archiver";
        }
        else if (cargo.cargoStatus == "archived") {
            upgrade.innerText = "archived";
        }
        else {
            upgrade.innerText = "losted";
        }
        let setStatus = document.getElementById("setStatus");
        setStatus.innerText = data[index].cargoStatus;
        let markLost = document.getElementById("markLost");
        if (data[index].cargoStatus == "transporting") {
            markLost.classList.remove("hidden");
            markLost.addEventListener("click", () => {
                data[index].markLost();
                upgrade.classList.remove("bg-green-400");
                upgrade.classList.add("bg-gray-300");
                upgrade.classList.add("cursor-not-allowed");
                upgrade.classList.add("text-slate-800");
                upgrade.innerText = " losted";
                markLost.classList.add("hidden");
                setStatus.innerText = data[index].cargoStatus;
                sendToJson();
            });
        }
        else {
            markLost.classList.add("hidden");
        }
        if (data[index].cargoStatus == "delivered") {
            upgrade.classList.remove("bg-green-400");
            upgrade.classList.add("bg-gray-300");
            upgrade.classList.add("cursor-not-allowed");
            upgrade.classList.add("text-slate-800");
            upgrade.innerText = "archiver";
        }
    });
    let deletes = document.querySelectorAll("#delete");
    deletes.forEach((deleteButton) => {
        deleteButton.addEventListener("click", () => {
            let indexProduct = deleteButton.getAttribute("data-indexProduct");
            let indexCargo = deleteButton.getAttribute("data-indexCargo");
            let message = data[indexCargo].removeProduct(indexProduct);
            document.getElementById("messageBody").innerText = message;
            document.getElementById("message").classList.add("right-2");
            document.getElementById("message").classList.add("top-2");
            setTimeout(() => {
                document.getElementById("message").classList.remove("right-2");
                document.getElementById("message").classList.remove("top-2");
            }, 2000);
            deleteButton.parentElement.remove();
            sendToJson();
            donnee = data.slice(page * el, page * el + el);
            if (document.getElementById("cardContainer")?.style.display == "flex") {
                displayListCargos();
            }
            else {
                displayCargosCard();
            }
        });
    });
    document.querySelector("#DetailOverlay").classList.remove("hidden");
    document.querySelector("#DetailOverlay").classList.add("flex");
    document.querySelector("#DetailCargo").classList.add("right-2");
    document.querySelector("#DetailCargo").classList.remove("-right-full");
}
function getProduct() {
    let formProduct = document.getElementById("productForm");
    let sender = document.getElementById("sender");
    let receiver = document.getElementById("receiver");
    let formData = new FormData(formProduct);
    let senderData = new FormData(sender);
    let receiverData = new FormData(receiver);
    let senderName = senderData.get("clientName");
    let senderLastName = senderData.get("clientLastName");
    let senderPhone = senderData.get("clientPhone");
    let senderAddress = senderData.get("clientAddress");
    let receiverName = receiverData.get("receiverName");
    let receiverLastName = receiverData.get("receiverLastName");
    let receiverPhone = receiverData.get("receiverPhone");
    let receiverAddress = receiverData.get("receiverAddress");
    let senderUser = new User(senderName, senderLastName, senderPhone, senderAddress);
    let receiverUser = new User(receiverName, receiverLastName, receiverPhone, receiverAddress);
    let id = generateCargoID();
    let name = formData.get("productName");
    let type = formData.get("productType");
    let weight = parseFloat(formData.get("weight"));
    let newProduct;
    if (type == "Material") {
        let solidity = formData.get("solidity");
        newProduct = new MaterialProduct(id, name, weight, senderUser, receiverUser, type, solidity);
    }
    else if (type == "Chemical") {
        let tonicity = parseFloat(formData.get("tonicity"));
        newProduct = new ChemicalProduct(id, name, weight, senderUser, receiverUser, type, tonicity);
    }
    else {
        newProduct = new Product(id, name, weight, senderUser, receiverUser, type);
    }
    formProduct.reset();
    sender.reset();
    receiver.reset();
    return newProduct;
}
function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^(77|78|76|70|75)\d{7}$/;
    return phoneRegex.test(phoneNumber);
}
function validate(form) {
    let invalid = false;
    let inputs = document.querySelector(form);
    for (let index = 0; index < inputs.length; index++) {
        let input = inputs[index];
        if (input.value.trim() == "") {
            input.style.border = "1px solid red";
            invalid = true;
        }
        inputs[index].addEventListener("input", (e) => {
            if (e.target.value.trim() != "") {
                e.target.style.border = "1px solid grey";
            }
            else {
                input.style.border = "1px solid red";
                invalid = true;
            }
            if (e.target.name == "receiverPhone" || e.target.name == "clientPhone") {
                console.log(validatePhoneNumber(e.target.value));
                if (validatePhoneNumber(e.target.value) == false) {
                    console.log(e.target);
                    invalid = true;
                    e.target.style.border = "1px solid red";
                }
            }
        });
    }
    return invalid;
}
function getProductType() {
    let extraField = document.getElementById("extra");
    let productType = document.getElementById("productType");
    productType.addEventListener("input", () => {
        extraField.innerHTML = "";
        if (productType.selectedOptions[0].value == "Material") {
            let model = `
          <select name="solidity" class="p-3 bg-gray-600 rounded">
          <option value="cassable">cassable</option>
          <option value="incassable">incassable</option>
          </select>`;
            extraField.innerHTML += model;
        }
        else if (productType.selectedOptions[0].value == "Chemical") {
            let model = `
          <input type="number" name="tonicity" class="p-2" min="0" max="10" placeholder="Tonicity"/>
          `;
            extraField.innerHTML += model;
        }
        else {
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
        .then((data) => { })
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
    const cargoForm = document.getElementById("formCargo");
    // Create a new FormData object from the form
    const formData = new FormData(cargoForm);
    // Extract values from FormData
    const cargoType = formData.get("cargoType");
    const maxWeight = parseFloat(formData.get("maxWeight"));
    const duration = parseInt(formData.get("duration"));
    const fullIndicator = formData.get("fullIndicator");
    const startingDate = formData.get("startingDate");
    const endingDate = formData.get("endingDate");
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
    const cargo = Cargo.createCargo(generateCargoID(), // You need to implement a function to generate a unique cargo ID
    maxWeight, fullIndicator, startingLocation, // You need to extract this from the map or user input
    endingLocation, startingDate, endingDate, // You need to extract this from the map or user input
    distance, // You need to calculate this based on the selected locations
    duration, cargoType);
    data.push(cargo);
    sendToJson();
    // fetchData();
}
function isDateLate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const today = new Date();
    const inputDate = new Date(year, month - 1, day); // Months are zero-based in JavaScript Date
    return inputDate < today;
}
function displayCargosCard() {
    let cardContainer = document.getElementById("cardContainer");
    cardContainer.style.display = "grid";
    cardContainer.innerHTML = "";
    let cards = cardData
        .map((element, index) => {
        return `<div class="Card container md:max-w-56 lg:max-w-56 bg-gray-200 p-2 rounded flex flex-col gap-2 shadow-lg text-slate-700">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-2">
        <p class="text-xl font-semibold">Cargo ${element.id}</p>
        <p class="px-3 py-1 bg-green-500 text-white rounded">${element.cargoType}</p>
    </div>

    <!-- Image Section -->
    <div class="mb-2">
        <img src="./img/${element.cargoType}.png" alt="${element.cargoType} Image" class="w-full h-40 object-cover rounded-lg">
    </div>

    <!-- Weight Section -->
    <div class="flex justify-between items-center mb-2">
        <p class="text-lg font-medium">${element.totalWeight} / ${element.cargoMaxWeight} kg</p>
        <div class="relative" id="showAction" data-index="${index}">
            <div class="border absolute rounded bg-white shadow-lg min-w-44 -left-32 hidden z-10">
                <p class="px-4 py-2 hover:bg-gray-100 cursor-pointer" id="ajouterProduit" data-idCargo="${element.id}">Add Product</p>
                <p class="px-4 py-2 hover:bg-gray-100 cursor-pointer" data-detailId="${index}" id="detailSlider">Show Details</p>
                <p class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Start Cargo</p>
                <p class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Archive</p>
            </div>
            <i class="fa-solid fa-ellipsis cursor-pointer"></i>
        </div>
    </div>

    <!-- Route Section -->
    <div class="flex justify-between items-center text-lg">
        <p class=" text-blue-700  rounded-full">${element.from}</p>
        <p class="text-2xl font-bold text-gray-600">→</p>
        <p class=" text-blue-700  rounded-full">${element.to}</p>
    </div>
</div>
`;
    })
        .join("");
    cardContainer.innerHTML = cards;
    let cargos = document.querySelectorAll("#ajouterProduit");
    cargos.forEach((element) => {
        element.addEventListener("click", () => {
            let idCargo = element.getAttribute("data-idCargo");
            let index = data.findIndex((element) => element.id == idCargo);
            openAddProduct(index, data[index].typeOfCargo);
        });
    });
    let detailSlider = document.querySelectorAll("#detailSlider");
    detailSlider.forEach((element) => {
        element.addEventListener("click", () => {
            let index = parseInt(element.getAttribute("data-detailId"));
            showDetailCargo(index);
        });
    });
    let showActions = document.querySelectorAll("#showAction");
    showActions.forEach((element) => {
        element.addEventListener("click", () => {
            let index = parseInt(element.getAttribute("data-index"));
            showAction(element);
            // document.getElementById("cardContainer")!.addEventListener("click", (e) => {
            //   element.firstElementChild?.classList.add("hidden");
            // })
        });
    });
}
function showAction(element) {
    element.firstElementChild?.classList.remove("hidden");
}
function openAddProduct(index, typeOfCargo) {
    toggleSlide(index);
    let btnSliderAddProduct = document.getElementById("btnSliderAddProduct");
    let sliderAddProduct = document.getElementById("sliderAddProduct");
    let addProductForm = document.getElementById("addProductForm");
    let productType = document.getElementById("productType");
    productType.innerHTML = "";
    if (typeOfCargo === "Aerial") {
        productType.innerHTML += `
  <option value="Food">Food</option>
  <option value="Material">Material</option>
  `;
    }
    else if (typeOfCargo === "Maritime") {
        productType.innerHTML += `<option value="Food">Food</option><option value="Chemical">Chemical</option>`;
    }
    else {
        productType.innerHTML += `<option value="Food">Food</option><option value="Chemical">Chemical</option>
  <option value="Material">Material</option>`;
    }
    let clientPhone = document.getElementById("clientPhone");
    let client;
    clientPhone.addEventListener("input", () => {
        client = data[index].clientProduct(clientPhone.value);
        let clientName = document.getElementById("clientName");
        let clientLastName = document.getElementById("clientLastName");
        let clientAddress = document.getElementById("clientAddress");
        client;
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
    let cardContainer = document.getElementById("cardContainer");
    cardContainer.style.display = "flex";
    cardContainer.style.flexDirection = "column";
    cardContainer.innerHTML = "";
    let cards = donnee
        .map((element, index) => {
        let id = data.findIndex((e) => e.id == element.id);
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
      <button class="rounded-full group-hover:flex border  border-black border-solid items-center justify-center hidden w-6 h-6" data-detailId="${id}" id="detailSliderList">
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
    let cargos = document.querySelectorAll("#ajouterProduitList");
    cargos.forEach((element) => {
        element.addEventListener("click", () => {
            let idCargo = element.getAttribute("data-idCargo");
            let index = data.findIndex((element) => element.id == idCargo);
            openAddProduct(index, data[index].typeOfCargo);
        });
    });
    let detailSlider = document.querySelectorAll("#detailSliderList");
    detailSlider.forEach((element) => {
        element.addEventListener("click", () => {
            let index = parseInt(element.getAttribute("data-detailId"));
            showDetailCargo(index);
        });
    });
    paginate(5);
}
function paginate(el) {
    let next = document.querySelector("#next");
    let previous = document.querySelector("#previous");
    let pageInd = parseInt(document.querySelector("#page").getAttribute("data-page"));
    next.addEventListener("click", () => {
        if (data.slice(pageInd * el, (pageInd + 1) * el + el).length > 0) {
            pageInd = pageInd + 1;
            page = pageInd;
            donnee = data.slice(page * el, page * el + el);
            displayListCargos();
        }
    });
    previous.addEventListener("click", () => {
        if (pageInd > 0) {
            pageInd = pageInd - 1;
            page = pageInd;
            donnee = data.slice(page * el, page * el + el);
            displayListCargos();
        }
    });
}
async function fetchData() {
    try {
        const response = await fetch("http://www.bakemono.sn:8001/newGpApp/public/dist/data.php");
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const responseData = await response.json();
        data = responseData.cargos; // Extracting the cargos array directly
        data.forEach((cargo, index) => {
            let products = cargo.products;
            products = products.map((product) => {
                return transformToProduct(product);
            });
            data[index] = transformToCargo(cargo);
            data[index].products = products;
        });
        donnee = data.slice(page * el, page * el + el);
        cardData = data;
        if (document.getElementById("cardContainer")?.style.display == "flex") {
            displayListCargos();
        }
        else {
            displayCargosCard();
        }
        filter();
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
}
fetchData();
function createProductFromForm() {
    let ProductData = new FormData(document.getElementById("productForm"));
    let user = new User("bakemono", "san", "785953562", "Ouakam");
    let receiver = new User("bakemono", "san", "785953562", "united kingdom");
    let id = generateCargoID();
    let name = ProductData.get("productName");
    let type = ProductData.get("productType");
    let weight = parseFloat(ProductData.get("weight"));
    let newProduct;
    if (type == "Material") {
        let solidity = ProductData.get("solidity");
        newProduct = new MaterialProduct(id, name, weight, user, receiver, type, solidity);
    }
    else if (type == "Chemical") {
        let tonicity = parseFloat(ProductData.get("tonicity"));
        newProduct = new ChemicalProduct(id, name, weight, user, receiver, type, tonicity);
    }
    else {
        newProduct = new Product(id, name, weight, user, receiver, type);
    }
    //   createProductCard(newProduct);
    // console.log(newProduct);
    sendToJson();
    fetchData();
}
function transformToCargo(object) {
    const cargoType = object.cargoType;
    if (cargoType === "Aerial") {
        let cargo = AerialCargo.createCargo(object.id, object.maxWeight, object.fullIndicator, object.from, object.to, object.startingDate, object.endingDate, object.distance, object.duration, object.cargoType);
        cargo.status = object.status;
        cargo.globalState = object.globalState;
        return cargo;
    }
    else if (cargoType === "Maritime") {
        let cargo = MaritimeCargo.createCargo(object.id, object.maxWeight, object.fullIndicator, object.from, object.to, object.startingDate, object.endingDate, object.distance, object.duration, object.cargoType);
        cargo.status = object.status;
        cargo.globalState = object.globalState;
        return cargo;
    }
    else if (cargoType === "Road") {
        let cargo = RoadCargo.createCargo(object.id, object.maxWeight, object.fullIndicator, object.from, object.to, object.startingDate, object.endingDate, object.distance, object.duration, object.cargoType);
        cargo.status = object.status;
        cargo.globalState = object.globalState;
        return cargo;
    }
}
function transformToProduct(object) {
    if (object.productType == "Food") {
        let product = FoodProduct.createProduct(object.id, object.name, object.weight, object.client, object.receiver, object.productType);
        product.productPrice = object.price;
        return product;
    }
    else if (object.productType == "Chemical") {
        let product = new ChemicalProduct(object.id, object.name, object.weight, object.client, object.receiver, object.productType, object.tonicity);
        product.productPrice = object.price;
        return product;
    }
    else {
        let product = MaterialProduct.createProduct(object.id, object.name, object.weight, object.client, object.receiver, object.productType, object.productSolidity);
        product.productPrice = object.price;
        return product;
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
let listView = document.getElementById("listView");
let cardView = document.getElementById("cardView");
listView.addEventListener("click", () => {
    displayListCargos();
});
cardView.addEventListener("click", () => {
    displayCargosCard();
});
let findProduct = document.getElementById("findProduct");
findProduct.addEventListener("input", () => {
    let product = data.filter((element) => {
        element.searchProduct(findProduct.value);
    });
    console.log(product);
});
async function sendEmail(text, pdfBase64) {
    const templateParams = {
        to_email: "ochatobake@gmail.com",
        subject: "Added product",
        message: `Product ID: ${text}`,
        attachment: [
            {
                name: "yourfile.pdf",
                data: pdfBase64,
            },
        ],
    };
    try {
        const response = await emailjs.send("service_ihqi8ze", "template_j89td5b", templateParams);
        console.log("Email sent successfully:", response.status, response.text);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
}
function generateRecipePDF(product) {
    return new Promise((resolve, reject) => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // Title
        doc.setFontSize(22);
        doc.text("Recu de livraison", 105, 20, { align: "center" });
        // Product details
        doc.setFontSize(16);
        doc.text("Détails du produit:", 20, 40);
        doc.setFontSize(12);
        doc.text(`Identifiant: ${product.ProductID}`, 20, 30);
        doc.text(`Nom du produit: ${product.productName}`, 20, 50);
        doc.text(`Poids: ${product.ProductWeight} kg`, 20, 60);
        doc.text(`Type de produit: ${product.getproductType}`, 20, 70);
        doc.text(`Statut du produit: ${product.ProductStatus}`, 20, 80);
        doc.text(`Prix: $${product.getPrice()}`, 20, 90);
        doc.line(20, 35, 190, 35);
        // Client details
        doc.setFontSize(16);
        doc.text("Détails du client:", 20, 100);
        doc.setFontSize(12);
        doc.text(`Nom du client: ${product.productClient.surname} ${product.productClient.name}`, 20, 110);
        doc.text(`Téléphone: ${product.productClient.phone}`, 20, 120);
        doc.text(`Adresse: ${product.productClient.address}`, 20, 130);
        doc.line(20, 35, 190, 35);
        // Receiver details
        doc.setFontSize(16);
        doc.text("Détails du destinataire:", 20, 140);
        doc.setFontSize(12);
        doc.text(`Nom du destinataire: ${product.productReceiver.surname} ${product.productReceiver.name}`, 20, 150);
        doc.text(`Téléphone: ${product.productReceiver.phone}`, 20, 160);
        doc.text(`Adresse: ${product.productReceiver.address}`, 20, 170);
        doc.setFontSize(12);
        doc.text("Cargo du monde", 190, 200, { align: "right" });
        // Convert to base64 string
        doc.save(`${product.productName}.pdf`);
        const pdfBase64 = doc.output("datauristring").split(",")[1];
        resolve(pdfBase64);
    });
}
