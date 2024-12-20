import React, { useCallback, useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";
const ITEMS_PER_PAGE = 5;

const App = () => {
  const [projects, setProjects] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageButtonsToShow = 10;
  const [pageButtonsRange, setPageButtonsRange] = useState({
    start: 1,
    end: pageButtonsToShow,
  });
  const [currentItems, setCurrentItems] = useState([]);

  // const fetchProjects = (startIndex, endIndex) => {
  //   let xhr = new XMLHttpRequest();

  //   xhr.open("GET", `${API_URL}?start=${startIndex}&end=${endIndex}`, true);

  //   xhr.onreadystatechange = function () {
  //     if (this.readyState === 4 && this.status === 200) {
  //       setProjects(JSON.parse(this.responseText));
  //     }
  //   };
  //   xhr.send();
  // };

  const fetchProjects = useCallback(async (startIndex, endIndex) => {
    let url = `${API_URL}?start=${startIndex}&end=${endIndex}`;

    fetch(url, { method: "GET" })
      .then((result) => result.json())
      .then((data) => {
        // console.log(data);

        // setProjects((prevData) => [...prevData, ...data]);
        setProjects(data);
      })
      .catch((errorMsg) => {
        console.error("Failed to fetch projects:", errorMsg);
      });
  }, []);

  useEffect(() => {
    currentPage >= numberOfPages && fetchProjects(currentPage, setProjects);
  }, [currentPage, fetchProjects, numberOfPages]);

  useEffect(() => {
    if (numberOfPages <= pageButtonsToShow) {
      setPageButtonsRange({
        start: 1,
        end: numberOfPages,
      });
    } else {
      const maxStartIndex = numberOfPages - pageButtonsToShow + 1;
      const minStartIndex = 1;
      const start = Math.max(
        Math.min(
          currentPage - Math.floor(pageButtonsToShow / 2),
          maxStartIndex
        ),
        minStartIndex
      );
      const end = start + pageButtonsToShow - 1;
      setPageButtonsRange({
        start,
        end: end > numberOfPages ? numberOfPages : end,
      });
    }
  }, [currentPage, numberOfPages]);

  useEffect(() => {
    setNumberOfPages(Math.ceil(projects?.length / ITEMS_PER_PAGE));
  }, [projects]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  useEffect(() => {
    let indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    let indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    setCurrentItems(projects?.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, projects]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-start p-12`}
    >
      <div className="flex flex-col justify-between items-center">
        {" "}
        <h2 className="text-4xl text-bold">Kickstarter projects</h2>
        <table className="w-full mt-6 mb-6 min-h-300px">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Percentage Funded</th>
              <th>Amount Pledged</th>
            </tr>
          </thead>
          <tbody className="align-top">
            {currentItems.map((projectDetails, index) => {
              return (
                <tr key={index}>
                  <td>{projectDetails["s.no"]}</td>
                  <td>{projectDetails["percentage.funded"]}</td>
                  <td>{projectDetails["amt.pledged"]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center w-full">
        <button
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          className={`mx-1 px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed text-black"
              : "bg-blue-500 hover:bg-blue-700 text-black"
          }`}
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {Array.from(
            { length: pageButtonsRange.end - pageButtonsRange.start + 1 },
            (_, i) => (
              <button
                key={i + pageButtonsRange.start}
                onClick={() => setCurrentPage(i + pageButtonsRange.start)}
                className={`min-w-48px px-4 py-2 rounded ${
                  currentPage === i + pageButtonsRange.start
                    ? "bg-blue-500 text-black"
                    : "bg-blue-300 hover:bg-blue-400 text-black"
                }`}
              >
                {i + pageButtonsRange.start}
              </button>
            )
          )}
        </div>
        <button
          disabled={currentPage === numberOfPages}
          onClick={handleNextPage}
          className={`mx-1 px-4 py-2 rounded ${
            currentPage === numberOfPages
              ? "bg-gray-300 cursor-not-allowed text-black opacity-50"
              : "bg-blue-500 hover:bg-blue-700 text-black"
          }`}
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default App;
