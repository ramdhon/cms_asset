import React from 'react'
import { Button, Image } from 'react-bootstrap';

import { server } from '../api/database'
import { formatNumber, printStr, printDate } from '../helpers'

export default function RowTableNewModel(props) {

    let { value, index, key_model, type } = props

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
                                : ( type[el] && type[el].toLowerCase() === 'boolean' ? JSON.stringify(value[el]) : printStr(value[el])
                                )))
                            } 
                        </td>
                    )
                })
            }
            <td align='center' >{ printStr(printDate(value.created)) }</td>
            <td align='center' >{ printStr(printDate(value.updated)) }</td>
            <td align='center' colSpan={2}>
                <Button className='m-1' size='sm' onClick={(e) => props.edit(value)}><i className="fas fa-edit"></i></Button>
                <Button variant="danger" size='sm' onClick={(e) => props.delete(value._id)}><i className="fas fa-trash"></i></Button>
            </td>
        </tr>  
        </>
    )
}
