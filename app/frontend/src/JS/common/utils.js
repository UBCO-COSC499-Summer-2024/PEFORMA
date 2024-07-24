import axios from 'axios';

export const fillEmptyItems = (items, perPage) => {
  const filledItems = [...items];
  const currentCount = items.length;
  const fillCount = perPage - (currentCount % perPage);
  if (fillCount < perPage) {
      for (let i = 0; i < fillCount; i++) {
          filledItems.push({});
      }
  }
  return filledItems;
};

export const handlePageClick = (data, setStateFunction) => {
  setStateFunction((prevState) => ({
      ...prevState,
      currentPage: data.selected + 1,
  }));
};

export const pageCount = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};

export const currentItems = (items, currentPage, itemsPerPage) => {
  return items.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );
};

export const handleSearchChange = (setStateFunction) => {
  setStateFunction(prevState => ({ ...prevState, currentPage: 1 }));
};

export const checkAccess = (accountLogInType, navigate, accessView, authToken) => {
  // if (!authToken) {
  //   alert('No Access, Redirecting to login');
  //   navigate('/Login');
  //   return;
  // }

  const numericAccountType = Number(accountLogInType);

  // if your accLogInType is 1 or 2 = dept view only and trying to access Instructor? deny access
  if ((numericAccountType === 1 || numericAccountType === 2) && (accessView === 'instructor' || accessView === 'admin')) {
    alert('No Access, Redirecting to department view');
    navigate('/DeptDashboard');
  // if your accLogInType is 3 = instructor view only and trying to access department? deny access
  } else if ((numericAccountType === 3) && (accessView === 'department' || accessView === 'admin')) {
    alert('No Access, Redirecting to instructor view');
    navigate('/InsDashboard');
  } else if ((numericAccountType === 4) && (accessView === 'department' || accessView === 'instructor')) {
    alert('No Access, Redirecting to admin view');
    navigate('/AdminDashboard');
  }
};

export const getDivisionName = (division) => {
  const divisionNames = {
    'computer-science': 'Computer Science',
    'mathematics': 'Mathematics',
    'physics': 'Physics',
    'statistics': 'Statistics',
  };
  return divisionNames[division] || '';
};

//////////////////  testing refactoring with useEffect ///////////////////////////
export const handleUnauthorizedError = (error, navigate) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('authToken');
    navigate('/Login');
  } else {
    console.error('Error:', error);
  }
};

export const fetchWithAuth = async (url, authToken, navigate) => {
  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${authToken.token}` },
    });
    return res.data;
  } catch (error) {
    handleUnauthorizedError(error, navigate);
    throw error; 
  }
};

export const getCurrentInstructor = (historyData) => {
  let history = historyData.history;
  let currentInstructor = [];
  console.log(history);
  if (history[0].instructorID !== "") {
  for (let i = 0; i < history.length; i++) {

    let term = "1";
    if (history[i].session.slice(4,5) === "S") {
      if (history[i].term === "1") {
        term = "3";
      } else {
        term = "4";
      }
    } else {
      if (history[i].term === "1") {
        term = "1";
      } else {
        term = "2";
      }
    }

    if (parseInt(history[i].session.slice(0,4)+term) === historyData.latestTerm) {
      currentInstructor.push(history[i]);
    }
  }
}
  return currentInstructor;
}

export function filterItems(items, itemType, search) {
  if (itemType === 'member') {
    return items.filter((item) =>
      (item.ubcid?.toString().toLowerCase().includes(search.toLowerCase()) || false) ||
      (item.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (Array.isArray(item.serviceRole)
        ? item.serviceRole.some(role => role?.toLowerCase().includes(search.toLowerCase()))
        : (item.serviceRole?.toLowerCase().includes(search.toLowerCase()) || false))
    );
  } else if (itemType === 'course') {
    return items.filter((item) =>
      (item.courseCode?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (item.title?.toLowerCase() ?? '').includes(search.toLowerCase())
    );
  } else {
    return items;
  }
}