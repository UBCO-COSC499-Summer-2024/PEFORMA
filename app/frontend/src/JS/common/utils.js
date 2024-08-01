import axios from 'axios';

// fill items into array to for table format
export const fillEmptyItems = (items, perPage) => { // fill up to 10's digit number of empty items
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

// handles page click event for pagination and update current page
export const handlePageClick = (data, setStateFunction) => {
  setStateFunction((prevState) => ({
      ...prevState,
      currentPage: data.selected + 1,
  }));
};

// calculates total number of pages for pagination
export const pageCount = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};

// get item for the current page based on the pagination
export const currentItems = (items, currentPage, itemsPerPage) => {
  return items.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );
};

// resets current page to 1 when search changes
export const handleSearchChange = (setStateFunction) => {
  setStateFunction(prevState => ({ ...prevState, currentPage: 1 }));
};

// check user access based on accountLogInType and accessView
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

// maps division code to divisio name
export const getDivisionName = (division) => {
  const divisionNames = {
    'computer-science': 'Computer Science',
    'mathematics': 'Mathematics',
    'physics': 'Physics',
    'statistics': 'Statistics',
  };
  return divisionNames[division] || '';
};

// handles unauthroized error by redirecting to login page
export const handleUnauthorizedError = (error, navigate) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('authToken');
    navigate('/Login');
  } else {
    console.error('Error:', error);
  }
};

// fetchs data with auth and handles error
export const fetchWithAuth = async (url, authToken, navigate, params = null) => {
  const config = {
    headers: { Authorization: `Bearer ${authToken.token}` },
  };
  if (params) { // if params given set parms
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

// resets form to initial form state
export const handleCancelForm = (setFormData, initialFormData) => {
  setFormData(initialFormData);
};

// filter items based on item type and search
export const filterItems = (items, itemType, search) => {
  if (itemType === 'member') { // if type is member, filtering based on the logic
    return items.filter((item) =>
      (item.ubcid?.toString().toLowerCase().includes(search.toLowerCase()) || false) ||
      (item.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (Array.isArray(item.serviceRole)
        ? item.serviceRole.some(role => role?.toLowerCase().includes(search.toLowerCase()))
        : (item.serviceRole?.toLowerCase().includes(search.toLowerCase()) || false))
    );
  } else if (itemType === 'course') { // if type is course, filtering based on the logic
    return items.filter((item) =>
      (item.courseCode?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (item.title?.toLowerCase() ?? '').includes(search.toLowerCase())
    );
  } else if (itemType === 'role') { // if type is role, filtering based on the logic
    return items.filter((item)=>
      (item.name?.toString().toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (item.department?.toString().toLowerCase() ?? "").includes(search.toLowerCase())
    );
  } else if (itemType === 'insCourse') { // if type is insCourse, filtering based on the logic
    return items.filter((course) =>
      (course.id?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (course.title?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (course.instructor &&
       Array.isArray(course.instructor) &&
       course.instructor.some(instructor =>
         instructor.toLowerCase().includes(search.toLowerCase())
       ))
    );
  } else if (itemType === 'taCourse') { // // if type is taCourse, filtering based on the logic
    return items.filter((item)=>
      (item.instructor?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (item.courseCode?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (item.courseName?.toLowerCase() ?? '').includes(search.toLowerCase())
    );
  } else {
    return items;
  }
};

// sort items based on the sort configuration
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

// set sort cinfiguration for the given key
export const requestSort = (sortConfig, setSortConfig, key) => {
  let direction = 'ascending';
  if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
  }
  setSortConfig({ key, direction });
};

// converts a term code to a readable string
export const getTermString = (term) => { // for example, 20244 is delivered in parameter
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

// filter courses based on the year level identifier and prefix
export const filterYearLevelCourses = (courses, identifier, prefix) => {
  if (identifier === 'All') {
      return courses;
  } else {
      return courses.filter((course) =>
          course.courseCode.startsWith(`${prefix} ${identifier[0]}`)
      );
  }
};

// gets the current month's name
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

// toggles the status of an item and update the item status
export const toggleStatus = async (authToken, item, newStatus, itemList, setItemList, endpoint) => {
  const updatedItem = { ...item, status: newStatus };
  const updatedItems = itemList.map((i) => (endpoint.includes('Member') ? item.ubcid === i.ubcid : item.id === i.id) ? updatedItem : i);

  let itemIdKey;
  let listKey;
  let itemIdValue;

  switch (true) { // set idKey, listKey, idValue in different cases
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

  try { // post status with idKey
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

// filter courses by division using divisionMap. COSC 101 -> COSC
export const filterByDivision = (courses, division, divisionMap) => {
  const divisionPrefix = divisionMap[division];
  return courses.filter(course => course.courseCode && course.courseCode.startsWith(divisionPrefix));
};

// download a csv file
export const downloadCSV = (csvContent, filename) => { 
  // generates a blob for csvContent
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); 
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// submits form data to server and handles the response
export const submitFormData = async (url, postData, authToken, initialFormData, setFormData, successMessage, errorMessageHandler) => {
  try {
      await axios.post(url, postData, {
          headers: { Authorization: `Bearer ${authToken.token}` },
      });
      alert(successMessage);
      setFormData(initialFormData);
  } catch (error) {
      console.error('Error sending data to the server:', error);
      if (typeof errorMessageHandler === "function") {
          errorMessageHandler(error);
      } else {
          console.error('An error occurred, but no error handler is provided:', error);
          alert('An unexpected error occurred.');
      }
  }
};
