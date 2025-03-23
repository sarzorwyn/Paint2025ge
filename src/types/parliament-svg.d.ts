declare module 'parliament-svg' {
  function generate(parliament: { [key: string]: { seats: number; colour: string } }, options?: boolean): RootContent[] | Nodes;

  export default generate;
  }