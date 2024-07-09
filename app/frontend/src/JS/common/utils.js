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

export const checkAccess = (accountLogInType, navigate, currentView) => {
  const numericAccountType = Number(accountLogInType);

  // if your accLogInType is 1 or 2 = dept view only and trying to access Instructor? deny access
  if ((numericAccountType === 1 || numericAccountType === 2) && currentView === 'instructor') {
      alert('No Access, Redirecting to department view');
      navigate('/DeptDashboard');
  // if your accLogInType is 3 = instructor view only and trying to access department? deny access
  } else if (numericAccountType === 3 && currentView === 'department') {
      alert('No Access, Redirecting to instructor view');
      navigate('/InsDashboard');
  }
}
