import React from 'react';

import classes from './SideDrawer.module.css';
import EarthLogo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';

const SideDrawer = props => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return (
        <React.Fragment>
            <Backdrop show={props.open} clicked={props.backdropClicked} />
            <div className={attachedClasses.join(' ')} onClick={props.backdropClicked}>
                <div className={classes.Logo}>
                    <EarthLogo />
                </div>
                <nav>
                    <NavigationItems isAuthenticated={props.isAuth} />
                </nav>
            </div>
        </React.Fragment>
    );
};

export default SideDrawer;