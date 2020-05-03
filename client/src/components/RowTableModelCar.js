import React from 'react'
import { Button, Image } from 'react-bootstrap';
import moment from 'moment';
import { server } from '../api/database'
import { formatNumber } from '../helpers'


export default function RowTableNewModel(props) {

    let { value, index, key_model, type } = props
    // key_model = key_model.map( el=> {
    //     return el.toLowerCase()
    // })

    function showModalImage(e, el){
        e.preventDefault()
        props.showImage(true)
        props.imageLink(`${server}/uploads/${value[el]}`) 
    }

    return (
        <>
        <tr>
            <td>{ index+1 }</td>
            <td>{ value._id }</td>
            {
                key_model.map( (el, elIndex) => {
                    return (
                        <td  align='center' key={ elIndex }> 
                            { 
                                ( type[el] && type[el].toLowerCase() === 'image' && value[el] ?
                                <Image width="50px" height='50px'src={ `${server}/uploads/${value[el]}`} 
                                    roundedCircle 
                                    style={{ cursor:'pointer' }}
                                    onClick={(e) => showModalImage(e, el) }
                                /> 
                                : ( el === 'price' ? formatNumber(value[el])
                                : ( type[el] && type[el].toLowerCase() === 'boolean' ? JSON.stringify(value[el]) : value[el] || '-'
                                )))
                            } 
                        </td>
                    )
                })
            }
            <td align='center' >{ moment(value.created).format('MMMM Do YYYY, h:mm:ss a') }</td>
            <td align='center' >{ moment(value.updated).format('MMMM Do YYYY, h:mm:ss a') }</td>
            <td align='center' colSpan={2}>
                <Button className='m-1' size='sm' onClick={(e) => props.edit(value)}><i className="fas fa-edit"></i></Button>
                <Button variant="danger" size='sm' onClick={(e) => props.delete(value._id)}><i className="fas fa-trash"></i></Button>
            </td>
        </tr>  
        </>
    )
}
