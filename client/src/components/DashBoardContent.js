import React from 'react'
import { withRouter } from 'react-router-dom';
import Car from './Car' 
import CarDetail from './CarDetail'
        
import Rentitem from './Rentitem' 
import RentitemDetail from './RentitemDetail'
        
import Rentlist from './Rentlist' 
import RentlistDetail from './RentlistDetail'

import CarList from './CarList'
import Customer from './Customer'
import User from './User'
        
//new-component

function DashBoardContent(props) {
    const linkPath = props.match.params.id

    switch (linkPath) {
        case '':
            return null;
        case 'car':
            return (
                <>
                    <Car {...props} />
                </>
            );
        case 'car-detail':
            return (
                <>
                    <CarDetail {...props} />
                </>
            );
        case 'rentitem':
            return (
                <>
                    <Rentitem {...props} />
                </>
            );
        case 'rentitem-detail':
            return (
                <>
                    <RentitemDetail {...props} />
                </>
            );
        case 'rentlist':
            return (
                <>
                    <Rentlist {...props} />
                </>
            );
        case 'rentlist-detail':
            return (
                <>
                    <RentlistDetail {...props} />
                </>
            );
        case 'car-list':
            return (
                <>
                    <CarList {...props} />
                </>
            );
        case 'customers':
            return (
                <>
                    <Customer {...props} />
                </>
            );
        case 'users':
            return (
                <>
                    <User {...props} />
                </>
            );
        default:
            return null;
    }
}

export default withRouter(DashBoardContent)

