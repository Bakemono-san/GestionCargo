// import { sendMessage } from "./index.js";

export type CargoType = "Aerial" | "Maritime" | "Road";
export type State = "closed" | "open";
export type Status =
  | "loading"
  | "transporting"
  | "delivered"
  | "lost"
  | "archived"
  | "recupere"
  | "late";
export type fullIndicator = "weight" | "numberOfProduct";

export class User {
  constructor(
    public name: string,
    public surname: string,
    public phone: string,
    public address: string
  ) {}
}

export class Product {
  protected productStatus: Status = "loading";
  static minPrice: number = 10000;
  public price: number = 0;
  public endDate: string = "";

  constructor(
    protected id: number,
    protected name: string,
    protected weight: number,
    protected client: User,
    protected receiver: User,
    protected productType: string
  ) {}

  recupere() {
    this.productStatus = "recupere";
  }

  set setEndDate(date: string) {
    this.endDate = date;
  }

  get getEndDate() {
    return this.endDate;
  }

  get remainingDays() {
    return daysBetweenDates(this.endDate);
  }

  deliver() {
    if (this.remainingDays <= 0) {
      this.productStatus = "delivered";
      sendMessage(
        `votre colis est arrivee.info => nom: ${this.productName}  identifiant: ${this.ProductID} prix: ${this.price}`,
        this.clientNumber
      );
      sendMessage(
        `votre colis est arrivee  .info => nom: ${this.productName}  identifiant: ${this.ProductID} prix: ${this.price}`,
        this.receiverNumber
      );
    } else {
      this.productStatus = "late";
      sendMessage(
        `votre colis est arrivee en retard.info => nom: ${this.productName}  identifiant: ${this.ProductID} prix: ${this.price}`,
        this.clientNumber
      );
      sendMessage(
        `votre colis est arrivee en retard.info => nom: ${this.productName}  identifiant: ${this.ProductID} prix: ${this.price}`,
        this.receiverNumber
      );
    }
  }

  markLost() {
    this.productStatus = "lost";

    sendMessage(
      `votre colis a ete perdue.info => nom: ${this.productName}  identifiant: ${this.ProductID} prix: ${this.price}`,
      "+221" + this.clientNumber
    );
    sendMessage(
      `votre colis a ete perdue.info => nom: ${this.productName}  identifiant: ${this.ProductID} prix: ${this.price}`,
      "+221" + this.receiverNumber
    );
  }

  archive() {
    this.productStatus = "archived";
  }

  get getproductType() {
    return this.productType;
  }

  set productPrice(data: any) {
    if (data >= 10000) {
      this.price = data;
    } else {
      this.price = 10000;
    }
  }

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

  get receiverNumber(): string {
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

  getPrice() {
    return this.price;
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
}

class Breakable extends MaterialProduct {}

class Unbreakable extends MaterialProduct {}

export class FoodProduct extends Product {
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

  get dateArrivee() {
    return this.endingDate;
  }

  archive() {
    this.status = "archived";
  }

  get getId() {
    return this.id;
  }

  set product(data: Product[]) {
    this.products = data;
  }

  totalPrice() {
    let totalPrice = 0;
    for (let product of this.products) {
      totalPrice += product.getPrice();
    }
    return totalPrice;
  }

  addProduct(product: Product): string | undefined {
    if (this.globalState == "open") {
      if (this.full) return "Cargo is full";
      else if (this.fullIndicator == "numberOfProduct") {
        this.products.unshift(product);
        if (this.products.length >= this.maxWeight) {
          this.full = true;
        }
        return "product added successfully";
      } else {
        if (this.totalWeight >= this.maxWeight) {
          this.full = true;
          return "Cargo is full";
        } else {
          this.products.unshift(product);

          if (this.totalWeight >= this.maxWeight) {
            this.full = true;
          }
          return "product added successfully";
        }
      }
    } else {
      return "error this Cargo is closed";
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
    if (this.status == "loading") {
      if (this.products.length > 0) {
        this.status = "transporting";
        this.globalState = "closed";
        this.products.forEach((product) => {
          product.ProductStatus = "transporting";
        });
        return "started , cargo is now in transit";
      } else {
        return "can't start an empty cargo";
      }
    } else if (this.status == "transporting") {
      this.status = "delivered";
      this.products.forEach((product) => {
        if (daysBetweenDates(this.endingDate) <= 0) {
          product.ProductStatus = "delivered";
          sendMessage(
            "la cargaison contenant votre produit est arrivee veuillez venir le recuperer ",
            product.clientNumber
          );
          sendMessage(
            "la cargaison contenant votre produit est arrivee veuillez venir le recuperer",
            product.receiverNumber
          );
        } else {
          product.ProductStatus = "late";
          sendMessage(
            "la cargaison contenant votre produit est arrivee en retard veuillez venir le recuperer ",
            product.clientNumber
          );
          sendMessage(
            "la cargaison contenant votre produit est arrivee en retard veuillez venir le recuperer",
            product.receiverNumber
          );
        }
        this.products.forEach((product) => {
          product.ProductStatus = "delivered";
        });
        return "sending email...";
      });
    } else if (this.status == "delivered") {
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

  searchProduct(id: number): Product {
    return this.products.find((product) => {
      return product.ProductID == id && product;
    })!;
  }

  removeProduct(index: number) {
    if (this.cargoGlobalState == "open") this.products.splice(index, 1);
    return "product removed successfully";
  }

  getProduct(index: number): Product {
    return this.products[index];
  }

  markProductLost(index: number) {
    this.products[index].markLost();
    return "product marked as lost";
  }

  archiveProduct(index: number) {
    this.products[index].archive();
    return "product archived";
  }

  markLost(): void {
    this.status = "lost";
    this.cargoGlobalState = "closed";
    this.products.forEach((product) => {
      product.ProductStatus = "lost";
    });
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
    if (this.fullIndicator == "weight") {
      this.products.forEach((product) => {
        totalWeight += product.ProductWeight;
      });
    }else{
      totalWeight = this.products.length;
    }
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
  addProduct(product: Product): string | undefined {
    if (product instanceof FoodProduct) {
      product.price = this.foodPrice * this.distance;
    } else if (product instanceof MaterialProduct) {
      product.price = this.matPrice * this.distance;
    }

    if (product instanceof ChemicalProduct) {
      return "Chemical products are not allowed in road cargo";
    } else {
      console.log(product);
      
      if (this.globalState == "open") {
        if (this.full) return "Cargo is full";
        else if (this.fullIndicator == "numberOfProduct") {
          this.products.unshift(product);
          if (this.products.length >= this.maxWeight) {
            this.full = true;
          }
          return "cargo added successfully";
        } else {
          if (this.totalWeight >= this.maxWeight) {
            this.full = true;
            return "error this Cargo is full";
          } else {
            this.products.unshift(product);

            if (this.totalWeight >= this.maxWeight) {
              this.full = true;
            }
            return "cargo added successfully";
          }
        }
      } else {
        return "error this Cargo is closed";
      }
    }
  }

  totalPrice(): number {
    let totalPrice: number = 0;
    this.products.forEach((product) => {
      if (product instanceof FoodProduct) {
        totalPrice += product.productPrice;
      } else if (product instanceof MaterialProduct) {
        totalPrice += product.productPrice;
      } else {
        totalPrice += product.productPrice;
      }
    });

    return totalPrice;
  }
}

export class MaritimeCargo extends Cargo {
  protected foodPrice: number = 90;
  protected matPrice: number = 400;
  addProduct(product: Product): string | undefined {
    if (product instanceof FoodProduct) {
      product.price = this.foodPrice * this.distance;
    } else if (product instanceof MaterialProduct) {
      product.price = this.matPrice * this.distance;
    } else {
      product.price = 500 * this.distance + 15000;
    }

    console.log(product.productPrice, this.foodPrice * this.distance);

    if (product instanceof Breakable) {
      return "error Breakable products are not allowed in maritime cargo";
    } else {
      if (this.globalState == "open") {
        if (this.full) return "error this Cargo is full";
        else if (this.fullIndicator == "numberOfProduct") {
          this.products.unshift(product);
          if (this.products.length >= this.maxWeight) {
            this.full = true;
          }
          return "cargo added successfully";
        } else {
          if (this.totalWeight >= this.maxWeight) {
            this.full = true;
            return "error this Cargo is full";
          } else {
            this.products.unshift(product);

            if (this.totalWeight >= this.maxWeight) {
              this.full = true;
            }
            return "cargo added successfully";
          }
        }
      } else {
        return "error this Cargo is closed";
      }
    }
  }

  totalPrice(): number {
    let totalPrice: number = 0;
    this.products.forEach((product) => {
      totalPrice += product.productPrice;
    });

    return totalPrice;
  }
}

export class AerialCargo extends Cargo {
  protected foodPrice: number = 300;
  protected matPrice: number = 1000;
  addProduct(product: Product): string | undefined {
    if (product instanceof FoodProduct) {
      product.price = this.foodPrice * this.distance;
    } else if (product instanceof MaterialProduct) {
      product.price = this.matPrice * this.distance;
    }
    console.log(product, this.foodPrice * this.distance);

    if (product instanceof ChemicalProduct) {
      return "Chemical products are not allowed in road cargo";
    } else {
      if (this.globalState == "open") {
        if (this.full) return "Cargo is full";
        else if (this.fullIndicator == "numberOfProduct") {
          this.products.unshift(product);
          if (this.products.length >= this.maxWeight) {
            this.full = true;
          }
          return "cargo added successfully";
        } else {
          if (this.totalWeight >= this.maxWeight) {
            this.full = true;
            return "error Cargo is full";
          } else {
            this.products.unshift(product);

            if (this.totalWeight >= this.maxWeight) {
              this.full = true;
            }
            return "cargo added successfully";
          }
        }
      } else {
        return "error this Cargo is closed";
      }
    }
  }

  totalPrice(): number {
    let totalPrice: number = 0;
    this.products.forEach((product) => {
      console.log(product);

      totalPrice += product.productPrice;
    });

    return totalPrice;
  }
}

export function sendMessage(message: string, to: string) {
  const myHeaders: HeadersInit = new Headers();
  myHeaders.append(
    "Authorization",
    "App 853ade41efa2b52f62802f7c24c9adb5-85424141-bfb5-41a2-922d-8269e650ef73"
  );
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");

  const raw: string = JSON.stringify({
    messages: [
      {
        destinations: [{ to: to }],
        from: "ServiceSMS",
        text: message,
      },
    ],
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://ggm1rj.api.infobip.com/sms/2/text/advanced", requestOptions)
    .then((response: Response) => response.text())
    .then((result: string) => console.log(result))
    .catch((error: any) => console.error(error));
}

function daysBetweenDates(dateString: string): number {
  // Get the current date
  const currentDate = new Date();

  // Parse the input date string
  const inputDate = new Date(dateString);

  // Ensure the input date is valid
  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date format provided");
  }

  // Calculate the difference in time
  const timeDifference = Math.abs(currentDate.getTime() - inputDate.getTime());

  // Convert time difference from milliseconds to days
  const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return dayDifference;
}
