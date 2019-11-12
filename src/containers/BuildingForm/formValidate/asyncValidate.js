import axios from "axios";

const asyncValidate = (values) => {
  return axios.get("/api/buildings").then(res => {
    const buildingsArray = res.data.map(b => b.name);
    if (buildingsArray.includes(values.buildingName)) {
      const err = { buildingName: "That building name is taken" };
      throw err;
    }
  });
};

export default asyncValidate;
