const Car = require('../models/Car');
class CarController {
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

        Car.create(createObj)
        .then(created => {
            res.status(201).json({
                newCar: created,
                message: 'success createNewCar'
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
            //         error: 'error createNewCar'
            //     })
            // }
        })
    }

    static findOne(req,res, next) {
        const { id } = req.params

        Car.findOne({_id: id})
        .then(carFindOne => {
            if(!carFindOne) {
                const err = {
                    message: 'fineOneCar not found',
                    status: 404,
                }
                next(err)
            } else {
                res.status(200).json({
                    Car: carFindOne,
                    message: 'success findOneCar'
                })
            }
        })
        .catch(err => {
            next(err)
            // res.status(500).json({
            //     message: err.message,
            //     error: 'error findOneCar'
            // })
        })
    }

    static findAll(req,res, next) {
        //add query above, alter below as needed
        let query = {};
        if(req.query.search) {
            let search = new RegExp(req.query.search)
            query = { $or: [
                {brand: { $regex: search, $options: 'i' }}, 
{type: { $regex: search, $options: 'i' }}, 
{policeNo: { $regex: search, $options: 'i' }}, 
{vin: { $regex: search, $options: 'i' }}, 
{currency: { $regex: search, $options: 'i' }}, 
{status: { $regex: search, $options: 'i' }}, 
//sulap-add-query
            ]}
        }

        Car.find(query)
        .then(carFindAll => {
            if(carFindAll.length === 0) {
                res.status(200).json({
                    message: 'No data yet in findAllCar'
                })
            } else {
                res.status(200).json({
                    Cars:carFindAll,
                    message: 'success findAllCar'
                })
            }
        })
        .catch(err => {
            next(err)
            // res.status(500).json({
            //     message: err.message,
            //     error: 'error findAll car'
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
 
        Car.findOneAndUpdate({_id: id}, updateObj, { new:true })
        .then(carUpdated => {
            // console.log(carUpdated, '---- car updated patch')

            res.status(201).json({
                message: 'success updateOnePatchCar',
                updatedCar: carUpdated,
            })
        })
        .catch(err => {
            next(err)
            // res.status(500).json({
            //     message: err.message,
            //     error: 'error findOneAndUpdateOne car'
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

        Car.findOneAndUpdate({_id: id}, updateObj, { new:true })
        .then(carUpdated => {
            res.status(201).json({
                updatedCar:carUpdated,
                message: 'findOneAndUpdateCar success'
            })
        })
        .catch(err => {
            next(err)
            // res.status(500).json({
            //     message: err.message,
            //     error: 'error findOneAndUpdateOne car'
            // })
        })
    }

    static deleteOne(req,res, next) {
        const { id } = req.params
        
        Car.findOneAndDelete({ _id: id })
        .then(carDeleted => {
            res.status(200).json({
                deletedCar: carDeleted,
                message: 'findOneAndDeleteCar success'
            })
        })
        .catch(err => {
            next(err)
            // res.status(500).json({
            //     message: err.message,
            //     error: 'error findOneAndDelete car'
            // })
        })
    }

}
module.exports = CarController