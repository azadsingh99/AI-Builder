
            const User = require('../model/User.js');
            const UserCreation = async(req, res) => {
                try{
                    const { name, email, age, createdAt } = req.body;

                    const UserObject = {name: name,
email: email,
age: age,
createdAt: createdAt}
                    const newUser = new User(UserObject);
                    await newUser.save();

                    return res.status(201).json({success : 'Data Inserted'});
                }catch(err){
                    console.log('ERROR ::::: ', err);
                    return res.status(500).json({err : 'Something went wrong'})
                }
            }

            const UserUpdation = async (req, res) => {
                try {
                    const { name, email, age, createdAt } = req.body;
                    const UserObject = {name: name,
email: email,
age: age,
createdAt: createdAt};
                    
                    const updatedUser = await User.findByIdAndUpdate(req.params.id, UserObject, { new: true });
                    if (!updatedUser) {
                        return res.status(404).json({ err: 'User not found' });
                    }

                    return res.status(200).json(updatedUser);
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    return res.status(500).json({ err: 'Something went wrong' });
                }
            };

            const UsergetAll = async (req, res) => {
                try {
                    const Users = await User.find();
                    res.status(200).json(Users);
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    res.status(500).json({ err: 'Something went wrong' });
                }
            };

            
            const getUserById = async (req, res) => {
                try {
                    const Users = await User.findById(req.params.id);
                    if (!Users) {
                        return res.status(404).json({ err: 'User not found' });
                    }
                    res.status(200).json(Users);
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    res.status(500).json({ err: 'Something went wrong' });
                }
            };

             
            const Userdeletion = async (req, res) => {
                try {
                    const Users = await User.findByIdAndDelete(req.params.id);
                    if (!Users) {
                        return res.status(404).json({ err: 'User not found' });
                    }
                    res.status(200).json({ msg: 'User deleted successfully' });
                } catch (err) {
                    console.log('ERROR ::::: ', err);
                    res.status(500).json({ err: 'Something went wrong' });
                }
            };

            module.exports = {
                UserCreation,
                UserUpdation,
                UsergetAll,
                getUserById,
                Userdeletion
            }
        