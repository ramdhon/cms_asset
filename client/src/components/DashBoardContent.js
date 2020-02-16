import React from 'react'
import { withRouter } from 'react-router-dom';
import Car from './Car' 
import CarDetail from './CarDetail'
        
import Rentitem from './Rentitem' 
import RentitemDetail from './RentitemDetail'
        
import Rentlist from './Rentlist' 
import RentlistDetail from './RentlistDetail'
        
//new-component

function DashBoardContent(props) {
    const linkPath = props.match.params.id

    if(linkPath === '') {
        return ( null)
     }  else if(linkPath === 'car') {
            return (
                <>
                    <Car  />
                </>
            )
         } else if(linkPath === 'car-detail') {
            return (
                <>
                    <CarDetail />
                </>
            )
         }else if(linkPath === 'rentitem') {
            return (
                <>
                    <Rentitem  />
                </>
            )
         } else if(linkPath === 'rentitem-detail') {
            return (
                <>
                    <RentitemDetail />
                </>
            )
         }else if(linkPath === 'rentlist') {
            return (
                <>
                    <Rentlist  />
                </>
            )
         } else if(linkPath === 'rentlist-detail') {
            return (
                <>
                    <RentlistDetail />
                </>
            )
         }//add-new-route
     else {
         return null
     }
}

export default withRouter(DashBoardContent)

