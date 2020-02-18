const Rentlist = require('../models/Rentlist');
class RentlistController {
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

        Rentlist.create(createObj)
            .then(created => {
                res.status(201).json({
                    newRentlist: created,
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
                //         error: 'error createNewRentlist'
                //     })
                // }
            })
    }

    static findOne(req,res, next) {
        const { id } = req.params

        Rentlist.findOne({_id: id})
            .then(rentlistFindOne => {
                if(!rentlistFindOne) {
                    const err = {
                        message: 'fineOneRentlist not found',
                        status: 404,
                    }
                    next(err)
                } else {
                    res.status(200).json({
                        Rentlist: rentlistFindOne,
                        message: 'success'
                    })
                }
            })
            .catch(err => {
                next(err)
                // res.status(500).json({
                //     message: err.message,
                //     error: 'error findOneRentlist'
                // })
            })
    }

    static findAll(req,res, next) {
        //add query above, alter below as needed
        let query = {};
        const { populateUser, populateCar, populateItem } = req.query

        if(req.query.search) {
            let search = new RegExp(req.query.search)
            query = { $or: [
                {customer: { $regex: search, $options: 'i' }}, 
                {type: { $regex: search, $options: 'i' }}, 
                {startPeriod: { $regex: search, $options: 'i' }}, 
                {endPeriod: { $regex: search, $options: 'i' }}, 
                {rentItemId: { $regex: search, $options: 'i' }}, 
                //sulap-add-query
            ]}
        }

        Rentlist.find(query)
            .populate({
                path: populateUser === 'true' ? 'refId' : '',
                select: populateUser && ['_id', 'name', 'email']
            })
            .populate({
                path: populateItem === 'true' ? 'rentItemId' : '',
                populate: [{
                    path: populateUser === 'true' ? 'refId' : '',
                    select: populateUser && ['_id', 'name', 'email']
                },
                {
                    path: populateCar === 'true' ? 'carId' : ''
                }]
            })
            .then(rentlistFindAll => {
                if(rentlistFindAll.length === 0) {
                    res.status(200).json({
                        message: 'No data yet in findAllRentlist'
                    })
                } else {
                    res.status(200).json({
                        Rentlists:rentlistFindAll,
                        message: 'success'
                    })
                }
            })
            .catch(err => {
                next(err)
                // res.status(500).json({
                //     message: err.message,
                //     error: 'error findAll rentlist'
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
 
        Rentlist.findOneAndUpdate({_id: id}, updateObj, { new:true })
            .then(rentlistUpdated => {
                // console.log(rentlistUpdated, '---- rentlist updated patch')

                res.status(201).json({
                    message: 'success',
                    updatedRentlist: rentlistUpdated,
                })
            })
            .catch(err => {
                next(err)
                // res.status(500).json({
                //     message: err.message,
                //     error: 'error findOneAndUpdateOne rentlist'
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

        Rentlist.findOneAndUpdate({_id: id}, updateObj, { new:true })
            .then(rentlistUpdated => {
                res.status(201).json({
                    updatedRentlist:rentlistUpdated,
                    message: 'success'
                })
            })
            .catch(err => {
                next(err)
                // res.status(500).json({
                //     message: err.message,
                //     error: 'error findOneAndUpdateOne rentlist'
                // })
            })
    }

    static deleteOne(req,res, next) {
        const { id } = req.params
        
        Rentlist.findOneAndDelete({ _id: id })
            .then(rentlistDeleted => {
                res.status(200).json({
                    deletedRentlist: rentlistDeleted,
                    message: 'success'
                })
            })
            .catch(err => {
                next(err)
                // res.status(500).json({
                //     message: err.message,
                //     error: 'error findOneAndDelete rentlist'
                // })
            })
    }

}
module.exports = RentlistController