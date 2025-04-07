export interface RegisterInvoice {
  name: string;
  nit?: string;
  email?: string;
  emails?: string[];
  // phone?: string;
  document?: string;
  phones: number[];
  type: string;
  plaque: string;
  digit_check?: string;
}
