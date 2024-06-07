"use strict";
// import {Validation} from "./Validation.js";
// export class LoginFormHandle {
//     private formElement: HTMLFormElement;
//     constructor(formSelector: string) {
//         this.formElement = document.querySelector(formSelector) as HTMLFormElement;
//         if (!this.formElement) {
//             throw new Error('Form not found');
//         }
//     }
//     getFormData(): Record<string, any> {
//         const formData = new FormData(this.formElement);
//         const data: Record<string, any> = {};
//         formData.forEach((value, key) => {
//             data[key] = value;
//         });
//         return data;
//     }
//     resetForm(): void {
//         this.formElement.reset();
//     }
//     validateForm(): boolean {
//         let isValid = true;
//         const inputs = this.formElement.querySelectorAll('input,select') as NodeListOf<HTMLInputElement>;
//         return Validation.checkRequireLogin(inputs);
//     }
//     handleSubmit(callback: (data: Record<string, any>) => void): void {
//         this.formElement.addEventListener('submit', (event: Event) => {
//             event.preventDefault();
//             if (this.validateForm()) {
//                 const data = this.getFormData();
//                 callback(data);
//             }else {
//                 console.log("Error");
//             }
//         });
//     }
// }
