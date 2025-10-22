

const registerUser = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new UserModel({ name: username, email, password });
    await newUser.save();

  } catch (error) {
    next(error);
  }
  res.send('User registered');
}

const loginUser = (req, res) => {
  try {

  } catch (error) {
    next(error);
  }
    res.send('User logged in');
}

const adminLogin = async (req, res) => {
    try {



    } catch (error) {
        next(error);
    }
}


export { registerUser, loginUser, adminLogin };