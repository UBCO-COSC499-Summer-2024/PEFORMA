import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import CreateSideBar from '../common/commonImports.js';
import { CreateTopBar } from '../common/commonImports.js';
import '../common/divisions.js';
import '../common/AuthContext.js';
import { useAuth } from '../common/AuthContext.js';

function DeptStatusChangeServiceRole(){
  // const res = await axios.get(`http://localhost:3000/serviceRoles.json`);
  return (
    <div>Hlelleo</div>
  )
}

export default DeptStatusChangeServiceRole;