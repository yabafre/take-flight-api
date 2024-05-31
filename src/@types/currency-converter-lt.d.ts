declare module 'currency-converter-lt' {
  interface ConversionOptions {
    from: string;
    to: string;
    amount?: number;
  }

  export default class CurrencyConverter {
    constructor(options?: ConversionOptions);

    convert() {}
  }
}
