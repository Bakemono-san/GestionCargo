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
    }
  });
  console.log(product);
  let model = `<div class="flex-1 p-8 text-gray-500 flex flex-col justify-between">
    <div class="flex justify-between">
        <h1 class="text-2xl">Cargo ${product!.ProductID} </h1>
        <p class="px-2 py-1 rounded text-center">name: ${
          product!.productName
        }</p>
    </div>

    <div class="flex justify-between">
    <div>
        <h1 class="text-xl">weight : </h1>
        <p>${product!.ProductWeight} kg</p>
    </div>
    <div>
        <h1 class="text-xl">price : </h1>
        <p>${product!.getPrice()} fcfa</p>
    </div>
    
    </div>
    <div class="flex justify-between">
    <div>
    <h1 class="text-xl">client name : </h1>
    <p class="px-2 py-1 bg-gray-500 text-white rounded text-center" id="setStatus">${
      product!.productClient.name
    }</p>
</div><div>
<h1 class="text-xl">receiver name : </h1>
<p class="px-2 py-1 bg-green-500 text-white rounded text-center cursor-pointer" id="setGlobalState">${
    product!.productReceiver.name
  }</p>
</div>
    </div>

    <div class="flex justify-between">

        <div>
            <h1 class="text-xl">client phone : </h1>
            <p>${product!.productClient.phone}</p>
        </div>

        <div>
            <h1 class="text-xl">receiver phone : </h1>
            <p>${product!.productReceiver.phone}</p>
        </div>
    </div>

    <div class="flex justify-between">

        <div>
            <h1 class="text-xl">client Address : </h1>
            <p>${product!.productClient.address}</p>
        </div>

        <div>
            <h1 class="text-xl">receiver Address : </h1>
            <p>${product!.productReceiver.address}</p>
        </div>
    </div>

</div>
`;

detail.innerHTML = model;
}

let findProduct = document.getElementById("findProduct") as HTMLInputElement;
findProduct?.addEventListener("input", () => {
  getProduct(findProduct.value);
});

let detail = document.getElementById("detail") as HTMLDivElement;
