import {
    comparePasswords,
    findByUsername,
    findById,
    findAllUsers,
    createUser,
} from './lib/users.js';

import { 
    requireAuthentication,  
    
}  from './auth/passport.js';

app.post('/users/login', async (req, res) => {
    const { username, password = '' } = req.body;
  
    const user = await findByUsername(username);
  
    if (!user) {
      return res.status(401).json({ error: 'No such user' });
    }
  
    const passwordIsCorrect = await comparePasswords(password, user.password);
  
    if (passwordIsCorrect) {
      const payload = { id: user.id };
      const tokenOptions = { expiresIn: tokenLifetime };
      const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
      return res.json({ token });
    }
  
    return res.status(401).json({ error: 'Invalid password' });
  });

  app.get('/users', requireAuthentication, async (req, res) => {
    if (req.user.admin === true) {
      const listOfAllUsers = await findAllUsers();
      return res.json({ listOfAllUsers });
    }
    return res.status(401).json({ error: 'Need admin priviliges to'})
  });
  
  app.post('/users/register', async (req, res) => {
    const { name, username, password = '' } = req.body;
  
    if (!name || !username || !password) {
      return res.status(401).json({ error: 'Please provide name, username and password' });
    }
    const createdUser = await createUser(name, username, password, false);
  
    if (createdUser) {
      return res.json({ name, username });
    }
    return res.json({ data: 'User was not created, please try again with different username' });
  });
  
  app.get('/users/me', requireAuthentication, async (req, res) => {
    console.error(req.user.id);
    const audkenni = req.user.id;
    const nafn = req.user.name;
    res.json({ audkenni, nafn });
  });
  
  app.get('/users/:id', requireAuthentication, async (req, res) => {
    const { id } = req.params;
    const user = await findById(id);
    if (req.user.admin === true) {
      return res.json(user);
    }
    return res.json({ data: 'Need admin privileges to continue' });
  });