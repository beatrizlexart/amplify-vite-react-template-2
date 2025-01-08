// global.d.ts ou facebook-sdk.d.ts
declare global {
  interface Window {
    FB: any; // Declare `FB` como qualquer tipo
  }
}

export {}; // Necessário para tornar este arquivo um módulo TypeScript
