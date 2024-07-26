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

export const fetchWithAuth = async (url, authToken, navigate, params = null) => {
  const config = {
    headers: { Authorization: `Bearer ${authToken.token}` },
  };
  if (params) {
    config.params = params;
  }
  try {
    const res = await axios.get(url, config);
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

export const filterItems = (items, itemType, search) => {
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
  } else if (itemType === 'insCourse') {
    return items.filter((course) =>
      (course.id?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (course.title?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (course.instructor &&
       Array.isArray(course.instructor) &&
       course.instructor.some(instructor =>
         instructor.toLowerCase().includes(search.toLowerCase())
       ))
    );
  } else {
    return items;
  }
};

export const sortItems = (items, sortConfig) => {
  let sortableItems = [...items];
  if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
              return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
              return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
      });
  }
  return sortableItems;
};

export const requestSort = (sortConfig, setSortConfig, key) => {
  let direction = 'ascending';
  if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
  }
  setSortConfig({ key, direction });
};

export const getTermString = (term) => {
  const termStr = term.toString();
  const year = termStr.slice(0, -1);
  const termCode = termStr.slice(-1);

  const termMap = {
      1: 'Winter Term 1',
      2: 'Winter Term 2',
      3: 'Summer Term 1',
      4: 'Summer Term 2',
  };

  return `${year} ${termMap[termCode] || ''}`;
};

export const filterYearLevelCourses = (courses, identifier, prefix) => {
  if (identifier === 'All') {
      return courses;
  } else {
      return courses.filter((course) =>
          course.courseCode.startsWith(`${prefix} ${identifier[0]}`)
      );
  }
};

export const getCurrentMonthName = () => {
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	return monthNames[new Date().getMonth()];
};

export const toggleStatus = async (authToken, item, newStatus, itemList, setItemList, endpoint) => {
  const updatedItem = { ...item, status: newStatus };
  const updatedItems = itemList.map((i) => (endpoint.includes('Member') ? item.ubcid === i.ubcid : item.id === i.id) ? updatedItem : i);

  let itemIdKey;
  let listKey;
  let itemIdValue;

  switch (true) {
    case endpoint.includes('Course'):
      itemIdKey = 'courseid';
      listKey = 'courses';
      itemIdValue = item.id;
      break;
    case endpoint.includes('Member'):
      itemIdKey = 'memberId';
      listKey = 'members';
      itemIdValue = item.ubcid;
      break;
    case endpoint.includes('Role'):
      itemIdKey = 'roleId';
      listKey = 'roles';
      itemIdValue = item.id;
      break;
    default:
      throw new Error('Unknown endpoint type');
  }

  try {
    const response = await axios.post(
      `http://localhost:3001/api/${endpoint}`,
      {
        [itemIdKey]: itemIdValue,
        newStatus: newStatus,
      },
      {
        headers: { Authorization: `Bearer ${authToken.token}` },
      }
    );
    if (response.status === 200) {
      setItemList((prevState) => {
        const filledItems = fillEmptyItems(updatedItems, prevState.perPage);
        return {
          ...prevState,
          [listKey]: filledItems,
        };
      });
    } else {
      console.error('Error updating item status:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating item status:', error);
  }
};
