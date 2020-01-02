import axios from "axios";

// export default () => {
//   return axios.create({
//     baseURL: `http://localhost:3000`
//   });
// };
// export default() => {
//   return axios.create({
//     baseURL: `https://flyx-server.herokuapp.com/`
//   })
// }

let _api;

function initServerAPI() {
  try {
    _api = axios.create({
      baseURL: `http://localhost:3000`
    });
    console.log("Connected successfully to server");
  } catch (error) {
    throw new Error(error);
  }
}

function API() {
  if (_api) {
    return _api;
  } else {
    throw new Error("API Instance not created");
  }
}

async function verifyNewUser(idToken) {
  try {
    const response = await _api.post(
      "/user/verify",
      {},
      {
        headers: {
          Authorization: idToken
        }
      }
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

async function searchFlights(idToken, searchData) {
  try {
    const response = await _api.post("/search", searchData, {
      headers: {
        Authorization: idToken
      }
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

async function autocomplete (q) {
  try {
    const response = await _api.get("/autocomplete?q=" + q);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

async function priceTicker (from) {
  try {
    const response = await _api.get("/priceticker?airportFrom=" + from);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export { 
  initServerAPI, 
  API, 
  verifyNewUser, 
  searchFlights, 
  autocomplete,
  priceTicker 
};
