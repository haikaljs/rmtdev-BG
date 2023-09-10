import {
  BASE_API_URL,
  searchInputEl,
  searchFormEl,
  jobListSearchEl,
  numberEl,
} from "../common.js";

import renderSpinner from "./Spinner.js";

import renderError from "./Error.js";
import renderJobList from "./JobList.js";

const submitHandler = (event) => {
  //prevent default behaviour
  event.preventDefault();

  // get search text
  const searchText = searchInputEl.value;

  // validation (regex example)
  const forbiddenPattern = /[0-9]/;
  const patternMatch = forbiddenPattern.test(searchText);
  if (patternMatch) {
    renderError("Your search cannot contain numbers!");
    return;
  }

  searchInputEl.blur();
  // remove previous job items
  jobListSearchEl.innerHTML = "";

  // render spinner

  renderSpinner("search");

  // fetch search results
  fetch(`${BASE_API_URL}/jobs?search=${searchText}`)
    .then((response) => {
      if (!response.ok) {
        console.log("Something went wrong!");
        return;
      }
      return response.json();
    })
    .then((data) => {
      //   extract job items
      const { jobItems } = data;

      // remove spinner
      renderSpinner("search");
      //render number of results
      numberEl.textContent = jobItems.length;
      renderJobList(jobItems);
    })
    .catch((error) => {
      console.log(error);
    });
};
searchFormEl.addEventListener("submit", submitHandler);
