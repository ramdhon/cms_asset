import React from 'react'
import { Button, Image } from 'react-bootstrap';

import { server } from '../api/database';
import { printBlur, printStr, printDate } from '../helpers';

export default function RowTableNewModel(props) {

    let { decode, value, index, key_model, type } = props

    function showModalImage(e, el){
        e.preventDefault()
        props.showImage(true)
        props.imageLink(`${server}/uploads/${value[el]}`) 
    }

    return (
        <>
        <tr>
            <td>{ index+1 }</td>
            <td align='center' >{printBlur(value._id)}</td>
            {
                key_model.map( (el, elIndex) => {
                    return ( 
                        <td  align='center' key={ elIndex }> 
                            { ( type[el] && type[el].toLowerCase() === 'image' && value[el] ?
                            <Image width="50px" height='50px'src={ `${server}/uploads/${value[el]}`} 
                                roundedCircle 
                                style={{ cursor:'pointer' }}
                                onClick={(e) => showModalImage(e, el) }/> 
                            : ( el === 'password' ? '*****'
                            : ( type[el] && type[el].toLowerCase() === 'boolean' ? JSON.stringify(value[el]) : printStr(value[el])
                            )))}
                        </td>
                    )
                })
            }
            <td align='center' >{ printStr(printDate(value.lastLogin)) }</td>
            <td align='center' >{ printStr(printDate(value.created)) }</td>
            <td align='center' >{ printStr(printDate(value.updated)) }</td>
            <td align='center' colSpan={2}>
                <Button variant="outline-primary" className='m-1' size='sm' onClick={(e) => props.edit(value)}><i className="fas fa-edit"></i></Button>
                <Button variant={decode._id === value._id ? 'secondary' : 'danger'} className='m-1' size='sm' onClick={(e) => props.delete(value._id)} disabled={decode._id === value._id}><i className="fas fa-trash"></i></Button>
                <Button variant="warning" className='m-1' size='sm' onClick={(e) => props.handleShowPass(value._id)}><i className="fas fa-key"></i></Button>
            </td>
        </tr>  
        </>
    )
}
