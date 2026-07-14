export interface dataphonePlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  startSell(options: { value: string }): Promise<{ value: string }>;
  
}
