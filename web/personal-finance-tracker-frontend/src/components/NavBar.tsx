import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
	return (
		<div>
			<nav>
				<div className="nav-items container">
					<div className="logo">
						<a href="/">
							<h1>FINANCE APP</h1>
						</a>
					</div>
					<ul>
						<li>
							<NavLink to="/"
								className={({ isActive }) => {
									return isActive ? "active-link" : "";
								}}
							>Home</NavLink>
						</li>
						<li>
							<NavLink to="/about"
								className={({ isActive }) => {
									return isActive ? "active-link" : "";
								}}
							>About</NavLink>
						</li>
						<li>
							<NavLink to="/finance"
								className={({ isActive }) => {
									return isActive ? "active-link" : "";
								}}
							>Finance</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	);
};

export default NavBar;