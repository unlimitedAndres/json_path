export interface Root {
    /**
     * The size of the shape.
     *
     * @minimum 0
     * @TJS-type ["integer", "string"]
     *
     * */
    userId: number | string;
    id: number;
    title: string;
    completed: boolean;
    node: string | boolean | Node;
    myarray: string | string[] | boolean[];
  }

  export interface Node {
    /**
     * The size of the shape.
     *
     * @minimum 0
     * @TJS-type ["integer", "string"]
     *
     * */
    userId2: number | string;
    id2: number;
    title2: string;
    completed2: boolean;
  }

