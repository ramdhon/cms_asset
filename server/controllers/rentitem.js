const Rentitem = require('../models/Rentitem');
const { Types } = require('mongoose');
class RentitemController {
    static create(req,res, next) {
        let createObj = {}
        
        const keys = Object.keys(req.body)
        //loop the keys, add existing keys from req.body
        keys.forEach(el => {
            createObj[el] = req.body[el]
        })

        // console.log(req.decoded._id, '---- decoded')
        createObj.refId = req.decoded._id
        createObj.created = new Date()
        createObj.updated = new Date()

        Rentitem.create(createObj)
            .then(created => {
                res.status(201).json({
                    newRentitem: created,
                    message: 'success'
                })
            })
            .catch(err => {
                next(err)
                // if(err.errors.name) {
                //     res.status(400).json({
                //         message: err.message,
                //     })
                // } else {
                //     res.status(500).json({
                //         message: err.message,
                //         error: 'error createNewRentitem'
                //     })
                // }
            })
    }

    static findOne(req,res, next) {
        const { id } = req.params
        const { populateUser, populateCar } = req.query

        Rentitem.findOne({_id: id})
            .populate({
                path: populateUser === 'true' ? 'refId' : '',
                select: populateUser && ['_id', 'name', 'email']
            })
            .populate({
                path: populateCar === 'true' ? 'carId' : '',
            })
            .then(rentitemFindOne => {
                if(!rentitemFindOne) {
                    const err = {
                        message: 'fineOneRentitem not found',
                        status: 404,
                    }
                    next(err)
                } else {
                    res.status(200).json({
                        Rentitem: rentitemFindOne,
                        message: 'success'
                    })
                }
            })
            .catch(err => {
                next(err)
                // res.status(500).json({
                //     message: err.message,
                //     error: 'error findOneRentitem'
                // })
            })
    }

    static findAll(req,res, next) {
        //add query above, alter below as needed
        let query = {};
        const { populateUser, populateCar } = req.query

        if(req.query.search) {
            let search = new RegExp(req.query.search)
            query = { $or: [
                {currency: { $regex: search, $options: 'i' }}, 
                {carId: Types.ObjectId.isValid(req.query.search) ? req.query.search : undefined}, 
                //sulap-add-query
            ]}
        }

        Rentitem.find(query)
            .populate({
                path: populateUser === 'true' ? 'refId' : '',
                select: populateUser && ['_id', 'name', 'email']
            })
            .populate({
                path: populateCar === 'true' ? 'carId' : ''
            })
            .then(rentitemFindAll => {
                if(rentitemFindAll.length === 0) {
                    res.status(200).json({
                        message: 'No data yet in findAllRentitem'
                    })
                } else {
                    res.status(200).json({
                        Rentitems:rentitemFindAll,
                        message: 'success'
                    })
                }
            })
            .catch(err => {
                next(err)
                // res.status(500).json({
                //     message: err.message,
                //     error: 'error findAll rentitem'
                // })
            })
    }

    static updateOnePatch(req,res, next) {
        const { id } = req.params
        let updateObj = {}
        const keys = Object.keys(req.body)
        //loop the keys, add existing keys from req.body
        keys.forEach(el => {
            updateObj[el] = req.body[el]
        })
        updateObj.updated = new Date()
 
        Rentitem.findOneAndUpdate({_id: id}, updateObj, { new:true })
            .then(rentitemUpdated => {
                // console.log(rentitemUpdated, '---- rentitem updated patch')

                res.status(201).json({
                    message: 'success',
                    updatedRentitem: rentitemUpdated,
                })
            })
            .catch(err => {
                next(err)
                // res.status(500).json({
                //     message: err.message,
                //     error: 'error findOneAndUpdateOne rentitem'
                // })
            })
    }

    static updateOnePut(req,res, next) {
        const { id } = req.params
        let updateObj = {}
        const keys = Object.keys(req.body)
        //loop the keys, add existing keys from req.body
        keys.forEach(el => {
            updateObj[el] = req.body[el]
        })
        updateObj.updated = new Date()

        Rentitem.findOneAndUpdate({_id: id}, updateObj, { new:true })
            .then(rentitemUpdated => {
                res.status(201).json({
                    updatedRentitem:rentitemUpdated,
                    message: 'success'
                })
            })
            .catch(err => {
                next(err)
                // res.status(500).json({
                //     message: err.message,
                //     error: 'error findOneAndUpdateOne rentitem'
                // })
            })
    }

    static deleteOne(req,res, next) {
        const { id } = req.params
        
        Rentitem.findOneAndDelete({ _id: id })
            .then(rentitemDeleted => {
                res.status(200).json({
                    deletedRentitem: rentitemDeleted,
                    message: 'success'
                })
            })
            .catch(err => {
                next(err)
                // res.status(500).json({
                //     message: err.message,
                //     error: 'error findOneAndDelete rentitem'
                // })
            })
    }

}
module.exports = RentitemController