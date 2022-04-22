import React from 'react';
import { logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { Navbar as BsNavbar, NavItem, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { dAppName } from 'config';
import { routeNames } from 'routes';
import logo from '../../../assets/img/BTX.png';
import './index.scss';

const Navbar = () => {
  const { address } = useGetAccountInfo();

  const handleLogout = () => {
    logout(`${window.location.origin}/unlock`);
  };

  const isLoggedIn = Boolean(address);

  return (
    <BsNavbar className='px-4 py-3' expand='md' collapseOnSelect style={{ background: "#141414", borderBottom: "1px solid #707070" }}>
      <div className='container-fluid'>
        <Link
          className='d-flex align-items-center navbar-brand mr-0 c-logo-container'
          to={routeNames.staking}
        >
          <img src={logo} />
          <span>{"BitX Finance"}</span>
        </Link>

        <BsNavbar.Toggle aria-controls='responsive-navbar-nav' style={{ background: "#D8D3D3" }} />
        <BsNavbar.Collapse id='responsive-navbar-nav' className='nav-menu-wrap'>
          <Nav className='ml-auto'>
            {/* <Link to={routeNames.staking} className='custom-navbar-button custom-navbar-normal-button '>
              BTX Pool
            </Link>
            <Link to={routeNames.dicestaking} className='custom-navbar-button custom-navbar-normal-button'>
              DICE Pool
            </Link> */}

            <NavDropdown
              id="nav-dropdown-dark-example"
              title="Staking"
              className='custom-navbar-button custom-navbar-normal-button '
            >
              <NavDropdown.Item>
                <Link to={routeNames.staking}>
                  Home
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to={routeNames.bitxstaking}>
                  BTX Pool
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Link to={routeNames.dicestaking}>
                  Dice Pool
                </Link>
              </NavDropdown.Item>
            </NavDropdown>

            <Link to={routeNames.presale} className='custom-navbar-button custom-navbar-normal-button'>
              Presale
            </Link>

            <Link to={routeNames.nftmint} className='custom-navbar-button custom-navbar-normal-button'>
              NFT Mint
            </Link>

            {isLoggedIn ? (
              <NavItem className='custom-navbar-button auth-button' onClick={handleLogout}>
                Disconnect
              </NavItem>
            ) : (
              <Link to={routeNames.unlock} className='custom-navbar-button auth-button'>
                Connect Wallet
              </Link>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
