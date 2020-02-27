import React from 'react'
import { withRouter } from 'react-router-dom';
import Car from './Car' 
import CarDetail from './CarDetail'
        
import Rentitem from './Rentitem' 
import RentitemDetail from './RentitemDetail'
        
import Rentlist from './Rentlist' 
import RentlistDetail from './RentlistDetail'

import CarList from './CarList'
        
//new-component

function DashBoardContent(props) {
    const linkPath = props.match.params.id

    switch (linkPath) {
        case '':
            return null;
        case 'car':
            return (
                <>
                    <Car />
                </>
            );
        case 'car-detail':
            return (
                <>
                    <CarDetail />
                </>
            );
        case 'rentitem':
            return (
                <>
                    <Rentitem />
                </>
            );
        case 'rentitem-detail':
            return (
                <>
                    <RentitemDetail />
                </>
            );
        case 'rentlist':
            return (
                <>
                    <Rentlist />
                </>
            );
        case 'rentlist-detail':
            return (
                <>
                    <RentlistDetail />
                </>
            );
        case 'car-list':
            return (
                <>
                    <CarList />
                </>
            )
        default:
            return null;
    }
}

export default withRouter(DashBoardContent)

