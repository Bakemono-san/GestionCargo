import {
  AerialCargo,
  Cargo,
  ChemicalProduct,
  FoodProduct,
  MaritimeCargo,
  MaterialProduct,
  Product,
  RoadCargo,
  Tonicity,
  User,
} from "./Cargos.js";

let data: any;

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
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function transformToProduct(object: any) {
  if (object.productType == "Food") {
    let product = FoodProduct.createProduct(
      object.id,
      object.name,
      object.weight,
      object.client as User,
      object.receiver as User,
      object.productType
    );
    product.price = object.price;
    product.ProductStatus = object.productStatus;
    return product;
  } else if (object.productType == "Chemical") {
    let product = new ChemicalProduct(
      object.id,
      object.name,
      object.weight,
      object.client as User,
      object.receiver as User,
      object.productType,
      object.tonicity as Tonicity
    );
    product.price = object.price;
    product.ProductStatus = object.productStatus;
    return product;
  } else {
    let product = MaterialProduct.createProduct(
      object.id,
      object.name,
      object.weight,
      object.client as User,
      object.receiver as User,
      object.productType,
      object.productSolidity
    );
    product.ProductStatus = object.productStatus;
    product.price = object.price;
    return product;
  }
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

fetchData();

function getProduct(id: string) {
  let product;
  data.forEach((Element: Cargo) => {
    if (Element.searchProduct(parseInt(id))) {
      product = Element.searchProduct(parseInt(id));
      console.log(product);
      let model = `<div class="mx-auto w-full max-w-4xl p-8 bg-white rounded-lg shadow-2xl text-gray-800 space-y-8">
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
            <p class="mt-1 px-2 py-1 bg-yellow-500 text-white rounded">${product.ProductStatus}</p>
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
      <div class="flex justify-center pt-4">
        <button class="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
          Recuperer
        </button>
      </div>
    </div>
    
      
      `;

      detail.innerHTML = model;
    }
  });
}

let findProduct = document.getElementById("findProduct") as HTMLInputElement;

let detail = document.getElementById("detail") as HTMLDivElement;
findProduct.value = "";
findProduct?.addEventListener("input", () => {
  getProduct(findProduct.value);
});
