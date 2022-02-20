export interface EdgeDataInterface {
  notification: {
    success: string[];
    error: string[];
  };
  form: {
    error: {
      data: { [key: string]: string };
    };
  };
}

export const generateEdgeDataStructure = function (): EdgeDataInterface {
  return {
    notification: {
      success: [],
      error: [],
    },
    form: {
      error: {
        data: {},
      },
    },
  };
};
