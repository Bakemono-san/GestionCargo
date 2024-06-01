export class User {
    constructor(name, surname, phone, address) {
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.address = address;
    }
}
export class Product {
    constructor(id, name, weight, client, receiver, productType) {
        this.id = id;
        this.name = name;
        this.weight = weight;
        this.client = client;
        this.receiver = receiver;
        this.productType = productType;
        this.productStatus = "loading";
        this.price = 0;
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
    get clientNumber() {
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
    static createProduct(id, name, weight, client, receiver, productType, productSolidity, productTonicity) {
        console.log(productType);
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
Product.minPrice = 10000;
export class ChemicalProduct extends Product {
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
}
export class Cargo {
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
        this.products = [];
        this.globalState = "open";
        this.status = "loading";
        this.full = false;
    }
    get getId() {
        return this.id;
    }
    set product(data) {
        this.products = data;
    }
    addProduct(product) {
        if (this.full)
            throw new Error("Cargo is full");
        else if (this.fullIndicator == "numberOfProduct") {
            this.products.push(product);
            if (this.products.length >= this.maxWeight) {
                this.full = true;
                throw new Error("Cargo is full");
            }
        }
        else {
            if (this.totalWeight >= this.maxWeight) {
                this.full = true;
                throw new Error("Cargo is full");
            }
            else {
                this.products.push(product);
                if (this.totalWeight >= this.maxWeight) {
                    this.full = true;
                }
            }
        }
    }
    clientProduct(phone) {
        let products = this.products.map((product) => {
            return product.clientNumber == phone;
        });
    }
    get cargoMaxWeight() {
        return this.maxWeight;
    }
    upgradeStatus() {
        if (this.status == "loading") {
            if (this.products.length > 0) {
                this.status = "transporting";
            }
            else {
                return "can't start an empty cargo";
            }
        }
        else if (this.status == "transporting") {
            this.status = "delivered";
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
        return this.products.find((product) => product.ProductID == id);
    }
    removeProduct(index) {
        if (this.cargoGlobalState == "open")
            this.products.splice(index, 1);
    }
    getProduct(index) {
        return this.products[index];
    }
    markLost() {
        this.status = "lost";
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
        this.globalState = this.globalState == "closed" ? "open" : "closed";
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
    addProduct(product) {
        if (product instanceof ChemicalProduct) {
            throw new Error("Chemical products are not allowed in road cargo");
        }
        else {
            super.addProduct(product);
        }
    }
}
export class MaritimeCargo extends Cargo {
    addProduct(product) {
        if (product instanceof Breakable) {
            throw new Error("Breakable products are not allowed in maritime cargo");
        }
        else {
            super.addProduct(product);
        }
    }
}
export class AerialCargo extends Cargo {
    addProduct(product) {
        if (product instanceof ChemicalProduct) {
            throw new Error("Chemical products are not allowed in road cargo");
        }
        else {
            super.addProduct(product);
        }
    }
}
