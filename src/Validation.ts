// export class Validation {

//   static isDateInFuture(dateString: string): boolean {
//     const inputDate = new Date(dateString);

//     const currentDate = new Date();

//     currentDate.setHours(0, 0, 0, 0);

//     return inputDate > currentDate;
//   }

//   static showSuccees = (fils: HTMLElement) => {
//     const parent = fils.parentNode as HTMLElement;
//     parent.className = "content";
//   };

//   static showSuccees2 = (fils: HTMLElement) => {
//     const parent = fils.parentNode as HTMLElement;
//     // parent.classList.add("content");
//     parent.classList.remove("error");
//   };

//   static getInputName = (input: HTMLInputElement) =>
//     input.id.charAt(0).toUpperCase() + input.id.slice(1);

//   static showError = (fils: HTMLElement, msg:string) => {
//     const parent = fils.parentNode as HTMLElement;
//     parent.className = "content error";
//     const span = parent.querySelector("span") as HTMLSpanElement;
//       span.innerText = msg;
//   };

//   static showError2 = (fils: HTMLElement, msg:string) => {
//     const parent = fils.parentNode as HTMLElement;
//     parent.classList.add("error");
//     const span = parent.querySelector("span") as HTMLSpanElement;
//     span.innerText = msg;
//   };

//   static checkRequireGlobal = (inputArray: NodeListOf<HTMLInputElement>) => {
//     let valid = true;
//     inputArray.forEach((input) => {
//       const parent = input.parentNode as HTMLElement;
//       if (input.value.trim() === "") {
//         valid = false;
//         parent.className = "content error";
//         Validation.showError(input, `${Validation.getInputName(input)} est requis`);
//       } else {
//         Validation.showSuccees(input);
//       }
//     });
//     return valid;
//   };

//   static checkRequireGlobal2 = (inputArray: NodeListOf<HTMLInputElement>) => {
//     let valid = true;
//     inputArray.forEach((input) => {
//       const parent = input.parentNode as HTMLElement;
//       if (input.value.trim() === "") {
//         valid = false;
//         parent.classList.add("error");
//         Validation.showError2(input, `${Validation.getInputName(input)} est requis`);
//       } else {
//         Validation.showSuccees2(input);
    
//       }
//     });
//     return valid;
//   };

//   static checkRequireGlobal3 = (inputArray: NodeListOf<HTMLInputElement>) => {
//     let valid = true;
//     inputArray.forEach((input) => {
//       const parent = input.parentNode as HTMLElement;
//       if (input.value.trim() === "") {
//         valid = false;
//         parent.classList.add("error");
//         Validation.showError2(input, `${Validation.getInputName(input)} est requis`);
//       } else {
//           Validation.showSuccees2(input);
//       }
//     });
//     valid = Validation.checkRequireGlobal3Supp1(inputArray);
//     return valid;
//   };

//   static checkRequireLogin = (inputArray: NodeListOf<HTMLInputElement>) => {
//     let valid = true;
//     inputArray.forEach((input) => {
//       const parent = input.parentNode as HTMLElement;
//       if (input.value.trim() === "") {
//         valid = false;
//         parent.classList.add("error");
//         Validation.showError2(input, `${Validation.getInputName(input)} est requis`);
//       } else {
//         Validation.showSuccees2(input);
//       }
//     });
//     valid = Validation.checkRequireLoginSupp(inputArray);
//     return valid;
//   };

//   static checkRequireLoginSupp = (inputArray: NodeListOf<HTMLInputElement>) => {
//     let valid = true;
//     inputArray.forEach((input) => {
//       const parent = input.parentNode as HTMLElement;
//       if(input.name == 'email'){
//         valid = Validation.email(input)
//       }
//     });
//     return valid;
//   };

//   static validerDateAddCargo = (input: HTMLInputElement) => {
//     let valid = true;
//     const parent = input.parentNode as HTMLElement;
//      if (!Validation.isDateInFuture(input.value)) {
//         valid = false;
//         parent.classList.add("error");
//         Validation.showError2(input, `${Validation.getInputName(input)} doit être dans le futur`);
//       } else {
//        Validation.showSuccees2(input);
//      }
//     return valid;
//   };

//   static validerProduitMax = (input: HTMLInputElement) => {
//     let valid = true;
//       const parent = input.parentNode as HTMLElement;
//       if (input.value.trim() === "" || parseInt(input.value.trim()) < 0 || parseInt(input.value.trim()) >  10 ) {
//         valid = false;
//         parent.classList.add("error");
//         Validation.showError2(input, `${Validation.getInputName(input)} de 1 à 10`);
//       } else {
//         Validation.showSuccees2(input);
//       }
//     return valid;
//   };

//   static validerEntier = (input: HTMLInputElement) => {
//     let valid = true;
//     const parent = input.parentNode as HTMLElement;
//     console.log(parseInt(input.value.trim()) < 0)
//     if (parseInt(input.value.trim()) < 0) {
//       valid = false;
//       parent.classList.add("error");
//       Validation.showError2(input, `${Validation.getInputName(input)} doit être positif`);
//     } else {
//       Validation.showSuccees2(input);
//     }
//     return valid;
//   };

//   static checkRequireGlobal3Supp1 = (inputArray: NodeListOf<HTMLInputElement>) => {
//     let valid = true;
//     inputArray.forEach((input) => {
//       const parent = input.parentNode as HTMLElement;
//       if (input.name == 'telExpediteur' || input.name == 'telRecepteur') {
//         valid = Validation.telephone(input)
//       } else if (input.name == 'prenomExpediteur' || input.name == 'prenomRecepteur'
//           || input.name == 'nomExpediteur' || input.name == 'nomRecepteur' || input.id == 'libelle'
//       || input.name == 'villeExpediteur' || input.name == 'paysExpediteur' ||
//       input.name == 'villeRecepteur' || input.name == 'paysRecepteur') {
//         valid = Validation.chaine(input)
//       }else if(input.id == 'poids'){
//         valid = Validation.entier(input)
//       }else if(input.id == 'toxicite'){
//         valid = Validation.toxicite(input)
//       }else if(input.name == 'emailRecepteur' || input.name == 'emailExpediteur'){
//         valid = Validation.email(input)
//       }
//     });
//     return valid;
//   };

//   static telephoneRegex(input: string): boolean{
//     const regex = /^(77|76|78|70)\d{7}$/;
//     return regex.test(input);
//   }

//   static telephone(input: HTMLInputElement): boolean {
//     let valid = true;
//     const parent = input.parentNode as HTMLElement;
//     if (!Validation.telephoneRegex(input.value)) {
//       valid = false;
//       parent.classList.add("error");
//       Validation.showError2(input, `${Validation.getInputName(input)} pas correct`);
//     } else {
//       Validation.showSuccees2(input);
//     }
//     return valid;
//   }

//   static chaineRegex(input: string): boolean{
//     const regex = /^[a-zA-Z0-9 ]+$/;
//     return regex.test(input);
//   }

//   static chaine(input: HTMLInputElement): boolean {
//     let valid = true;
//     const parent = input.parentNode as HTMLElement;
//     if (!Validation.chaineRegex(input.value)) {
//       valid = false;
//       parent.classList.add("error");
//       Validation.showError2(input, `${Validation.getInputName(input)} pas correct`);
//     } else {
//       Validation.showSuccees2(input);
//     }
//     return valid;
//   }

//   static entierRegex(input: string): boolean{
//     const regex = /^[0-9]+$/;
//     return regex.test(input);
//   }
//   static entier(input: HTMLInputElement): boolean {
//     let valid = true;
//     const parent = input.parentNode as HTMLElement;
//     if (!Validation.entierRegex(input.value)) {
//       valid = false;
//       parent.classList.add("error");
//       Validation.showError2(input, `${Validation.getInputName(input)} pas correct`);
//     } else {
//       Validation.showSuccees2(input);
//     }
//     return valid;
//   }

//   static toxiciteRegex(input: string): boolean{
//     const regex = /^(10|[0-9])$/;
//     return regex.test(input);
//   }

//   static toxicite(input: HTMLInputElement): boolean {
//     let valid = true;
//     const parent = input.parentNode as HTMLElement;
//     if (!Validation.toxiciteRegex(input.value)) {
//       valid = false;
//       parent.classList.add("error");
//       Validation.showError2(input, `${Validation.getInputName(input)} pas correct`);
//     } else {
//       Validation.showSuccees2(input);
//     }
//     return valid;
//   }

//   static emailRegex(input: string):boolean{
//     const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return regex.test(input);
//   }

//   static email(input: HTMLInputElement): boolean {
//     let valid = true;
//     const parent = input.parentNode as HTMLElement;
//     if (!Validation.emailRegex(input.value)) {
//       valid = false;
//       parent.classList.add("error");
//       Validation.showError2(input, `${Validation.getInputName(input)} pas correct`);
//     } else {
//       Validation.showSuccees2(input);
//     }
//     return valid;
//   }

//   // static passwordRegex(input: string):boolean{
//   //   const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   //   return regex.test(input);
//   // }
//   //
//   // static password(input: HTMLInputElement): boolean {
//   //   let valid = true;
//   //   const parent = input.parentNode as HTMLElement;
//   //   if (!Validation.passwordRegex(input.value)) {
//   //     valid = false;
//   //     parent.classList.add("error");
//   //     Validation.showError2(input, `${Validation.getInputName(input)} pas correct`);
//   //   } else {
//   //     Validation.showSuccees2(input);
//   //   }
//   //   return valid;
//   // }

// }