import React from 'react'
import { Button, Image } from 'react-bootstrap';
import moment from 'moment';
import { server } from '../api/database'

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

    function formatNumber(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        
            const negativeSign = amount < 0 ? "-" : "";
        
            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;
        
            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <>
        <tr>
            <td>{ index+1 }</td>
            {/* {
                Object.keys(value.carId).map((el, elIndex) => {
                    return ( !(el === 'updated' || el === 'created' || el === '_id' || !key_model.includes(el) || el === 'currency') ?
                        <td  align='center' key={ elIndex }> 
                            { el ==='created' || el === 'updated' ?  moment(value.carId[el]).format('MMMM Do YYYY, h:mm:ss a') 
                            : ( type[el] && type[el].toLowerCase() === 'image' && value.carId[el] ?
                            <Image width="50px" height='50px'src={ `${server}/uploads/${value.carId[el]}`} 
                                roundedCircle 
                                style={{ cursor:'pointer' }}
                                onClick={(e) => showModalImage(e, el) }/> 
                            : ( type[el] && type[el].toLowerCase() === 'boolean' ? formatNumber(value.carId[el], 2) : value.carId[el]
                        ))}
                        </td>
                    : null
                    )
                })
            } */}
            {
                Object.keys(value).map( (el, elIndex) => {
                    return ( (el ==='updated' || el ==='created' || key_model.includes(el)) && el !=='_id' ? 
                        <td  align='center' key={ elIndex }> 
                            { el ==='created' || el === 'updated' || el === 'startPeriod' || el === 'endPeriod' ?  moment(value[el]).format('MMMM Do YYYY, h:mm:ss a') 
                            : ( type[el] && type[el].toLowerCase() === 'image' && value[el] ?
                            <Image width="50px" height='50px'src={ `${server}/uploads/${value[el]}`} 
                                roundedCircle 
                                style={{ cursor:'pointer' }}
                                onClick={(e) => showModalImage(e, el) }/> 
                            : ( type[el] && type[el].toLowerCase() === 'boolean' ? JSON.stringify(value[el])
                            : ( type[el] && type[el].toLowerCase() === 'number' ? formatNumber(value[el]) : value[el]
                        )))}
                        </td> : null  )
                })
            }
            <td align='center' colSpan={2}> <Button className='m-1' size='sm' onClick={(e) => props.edit(value)}><i className="fas fa-edit"></i></Button> <Button size='sm' onClick={(e) => props.delete(value._id)}><i className="fas fa-trash"></i></Button> </td>
        </tr>  
        </>
    )
}
