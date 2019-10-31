import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
// import store from "@/store/store.js";

let userUrl = RestApi.api.sbUrl;

export function getAccout(params) {
  let { getAccoutUrl: url } = userUrl;
  return axios({
    method: "get",
    url,
    params
  });
}
