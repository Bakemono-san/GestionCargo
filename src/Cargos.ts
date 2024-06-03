export type CargoType = "Aerial" | "Maritime" | "Road";
export type State = "closed" | "open";
export type Status = "loading" | "transporting" | "delivered" | "lost";
export type fullIndicator = "weight" | "numberOfProduct";

export class User {
  constructor(
    protected name: string,
    protected surname: string,
    public phone: string,
    protected address: string
  ) {}
}

export class Product {
  protected productStatus: Status = "loading";
  static minPrice: number = 10000;
  protected price: number = 0;

  constructor(
    protected id: number,
    protected name: string,
    protected weight: number,
    protected client: User,
    protected receiver: User,
    protected productType: string
  ) {}

  get productName() {
    return this.name;
  }

  get productPrice(): number {
    return this.price;
  }

  get ProductID(): number {
    return this.id;
  }

  get productClient(): User {
    return this.client;
  }


  get productReceiver(): User {
    return this.receiver;
  }

  get clientNumber(): string {
    return this.client.phone;
  }

  get ProductWeight(): number {
    return this.weight;
  }

  get ProductStatus(): Status {
    return this.productStatus;
  }

  set ProductStatus(status: Status) {
    this.productStatus = status;
  }

  info() {
    console.log(
      `Product ID: ${this.id}, Name: ${this.name}, Weight: ${this.weight}, Price: ${this.price}, Status: ${this.productStatus}, Client: ${this.client}, Type: ${this.productType}`
    );
  }

  getPrice(distance: number, price: number) {
    if (distance * price >= 100000) {
      return distance * price;
    } else {
      return 100000;
    }
  }

  static createProduct(
    id: number,
    name: string,
    weight: number,
    client: User,
    receiver: User,
    productType: string,
    productSolidity?: "breakable" | "unbreakable",
    productTonicity?: Tonicity
  ): Product {
    switch (productType) {
      case "Chemical":
        return new ChemicalProduct(
          id,
          name,
          weight,
          client,
          receiver,
          productType,
          productTonicity!
        );
      case "Material":
        return new MaterialProduct(
          id,
          name,
          weight,
          client,
          receiver,
          productType,
          productSolidity!
        );
      case "Food":
        return new FoodProduct(id, name, weight, client, receiver, productType);
      default:
        throw new Error("Invalid product type");
    }
  }
}

export type Tonicity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export class ChemicalProduct extends Product {
  public autreFrais: number = 10000;
  constructor(
    protected id: number,
    protected name: string,
    protected weight: number,
    protected client: User,
    protected receiver: User,
    protected productType: string,
    protected tonicity: Tonicity
  ) {
    super(id, name, weight, client, receiver, productType);
  }

  getPrice(distance: number) {
    return distance * 500 + this.autreFrais;
  }
}

export class MaterialProduct extends Product {
  constructor(
    protected id: number,
    protected name: string,
    protected weight: number,
    protected client: User,
    protected receiver: User,
    protected productType: string,
    protected productSolidity: "breakable" | "unbreakable"
  ) {
    super(id, name, weight, client, receiver, productType);
  }

  getPrice(distance: number, price: number) {
    if (distance * price >= 100000) {
      return distance * price;
    } else {
      return 100000;
    }
  }
}

class Breakable extends MaterialProduct {}

class Unbreakable extends MaterialProduct {}

export class FoodProduct extends Product {
  public autreFrais: number = 5000;
  constructor(
    protected id: number,
    protected name: string,
    protected weight: number,
    protected client: User,
    protected receiver: User,
    protected productType: string
  ) {
    super(id, name, weight, client, receiver, productType);
  }
  getPrice(distance: number, price: number) {
    if (distance * price + this.autreFrais >= 100000) {
      return distance * price + this.autreFrais;
    } else {
      return 100000;
    }
  }
}

export class Cargo {
  protected products: Product[] = [];
  public globalState: State = "open";
  public status: Status = "loading";
  protected basePrice: number = 10000;

  protected full: boolean = false;

  constructor(
    public id: number,
    protected maxWeight: number,
    protected fullIndicator: fullIndicator,
    public from: string,
    public to: string,
    protected startingDate: string,
    protected endingDate: string,
    protected distance: number,
    protected duration: number,
    protected cargoType: CargoType
  ) {}

  get getId() {
    return this.id;
  }

  set product(data: Product[]) {
    this.products = data;
  }

  totalPrice() {
    let totalPrice = 0;
    for (let product of this.products) {
      totalPrice += product.getPrice(this.distance, this.basePrice);
    }
    return totalPrice;
  }

  addProduct(product: Product): void {
    if (this.full) throw new Error("Cargo is full");
    else if (this.fullIndicator == "numberOfProduct") {
      this.products.push(product);
      if (this.products.length >= this.maxWeight) {
        this.full = true;
        throw new Error("Cargo is full");
      }
    } else {
      if (this.totalWeight >= this.maxWeight) {
        this.full = true;
        throw new Error("Cargo is full");
      } else {
        this.products.push(product);
        if (this.totalWeight >= this.maxWeight) {
          this.full = true;
        }
      }
    }
  }

  clientProduct(phone: string) {
    let products = this.products.map((product) => {
      return product.clientNumber == phone && product;
    });
    return products;
  }

  get cargoMaxWeight() {
    return this.maxWeight;
  }

  upgradeStatus() {
    console.log(this.status);

    if (this.status == "loading") {
      if (this.products.length > 0) {
        this.status = "transporting";
      } else {
        return "can't start an empty cargo";
      }
    } else if (this.status == "transporting") {
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

  searchProduct(id: number): Product {
    return this.products.find((product) => {
      return product.ProductID == id && product;
    })!;
  }

  removeProduct(index: number): void {
    if (this.cargoGlobalState == "open") this.products.splice(index, 1);
  }

  getProduct(index: number): Product {
    return this.products[index];
  }

  markLost(): void {
    this.status = "lost";
    this.cargoGlobalState = "closed";
  }

  set cargoStatus(status: Status) {
    if (this.cargoStatus == "loading") {
      this.cargoStatus = status;
    }
  }

  get cargoStatus(): Status {
    return this.status;
  }

  set cargoGlobalState(state: State) {
    if (this.cargoStatus == "loading") {
      this.globalState = this.globalState == "closed" ? "open" : "closed";
    } else {
      this.globalState = "closed";
    }
  }

  changeState() {
    if (this.cargoStatus == "loading") {
      this.globalState = this.globalState == "closed" ? "open" : "closed";
    } else {
      this.globalState = "closed";
    }
  }

  get cargoGlobalState(): State {
    return this.globalState;
  }

  get totalWeight(): number {
    let totalWeight: number = 0;
    this.products.forEach((product) => {
      totalWeight += product.ProductWeight;
    });
    return totalWeight;
  }

  get listOfProducts(): Product[] {
    return this.products;
  }

  get typeOfCargo() {
    return this.cargoType;
  }

  info(): void {
    console.log(
      `Cargo ID: ${this.id}, Products: ${this.products.length}, Total Weight: ${this.totalWeight}/${this.maxWeight} kg, From: ${this.from}, To: ${this.to} and of type ${this.typeOfCargo}`
    );
  }

  static createCargo(
    id: number,
    maxWeight: number,
    fullIndicator: fullIndicator,
    from: string,
    to: string,
    startingDate: string,
    endingDate: string,
    distance: number,
    duration: number,
    cargoType: CargoType
  ): Cargo {
    switch (cargoType) {
      case "Road":
        return new RoadCargo(
          id,
          maxWeight,
          fullIndicator,
          from,
          to,
          startingDate,
          endingDate,
          distance,
          duration,
          cargoType
        );
      case "Maritime":
        return new MaritimeCargo(
          id,
          maxWeight,
          fullIndicator,
          from,
          to,
          startingDate,
          endingDate,
          distance,
          duration,
          cargoType
        );
      case "Aerial":
        return new AerialCargo(
          id,
          maxWeight,
          fullIndicator,
          from,
          to,
          startingDate,
          endingDate,
          distance,
          duration,
          cargoType
        );
      default:
        throw new Error("Invalid cargo type");
    }
  }
}

export class RoadCargo extends Cargo {
  protected foodPrice: number = 100;
  protected matPrice: number = 200;
  addProduct(product: Product): void {
    if (product instanceof ChemicalProduct) {
      throw new Error("Chemical products are not allowed in road cargo");
    } else {
      super.addProduct(product);
    }
  }

  totalPrice(): number {
    let totalPrice: number = 0;
    this.products.forEach((product) => {
      if(product instanceof FoodProduct) {
        totalPrice += product.getPrice(this.distance, this.foodPrice);
      }else if(product instanceof MaterialProduct) {
        totalPrice += product.getPrice(this.distance, this.matPrice);
      }else {
        totalPrice += product.getPrice(this.distance, 0)
      }
    });

    return totalPrice;
  }
}

export class MaritimeCargo extends Cargo {

  protected foodPrice: number = 90;
  protected matPrice: number = 400;
  addProduct(product: Product): void {
    if (product instanceof Breakable) {
      throw new Error("Breakable products are not allowed in maritime cargo");
    } else {
      super.addProduct(product);
    }
  }

  totalPrice(): number {
    let totalPrice: number = 0;
    this.products.forEach((product) => {
      if(product instanceof FoodProduct) {
        totalPrice += product.getPrice(this.distance, this.foodPrice);
      }else if(product instanceof MaterialProduct) {
        totalPrice += product.getPrice(this.distance, this.matPrice);
      }else {
        totalPrice += product.getPrice(this.distance, 0)
      }
    });

    return totalPrice;
  }
}

export class AerialCargo extends Cargo {
  protected foodPrice: number = 300;
  protected matPrice: number = 1000;
  addProduct(product: Product): void {
    if (product instanceof ChemicalProduct) {
      throw new Error("Chemical products are not allowed in road cargo");
    } else {
      super.addProduct(product);
    }
  }

  totalPrice(): number {
    let totalPrice: number = 0;
    this.products.forEach((product) => {
      if(product instanceof FoodProduct) {
        totalPrice += product.getPrice(this.distance, this.foodPrice);
      }else if(product instanceof MaterialProduct) {
        totalPrice += product.getPrice(this.distance, this.matPrice);
      }else {
        totalPrice += product.getPrice(this.distance, 0)
      }
    });

    return totalPrice;
  }
}
