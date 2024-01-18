import ListTripModel from '../models/ListTripModel.js'
import RumaModel from '../models/RumaModel.js'

export const getAllRumas = async (req, res) => {
    try {

        const rumas = await RumaModel.find({valid: 1}, { _id: 0, travels: 0, data: 0, rumas_united: 0, createdAt: 0})

        return res.status(200).json(rumas)
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getRuma = async (req, res) => {
    try {

        const ruma_Id = req.params.ruma_Id

        const ruma = await RumaModel.findOne({ruma_Id: ruma_Id})

        if(!ruma) {
            return res.status(200).json({ status: false, message: 'Ruma not found' })
        }

        return res.status(200).json(ruma)
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const createRuma = async (req, res) => {
    try {

        const lastRuma = await RumaModel.findOne().sort({ _id: -1 }).limit(1);

        let newRumaId;

        if (lastRuma) {
            const currentYear = new Date().getFullYear();

            const lastRumaYear = parseInt(lastRuma.ruma_Id.split('-')[1], 10);

            let newRumaNumber;

            if (currentYear === lastRumaYear) {
                const lastRumaNumber = parseInt(lastRuma.ruma_Id.split('-')[2], 10);
                newRumaNumber = lastRumaNumber + 1;
            } else {
                newRumaNumber = 1;
            }

            newRumaId = `CA-${currentYear}-${('0000' + newRumaNumber).slice(-4)}`;
        } else {
            newRumaId = 'CA-2024-0001';
        }

        const newRuma = new RumaModel({
            ruma_Id: newRumaId,
            valid: 1
        });

        await newRuma.save();

        return res.status(200).json({ status: true, message: 'Ruma creada exitosamente' });

    } catch (error) {
        res.json({ message: error.message });
    }
};

export const updateRuma = async (req, res) => {
    try {

        const ruma_Id = req.params.ruma_Id

        const ruma = await RumaModel.findOne({ruma_Id: ruma_Id})

        if(!ruma) {
            return res.status(200).json({ status: false, message: 'Ruma not found' })
        }

        await RumaModel.updateOne({ruma_Id: ruma_Id}, req.body)

        return res.status(200).json({ status: true, message: 'Ruma updated' })

    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteRuma = async (req, res) => {
    try {

        const ruma_Id = req.params.ruma_Id

        const rumaDeleted = await RumaModel.findOne({ruma_Id: ruma_Id})

        if(!rumaDeleted) {
            return res.status(200).json({ status: false, message: 'No existe la ruma' })
        }

        await RumaModel.deleteOne({ruma_Id: ruma_Id})

        return res.status(200).json({ status: true, message: 'Ruma deleted' })

    } catch (error) {
        res.json({ message: error.message });
    }
}

// export const getListRumas = async (req, res) => {
//     try {
//         const rumas = await RumaModel.find({ valid: 1 }, { data: 0 });

//         const listTrip = await ListTripModel.find({ statusGeology: { $in: ['General', 'QualityControl'] } });

//         const rumasWithTon = rumas.map(ruma => {
//             const travelsWithTon = ruma.travels.map(travel => {
//                 const ton = listTrip.find(trip => trip._id.equals(travel));
//                 return {
//                     travel: travel,
//                     ton: ton ? ton.ton : null,
//                     tonh: ton ? ton.tonh : null
//                 };
//             });

//             return {
//                 ruma_Id: ruma.ruma_Id,
//                 travels: ruma.travels.length,
//                 rumas_united: ruma.rumas_united,
//                 valid: ruma.valid,
//                 ton: travelsWithTon.reduce((acc, cur) => acc + cur.ton, 0),
//                 tonh: travelsWithTon.reduce((acc, cur) => acc + cur.tonh, 0),
//                 createdAt: ruma.createdAt
//             };
//         });

//         const updateRumas = await Promise.all(rumasWithTon.map(async ruma => {
//             const updateRuma = await RumaModel.updateOne({ ruma_Id: ruma.ruma_Id }, { $set: { ton: ruma.ton, tonh: ruma.tonh } });
//             return updateRuma;
//         }));

//         return res.status(200).json(rumasWithTon);

//     } catch (error) {
//         res.json({ message: error.message });
//     }
// };

// export const getListRumas = async (req, res) => {
//     try {
//         const rumas = await RumaModel.find({ valid: 1 }, { data: 0 });

//         const listTrip = await ListTripModel.find({ statusGeology: { $in: ['General', 'QualityControl'] } });

//         const rumasWithTon = rumas.map(ruma => {
//             const travelsWithTon = ruma.travels.map(travel => {
//                 const ton = listTrip.find(trip => trip._id.equals(travel));
//                 return {
//                     travel: travel,
//                     ton: ton ? ton.ton : null,
//                     tonh: ton ? ton.tonh : null
//                 };
//             });

//             return {
//                 ruma_Id: ruma.ruma_Id,
//                 travels: ruma.travels.length,
//                 rumas_united: ruma.rumas_united,
//                 valid: ruma.valid,
//                 // ton: travelsWithTon.reduce((acc, cur) => acc + cur.ton, 0),
//                 // tonh: travelsWithTon.reduce((acc, cur) => acc + cur.tonh, 0),
//                 ton: ruma.ton,
//                 tonh: ruma.tonh,
//                 createdAt: ruma.createdAt
//             };
//         });

//         const updateRumas = await Promise.all(rumasWithTon.map(async ruma => {
//             // await RumaModel.updateOne({ ruma_Id: ruma.ruma_Id }, { $set: { ton: ruma.ton, tonh: ruma.tonh } });
//             await RumaModel.updateOne({ ruma_Id: ruma.ruma_Id }, { $set: { ton: travelsWithTon.reduce((acc, cur) => acc + cur.ton, 0), tonh: travelsWithTon.reduce((acc, cur) => acc + cur.tonh, 0) } });
//         }));

//         const rumasNuevas = await RumaModel.find({ valid: 1 }, { data: 0 });

//         // return res.status(200).json(rumasWithTon);
//         return res.status(200).json(rumasNuevas);

//     } catch (error) {
//         res.json({ message: error.message });
//     }
// };


export const getListRumas = async (req, res) => {
    try {

        // // Obtener rumas válidos sin el campo 'data'
        // // const rumas = await RumaModel.find({ valid: 1 }, { data: 0 });
        const rumas = await RumaModel.find()
        // console.log(rumas);

        // Obtener viajes con estado 'General' o 'QualityControl'
        const listTrip = await ListTripModel.find({ statusGeology: { $in: ['General', 'QualityControl'] } });
        // console.log(listTrip);

        // Mapear rumas y agregar información de toneladas
        const rumasWithTon = rumas.map(ruma => {
            const travelsWithTon = ruma.travels.map(travel => {
                const ton = listTrip.find(trip => trip._id.equals(travel));
                return {
                    travel: travel,
                    ton: ton ? ton.ton : null,
                    tonh: ton ? ton.tonh : nullgit
                };
            });

            // console.log(travelsWithTon);

            return {
                ruma_Id: ruma.ruma_Id,
                travels: ruma.travels.length,
                rumas_united: ruma.rumas_united,
                valid: ruma.valid,
                ton: travelsWithTon.reduce((acc, cur) => acc + (cur.ton || 0), 0),
                tonh: travelsWithTon.reduce((acc, cur) => acc + (cur.tonh || 0), 0),
                createdAt: ruma.createdAt
            };
        });

        console.log(rumasWithTon);

        // Actualizar las toneladas en las rumas
        const updateRumas = await Promise.all(rumasWithTon.map(async ruma => {
            await RumaModel.updateOne({ ruma_Id: ruma.ruma_Id }, { $set: { ton: ruma.ton, tonh: ruma.tonh } });
        }));


        // Obtener las rumas actualizadas después de la actualización
        const rumasNuevas = await RumaModel.find({ valid: 1 }, { _id: 0, data: 0 });

        const rumasNuevasFinal = rumasNuevas.map(ruma => {
            return {
                ruma_Id: ruma.ruma_Id,
                travels: ruma.travels.length,
                rumas_united: ruma.rumas_united,
                valid: ruma.valid,
                ton: ruma.ton,
                tonh: ruma.tonh,
                createdAt: ruma.createdAt
            };
        });

        // Enviar las rumas actualizadas en la respuesta
        return res.status(200).json(rumasNuevasFinal);

    } catch (error) {
        res.json({ message: error.message });
    }
};


// export const updateOrCreateRumas = async (req, res) => {
//     try {
//         const rumas = req.body.rumas;

//         const updateRumas = await Promise.all(rumas.map(async ruma => {
//             const updateRuma = await RumaModel.updateOne({ ruma_Id: ruma.ruma_Id }, { $set: { valid: 0 } });
//             console.log(updateRuma);
//             return updateRuma;
//         }));

//         const lastRuma = await RumaModel.findOne().sort({ _id: -1 }).limit(1);
//         let newRumaId;

//         if (lastRuma) {
//             const currentYear = new Date().getFullYear();
//             const lastRumaYear = parseInt(lastRuma.ruma_Id.split('-')[1], 10);
//             let newRumaNumber;

//             if (currentYear === lastRumaYear) {
//                 const lastRumaNumber = parseInt(lastRuma.ruma_Id.split('-')[2], 10);
//                 newRumaNumber = lastRumaNumber + 1;
//             } else {
//                 newRumaNumber = 1;
//             }

//             newRumaId = `CA-${currentYear}-${('0000' + newRumaNumber).slice(-4)}`;
//         } else {
//             newRumaId = 'CA-2024-0001';
//         }

//         const newRuma = new RumaModel({
//             ruma_Id: newRumaId,
//             valid: 1
//         });

//         await newRuma.save();

//         return res.status(200).json({ status: true, message: 'Rumas updated and/or created successfully' });

//     } catch (error) {
//         res.json({ message: error.message });
//     }
// };

export const updateOrCreateRumas = async (req, res) => {
    try {
        const rumas = req.body.rumas;

        console.log(rumas);

        const rumaIds = rumas.map(ruma => ruma.ruma_Id)
        const ton = rumas.map(ruma => ruma.ton)
        const tonh = rumas.map(ruma => ruma.tonh)

        const updateRumas = await Promise.all(rumas.map(async ruma => {
            const updateRuma = await RumaModel.updateOne({ ruma_Id: ruma.ruma_Id }, { $set: { valid: 0 } });
            return updateRuma;
        }));

        const lastRuma = await RumaModel.findOne().sort({ _id: -1 }).limit(1);
        let newRumaId;

        if (lastRuma) {
            const currentYear = new Date().getFullYear();
            const lastRumaYear = parseInt(lastRuma.ruma_Id.split('-')[1], 10);
            let newRumaNumber;

            if (currentYear === lastRumaYear) {
                const lastRumaNumber = parseInt(lastRuma.ruma_Id.split('-')[2], 10);
                newRumaNumber = lastRumaNumber + 1;
            } else {
                newRumaNumber = 1;
            }

            newRumaId = `CA-${currentYear}-${('0000' + newRumaNumber).slice(-4)}`;
        } else {
            newRumaId = 'CA-2024-0001';
        }

        const newRuma = new RumaModel({
            ruma_Id: newRumaId,
            valid: 1,
            rumas_united: rumaIds,
            ton: ton.reduce((acc, cur) => acc + cur, 0),
            tonh: tonh.reduce((acc, cur) => acc + cur, 0),
        });

        console.log(newRuma);

        await newRuma.save();

        return res.status(200).json({ status: true, message: 'Las rumas antiguas se han unido y se ha creado una nueva ruma' });

    } catch (error) {
        res.json({ message: error.message });
    }
};