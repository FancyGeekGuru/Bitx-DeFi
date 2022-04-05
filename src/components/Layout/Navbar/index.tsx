import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import { ReactComponent as ElrondLogo } from './../../../assets/img/elrond.svg';
import logo from '../../../assets/img/bitx-logo.jpg';
import lightVector from '../../../assets/img/lightVector.png';
import './index.scss';

const Navbar = () => {
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  const isLoggedIn = Boolean(address);

  return (
    // <div className='navbar'>
    //   <div className='logoDiv'>
    //     <img src={logo} />
    //     <p>BitX Finance</p>
    //   </div>
    //   <button className='connectButton'>
    //     <img src={lightVector} />
    //     <p>Connect</p>
    //   </button>
    // </div>
    <BsNavbar className='bg-white border-bottom px-4 py-3' expand='sm' collapseOnSelect>
      <div className='container-fluid'>
        <Link
          className='d-flex align-items-center navbar-brand mr-0 c-logo-container'
          to={routeNames.staking}
        >
          <img src={logo} />
          <span className=''>{dAppName}</span>
        </Link>

        <BsNavbar.Toggle aria-controls='responsive-navbar-nav' />
        <BsNavbar.Collapse id='responsive-navbar-nav' className='nav-menu-wrap'>
          <Nav className='ml-auto'>
            {isLoggedIn ? (
              <NavItem className='auth-button' onClick={handleLogout}>
                Disconnect
              </NavItem>
            ) : (
              <Link to={ routeNames.unlock } className='auth-button'>
                Connect
              </Link>
              // <NavItem>
              //   <button className='btn btn-link' onClick={handleLogout}>
              //     Close
              //   </button>
              // </NavItem>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
