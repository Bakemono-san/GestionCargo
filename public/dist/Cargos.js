// import { sendMessage } from "./index.js";
export class User {
    name;
    surname;
    phone;
    address;
    constructor(name, surname, phone, address) {
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.address = address;
    }
}
export class Product {
    id;
    name;
    weight;
    client;
    receiver;
    productType;
    productStatus = "loading";
    static minPrice = 10000;
    price = 0;
    constructor(id, name, weight, client, receiver, productType) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.client = client;
        this.receiver = receiver;
        this.productType = productType;
    }
    deliver() {
        this.productStatus = "delivered";
        sendMessage(`votre colis est arrivee.info => nom: ${this.productName}  identifiant: ${this.ProductID} prix: ${this.price}`, this.clientNumber);
        sendMessage(`votre colis est arrivee  .info => nom: ${this.productName}  identifiant: ${this.ProductID} prix: ${this.price}`, this.receiverNumber);
    }
    markLost() {
        this.productStatus = "lost";
        sendMessage(`votre colis a ete perdue.info => nom: ${this.productName}  identifiant: ${this.ProductID} prix: ${this.price}`, "+221" + this.clientNumber);
        sendMessage(`votre colis a ete perdue.info => nom: ${this.productName}  identifiant: ${this.ProductID} prix: ${this.price}`, "+221" + this.receiverNumber);
    }
    archive() {
        this.productStatus = "archived";
    }
    get getproductType() {
        return this.productType;
    }
    set productPrice(data) {
        if (data >= 10000) {
            this.price = data;
        }
        else {
            this.price = 10000;
        }
    }
    get productName() {
        return this.name;
    }
    get productPrice() {
        return this.price;
    }
    get ProductID() {
        return this.id;
    }
    get productClient() {
        return this.client;
    }
    get productReceiver() {
        return this.receiver;
    }
    get clientNumber() {
        return this.client.phone;
    }
    get receiverNumber() {
        return this.client.phone;
    }
    get ProductWeight() {
        return this.weight;
    }
    get ProductStatus() {
        return this.productStatus;
    }
    set ProductStatus(status) {
        this.productStatus = status;
    }
    info() {
        console.log(`Product ID: ${this.id}, Name: ${this.name}, Weight: ${this.weight}, Price: ${this.price}, Status: ${this.productStatus}, Client: ${this.client}, Type: ${this.productType}`);
    }
    getPrice() {
        return this.price;
    }
    static createProduct(id, name, weight, client, receiver, productType, productSolidity, productTonicity) {
        switch (productType) {
            case "Chemical":
                return new ChemicalProduct(id, name, weight, client, receiver, productType, productTonicity);
            case "Material":
                return new MaterialProduct(id, name, weight, client, receiver, productType, productSolidity);
            case "Food":
                return new FoodProduct(id, name, weight, client, receiver, productType);
            default:
                throw new Error("Invalid product type");
        }
    }
}
export class ChemicalProduct extends Product {
    id;
    name;
    weight;
    client;
    receiver;
    productType;
    tonicity;
    autreFrais = 10000;
    constructor(id, name, weight, client, receiver, productType, tonicity) {
        super(id, name, weight, client, receiver, productType);
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.client = client;
        this.receiver = receiver;
        this.productType = productType;
        this.tonicity = tonicity;
    }
}
export class MaterialProduct extends Product {
    id;
    name;
    weight;
    client;
    receiver;
    productType;
    productSolidity;
    constructor(id, name, weight, client, receiver, productType, productSolidity) {
        super(id, name, weight, client, receiver, productType);
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.client = client;
        this.receiver = receiver;
        this.productType = productType;
        this.productSolidity = productSolidity;
    }
}
class Breakable extends MaterialProduct {
}
class Unbreakable extends MaterialProduct {
}
export class FoodProduct extends Product {
    id;
    name;
    weight;
    client;
    receiver;
    productType;
    autreFrais = 5000;
    constructor(id, name, weight, client, receiver, productType) {
        super(id, name, weight, client, receiver, productType);
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.client = client;
        this.receiver = receiver;
        this.productType = productType;
    }
}
export class Cargo {
    id;
    maxWeight;
    fullIndicator;
    from;
    to;
    startingDate;
    endingDate;
    distance;
    duration;
    cargoType;
    products = [];
    globalState = "open";
    status = "loading";
    basePrice = 10000;
    full = false;
    constructor(id, maxWeight, fullIndicator, from, to, startingDate, endingDate, distance, duration, cargoType) {
        this.id = id;
        this.maxWeight = maxWeight;
        this.fullIndicator = fullIndicator;
        this.from = from;
        this.to = to;
        this.startingDate = startingDate;
        this.endingDate = endingDate;
        this.distance = distance;
        this.duration = duration;
        this.cargoType = cargoType;
    }
    get dateArrivee() {
        return this.endingDate;
    }
    archive() {
        this.status = "archived";
    }
    get getId() {
        return this.id;
    }
    set product(data) {
        this.products = data;
    }
    totalPrice() {
        let totalPrice = 0;
        for (let product of this.products) {
            totalPrice += product.getPrice();
        }
        return totalPrice;
    }
    addProduct(product) {
        if (this.globalState == "open") {
            if (this.full)
                return "Cargo is full";
            else if (this.fullIndicator == "numberOfProduct") {
                this.products.push(product);
                if (this.products.length >= this.maxWeight) {
                    this.full = true;
                }
                return "cargo added successfully";
            }
            else {
                if (this.totalWeight >= this.maxWeight) {
                    this.full = true;
                    return "Cargo is full";
                }
                else {
                    this.products.push(product);
                    if (this.totalWeight >= this.maxWeight) {
                        this.full = true;
                    }
                    return "cargo added successfully";
                }
            }
        }
        else {
            return "error this Cargo is closed";
        }
    }
    clientProduct(phone) {
        let products = this.products.map((product) => {
            return product.clientNumber == phone && product;
        });
        return products;
    }
    get cargoMaxWeight() {
        return this.maxWeight;
    }
    upgradeStatus() {
        if (this.status == "loading") {
            if (this.products.length > 0) {
                this.status = "transporting";
                this.globalState = "closed";
                this.products.forEach((product) => {
                    product.ProductStatus = "transporting";
                });
                return "started , cargo is now in transit";
            }
            else {
                return "can't start an empty cargo";
            }
        }
        else if (this.status == "transporting") {
            this.status = "delivered";
            this.products.forEach((product) => {
                sendMessage("la cargaison contenant votre produit est arrivee veuillez venir le recuperer ", product.clientNumber);
                sendMessage("la cargaison contenant votre produit est arrivee veuillez venir le recuperer", product.receiverNumber);
                return "sending email...";
            });
            this.products.forEach((product) => {
                product.ProductStatus = "transporting";
            });
        }
        else if (this.status == "delivered") {
            this.status = "archived";
        }
    }
    get cargoFrom() {
        return this.from;
    }
    get cargoTo() {
        return this.to;
    }
    get cargoStartingDate() {
        return this.startingDate;
    }
    get cargoEndingDate() {
        return this.endingDate;
    }
    searchProduct(id) {
        return this.products.find((product) => {
            return product.ProductID == id && product;
        });
    }
    removeProduct(index) {
        if (this.cargoGlobalState == "open")
            this.products.splice(index, 1);
        return "product removed successfully";
    }
    getProduct(index) {
        return this.products[index];
    }
    markProductLost(index) {
        this.products[index].markLost();
        return "product marked as lost";
    }
    markLost() {
        this.status = "lost";
        this.cargoGlobalState = "closed";
        this.products.forEach((product) => {
            product.ProductStatus = "lost";
        });
    }
    set cargoStatus(status) {
        if (this.cargoStatus == "loading") {
            this.cargoStatus = status;
        }
    }
    get cargoStatus() {
        return this.status;
    }
    set cargoGlobalState(state) {
        if (this.cargoStatus == "loading") {
            this.globalState = this.globalState == "closed" ? "open" : "closed";
        }
        else {
            this.globalState = "closed";
        }
    }
    changeState() {
        if (this.cargoStatus == "loading") {
            this.globalState = this.globalState == "closed" ? "open" : "closed";
        }
        else {
            this.globalState = "closed";
        }
    }
    get cargoGlobalState() {
        return this.globalState;
    }
    get totalWeight() {
        let totalWeight = 0;
        this.products.forEach((product) => {
            totalWeight += product.ProductWeight;
        });
        return totalWeight;
    }
    get listOfProducts() {
        return this.products;
    }
    get typeOfCargo() {
        return this.cargoType;
    }
    info() {
        console.log(`Cargo ID: ${this.id}, Products: ${this.products.length}, Total Weight: ${this.totalWeight}/${this.maxWeight} kg, From: ${this.from}, To: ${this.to} and of type ${this.typeOfCargo}`);
    }
    static createCargo(id, maxWeight, fullIndicator, from, to, startingDate, endingDate, distance, duration, cargoType) {
        switch (cargoType) {
            case "Road":
                return new RoadCargo(id, maxWeight, fullIndicator, from, to, startingDate, endingDate, distance, duration, cargoType);
            case "Maritime":
                return new MaritimeCargo(id, maxWeight, fullIndicator, from, to, startingDate, endingDate, distance, duration, cargoType);
            case "Aerial":
                return new AerialCargo(id, maxWeight, fullIndicator, from, to, startingDate, endingDate, distance, duration, cargoType);
            default:
                throw new Error("Invalid cargo type");
        }
    }
}
export class RoadCargo extends Cargo {
    foodPrice = 100;
    matPrice = 200;
    addProduct(product) {
        if (product instanceof FoodProduct) {
            product.price = this.foodPrice * this.distance;
        }
        else if (product instanceof MaterialProduct) {
            product.price = this.matPrice * this.distance;
        }
        if (product instanceof ChemicalProduct) {
            return "Chemical products are not allowed in road cargo";
        }
        else {
            if (this.globalState == "open") {
                if (this.full)
                    return "Cargo is full";
                else if (this.fullIndicator == "numberOfProduct") {
                    this.products.push(product);
                    if (this.products.length >= this.maxWeight) {
                        this.full = true;
                    }
                    return "cargo added successfully";
                }
                else {
                    if (this.totalWeight >= this.maxWeight) {
                        this.full = true;
                        return "error this Cargo is full";
                    }
                    else {
                        this.products.push(product);
                        if (this.totalWeight >= this.maxWeight) {
                            this.full = true;
                        }
                        return "cargo added successfully";
                    }
                }
            }
            else {
                return "error this Cargo is closed";
            }
        }
    }
    totalPrice() {
        let totalPrice = 0;
        this.products.forEach((product) => {
            if (product instanceof FoodProduct) {
                totalPrice += product.productPrice;
            }
            else if (product instanceof MaterialProduct) {
                totalPrice += product.productPrice;
            }
            else {
                totalPrice += product.productPrice;
            }
        });
        return totalPrice;
    }
}
export class MaritimeCargo extends Cargo {
    foodPrice = 90;
    matPrice = 400;
    addProduct(product) {
        if (product instanceof FoodProduct) {
            product.price = this.foodPrice * this.distance;
        }
        else if (product instanceof MaterialProduct) {
            product.price = this.matPrice * this.distance;
        }
        else {
            product.price = 500 * this.distance + 15000;
        }
        console.log(product.productPrice, this.foodPrice * this.distance);
        if (product instanceof Breakable) {
            return "error Breakable products are not allowed in maritime cargo";
        }
        else {
            if (this.globalState == "open") {
                if (this.full)
                    return "error this Cargo is full";
                else if (this.fullIndicator == "numberOfProduct") {
                    this.products.push(product);
                    if (this.products.length >= this.maxWeight) {
                        this.full = true;
                    }
                    return "cargo added successfully";
                }
                else {
                    if (this.totalWeight >= this.maxWeight) {
                        this.full = true;
                        return "error this Cargo is full";
                    }
                    else {
                        this.products.push(product);
                        if (this.totalWeight >= this.maxWeight) {
                            this.full = true;
                        }
                        return "cargo added successfully";
                    }
                }
            }
            else {
                return "error this Cargo is closed";
            }
        }
    }
    totalPrice() {
        let totalPrice = 0;
        this.products.forEach((product) => {
            totalPrice += product.productPrice;
        });
        return totalPrice;
    }
}
export class AerialCargo extends Cargo {
    foodPrice = 300;
    matPrice = 1000;
    addProduct(product) {
        if (product instanceof FoodProduct) {
            product.price = this.foodPrice * this.distance;
        }
        else if (product instanceof MaterialProduct) {
            product.price = this.matPrice * this.distance;
        }
        console.log(product, this.foodPrice * this.distance);
        if (product instanceof ChemicalProduct) {
            return "Chemical products are not allowed in road cargo";
        }
        else {
            if (this.globalState == "open") {
                if (this.full)
                    return "Cargo is full";
                else if (this.fullIndicator == "numberOfProduct") {
                    this.products.push(product);
                    if (this.products.length >= this.maxWeight) {
                        this.full = true;
                    }
                    return "cargo added successfully";
                }
                else {
                    if (this.totalWeight >= this.maxWeight) {
                        this.full = true;
                        return "error Cargo is full";
                    }
                    else {
                        this.products.push(product);
                        if (this.totalWeight >= this.maxWeight) {
                            this.full = true;
                        }
                        return "cargo added successfully";
                    }
                }
            }
            else {
                return "error this Cargo is closed";
            }
        }
    }
    totalPrice() {
        let totalPrice = 0;
        this.products.forEach((product) => {
            console.log(product);
            totalPrice += product.productPrice;
        });
        return totalPrice;
    }
}
export function sendMessage(message, to) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "App 853ade41efa2b52f62802f7c24c9adb5-85424141-bfb5-41a2-922d-8269e650ef73");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    const raw = JSON.stringify({
        messages: [
            {
                destinations: [{ to: to }],
                from: "ServiceSMS",
                text: message,
            },
        ],
    });
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };
    fetch("https://ggm1rj.api.infobip.com/sms/2/text/advanced", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}
